"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIGenerationService = void 0;
const https = __importStar(require("https"));
const types_1 = require("../../shared/types");
const OPENAI_API_HOST = 'api.openai.com';
const OPENAI_MODEL = 'gpt-4o-mini';
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
class AIGenerationService {
    constructor(secretsManager, messageBridge, outputChannel) {
        this.secretsManager = secretsManager;
        this.messageBridge = messageBridge;
        this.outputChannel = outputChannel;
    }
    /**
     * Build the system prompt that instructs the model how to generate
     * clean, framework-appropriate component code.
     */
    buildSystemPrompt(framework) {
        const frameworkInstructions = {
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
    async generate(options) {
        const { requestId, prompt, framework } = options;
        const apiKey = await this.secretsManager.getApiKey();
        if (!apiKey) {
            await this.sendError(requestId, 'No API key configured. Add your OpenAI API key in Settings.');
            return;
        }
        try {
            await this.streamCompletion(apiKey, prompt, framework, requestId);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            this.outputChannel.appendLine(`[AIGenerationService] Error: ${message}`);
            await this.sendError(requestId, this.humanizeError(message));
        }
    }
    /**
     * Make the streaming HTTPS request to OpenAI and forward chunks.
     */
    streamCompletion(apiKey, prompt, framework, requestId) {
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
            const req = https.request({
                hostname: OPENAI_API_HOST,
                path: '/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Length': Buffer.byteLength(body),
                },
            }, (res) => {
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
                res.on('data', (chunk) => {
                    buffer += chunk.toString('utf-8');
                    // OpenAI streams as Server-Sent Events: lines starting with "data: "
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? ''; // Keep incomplete line in buffer
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data: '))
                            continue;
                        const data = trimmed.slice(6);
                        if (data === '[DONE]')
                            continue;
                        try {
                            const parsed = JSON.parse(data);
                            const token = parsed.choices?.[0]?.delta?.content;
                            if (token) {
                                fullResult += token;
                                void this.sendChunk(requestId, token);
                            }
                        }
                        catch {
                            // Skip malformed SSE lines silently
                        }
                    }
                });
                res.on('end', () => {
                    void this.sendComplete(requestId, fullResult);
                    resolve();
                });
                res.on('error', (err) => reject(err));
            });
            req.on('error', (err) => reject(err));
            req.write(body);
            req.end();
        });
    }
    /**
     * Parse OpenAI's error response into a readable message.
     */
    parseErrorResponse(statusCode, body) {
        let rawMessage;
        let errorType;
        try {
            const parsed = JSON.parse(body);
            rawMessage = parsed.error?.message;
            errorType = parsed.error?.type ?? parsed.error?.code;
        }
        catch {
            // fall through
        }
        // Quota / billing specific messaging
        if (errorType === 'insufficient_quota' ||
            rawMessage?.toLowerCase().includes('quota') ||
            rawMessage?.toLowerCase().includes('billing')) {
            return 'Your OpenAI account needs billing set up or has run out of credits. Add a payment method at platform.openai.com/settings/organization/billing.';
        }
        if (statusCode === 401)
            return 'Invalid API key. Please check your OpenAI API key in Settings.';
        if (statusCode === 429)
            return 'Rate limit reached. Please wait a moment and try again.';
        if (statusCode === 500)
            return 'OpenAI service error. Please try again shortly.';
        return rawMessage ?? `Request failed with status ${statusCode}`;
    }
    /**
     * Convert technical errors into user-friendly messages.
     */
    humanizeError(message) {
        if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
            return 'Could not connect to OpenAI. Check your internet connection.';
        }
        return message;
    }
    async sendChunk(requestId, chunk) {
        await this.messageBridge.send({
            type: types_1.MessageType.AI_STREAM_CHUNK,
            payload: { chunk, requestId },
        });
    }
    async sendComplete(requestId, result) {
        await this.messageBridge.send({
            type: types_1.MessageType.AI_STREAM_END,
            payload: { requestId, result },
        });
    }
    async sendError(requestId, error) {
        await this.messageBridge.send({
            type: types_1.MessageType.AI_ERROR,
            payload: { requestId, error },
        });
    }
}
exports.AIGenerationService = AIGenerationService;
//# sourceMappingURL=AIGenerationService.js.map