import * as vscode from 'vscode';
import { type ExtensionMessage, type WebviewMessage, MessageType } from '../../shared/types';
type MessageHandler = (message: ExtensionMessage) => void | Promise<void>;
/**
 * MessageBridge manages the bidirectional communication channel
 * between the VS Code extension host and the webview.
 *
 * Architecture:
 * - Extension → Webview: postMessage via WebviewPanel API
 * - Webview → Extension: onDidReceiveMessage event listener
 */
export declare class MessageBridge {
    private readonly outputChannel;
    private readonly handlers;
    private readonly pendingRequests;
    private panel;
    private readonly disposables;
    constructor(outputChannel: vscode.OutputChannel);
    /**
     * Attach a webview panel to enable message passing.
     */
    attach(panel: vscode.WebviewView): void;
    /**
     * Detach and cleanup resources.
     */
    detach(): void;
    /**
     * Send a message from extension to webview.
     */
    send(message: Omit<WebviewMessage, 'id' | 'timestamp'>): Promise<boolean>;
    /**
     * Register a handler for incoming messages of a specific type.
     */
    on(type: MessageType, handler: MessageHandler): vscode.Disposable;
    /**
     * Remove all handlers for a given message type.
     */
    off(type: MessageType): void;
    private handleIncoming;
    private log;
    dispose(): void;
}
export {};
//# sourceMappingURL=MessageBridge.d.ts.map