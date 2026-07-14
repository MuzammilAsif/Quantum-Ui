import type { SecretsManager } from './SecretsManager';
import type { MessageBridge } from './MessageBridge';
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
export declare class AIGenerationService {
    private readonly secretsManager;
    private readonly messageBridge;
    private readonly outputChannel;
    constructor(secretsManager: SecretsManager, messageBridge: MessageBridge, outputChannel: {
        appendLine: (msg: string) => void;
    });
    /**
     * Build the system prompt that instructs the model how to generate
     * clean, framework-appropriate component code.
     */
    private buildSystemPrompt;
    /**
     * Generate a component and stream the result back to the webview.
     */
    generate(options: GenerateOptions): Promise<void>;
    /**
     * Make the streaming HTTPS request to OpenAI and forward chunks.
     */
    private streamCompletion;
    /**
     * Parse OpenAI's error response into a readable message.
     */
    private parseErrorResponse;
    /**
     * Convert technical errors into user-friendly messages.
     */
    private humanizeError;
    private sendChunk;
    private sendComplete;
    private sendError;
}
export {};
//# sourceMappingURL=AIGenerationService.d.ts.map