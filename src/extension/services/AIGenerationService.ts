import * as https from 'https';
import type { SecretsManager } from './SecretsManager';
import type { MessageBridge } from './MessageBridge';
import { MessageType } from '../../shared/types';

const OPENAI_API_HOST = 'api.openai.com';
const OPENAI_MODEL = 'gpt-4o-mini';

interface GenerateOptions {
  requestId: string;
  prompt: string;
  framework: string;
}

/**
 * AIGenerationService — calls the OpenAI API to generate UI component code.
 *
 * Runs entirely in the extension host (Node.js), never in the webview.
 * This is important: the API key never touches the webview's JS context,
 * which is the correct security boundary for a "bring your own key" model.
 *
 * Uses OpenAI's streaming Chat Completions API and forwards each token
 * chunk to the webview in real time via the MessageBridge.
 */
export class AIGenerationService {
  constructor(
    private readonly secretsManager: SecretsManager,
    private readonly messageBridge: MessageBridge,
    private readonly outputChannel: { appendLine: (msg: string) => void }
  ) {}

  /**
   * Build the system prompt that instructs the model how to generate
   * clean, framework-appropriate component code.
   */
  private buildSystemPrompt(framework: string): string {
    const frameworkInstructions: Record<string, string> = {
      react: 'Generate a single React functional component using TypeScript and Tailwind CSS utility classes. Use JSX syntax with className attributes. Do not include imports or exports — just the JSX markup and any needed React hooks inline.',
      html: 'Generate clean semantic HTML with Tailwind CSS utility classes. Use class attributes.',
      vue: 'Generate a Vue 3 single-file component using the Composition API and Tailwind CSS utility classes.',
    };

    const instruction = frameworkInstructions[framework] ?? frameworkInstructions.react;

    return `You are an expert UI component generator for Quantum UI, a VS Code extension component library.

${instruction}

Rules:
- Output ONLY the code, no explanations, no markdown code fences, no backticks
- Keep the design modern, clean, and using a dark theme aesthetic with purple/violet accents
- Use Tailwind CSS classes exclusively for styling
- Make the component visually polished and production-ready
- Do not include comments in the code
- Keep it concise — a single component, not a full page`;
  }

  /**
   * Generate a component and stream the result back to the webview.
   */
  async generate(options: GenerateOptions): Promise<void> {
    const { requestId, prompt, framework } = options;

    const apiKey = await this.secretsManager.getApiKey();

    if (!apiKey) {
      await this.sendError(requestId, 'No API key configured. Add your OpenAI API key in Settings.');
      return;
    }

    try {
      await this.streamCompletion(apiKey, prompt, framework, requestId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      this.outputChannel.appendLine(`[AIGenerationService] Error: ${message}`);
      await this.sendError(requestId, this.humanizeError(message));
    }
  }

  /**
   * Make the streaming HTTPS request to OpenAI and forward chunks.
   */
  private streamCompletion(
    apiKey: string,
    prompt: string,
    framework: string,
    requestId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: this.buildSystemPrompt(framework) },
          { role: 'user', content: prompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1500,
      });

      const req = https.request(
        {
          hostname: OPENAI_API_HOST,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          // Handle non-200 responses (auth errors, rate limits, etc.)
          if (res.statusCode !== 200) {
            let errorBody = '';
            res.on('data', (chunk) => { errorBody += chunk; });
            res.on('end', () => {
              reject(new Error(this.parseErrorResponse(res.statusCode ?? 0, errorBody)));
            });
            return;
          }

          let fullResult = '';
          let buffer = '';

          res.on('data', (chunk: Buffer) => {
            buffer += chunk.toString('utf-8');

            // OpenAI streams as Server-Sent Events: lines starting with "data: "
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? ''; // Keep incomplete line in buffer

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data: ')) continue;

              const data = trimmed.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const token = parsed.choices?.[0]?.delta?.content;

                if (token) {
                  fullResult += token;
                  void this.sendChunk(requestId, token);
                }
              } catch {
                // Skip malformed SSE lines silently
              }
            }
          });

          res.on('end', () => {
            void this.sendComplete(requestId, fullResult);
            resolve();
          });

          res.on('error', (err) => reject(err));
        }
      );

      req.on('error', (err) => reject(err));
      req.write(body);
      req.end();
    });
  }

  /**
   * Parse OpenAI's error response into a readable message.
   */
  private parseErrorResponse(statusCode: number, body: string): string {
    let rawMessage: string | undefined;
    let errorType: string | undefined;

    try {
      const parsed = JSON.parse(body) as { error?: { message?: string; type?: string; code?: string } };
      rawMessage = parsed.error?.message;
      errorType = parsed.error?.type ?? parsed.error?.code;
    } catch {
      // fall through
    }

    // Quota / billing specific messaging
    if (
      errorType === 'insufficient_quota' ||
      rawMessage?.toLowerCase().includes('quota') ||
      rawMessage?.toLowerCase().includes('billing')
    ) {
      return 'Your OpenAI account needs billing set up or has run out of credits. Add a payment method at platform.openai.com/settings/organization/billing.';
    }

    if (statusCode === 401) return 'Invalid API key. Please check your OpenAI API key in Settings.';
    if (statusCode === 429) return 'Rate limit reached. Please wait a moment and try again.';
    if (statusCode === 500) return 'OpenAI service error. Please try again shortly.';

    return rawMessage ?? `Request failed with status ${statusCode}`;
  }

  /**
   * Convert technical errors into user-friendly messages.
   */
  private humanizeError(message: string): string {
    if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
      return 'Could not connect to OpenAI. Check your internet connection.';
    }
    return message;
  }

  private async sendChunk(requestId: string, chunk: string): Promise<void> {
    await this.messageBridge.send({
      type: MessageType.AI_STREAM_CHUNK,
      payload: { chunk, requestId },
    });
  }

  private async sendComplete(requestId: string, result: string): Promise<void> {
    await this.messageBridge.send({
      type: MessageType.AI_STREAM_END,
      payload: { requestId, result },
    });
  }

  private async sendError(requestId: string, error: string): Promise<void> {
    await this.messageBridge.send({
      type: MessageType.AI_ERROR,
      payload: { requestId, error },
    });
  }
}