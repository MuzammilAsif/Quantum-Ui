import type { SecretsManager } from './SecretsManager';
import type { MessageBridge } from './MessageBridge';
interface GenerateOptions {
    requestId: string;
    prompt: string;
    framework: string;
}
export declare class AIGenerationService {
    private readonly secretsManager;
    private readonly messageBridge;
    private readonly outputChannel;
    constructor(secretsManager: SecretsManager, messageBridge: MessageBridge, outputChannel: {
        appendLine: (msg: string) => void;
    });
    private buildPrompt;
    generate(options: GenerateOptions): Promise<void>;
    private streamInteraction;
    private parseErrorResponse;
    private humanizeError;
    private sendChunk;
    private sendComplete;
    private sendError;
}
export {};
//# sourceMappingURL=AIGenerationService.d.ts.map