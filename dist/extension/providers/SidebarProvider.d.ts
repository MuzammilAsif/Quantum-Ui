import * as vscode from 'vscode';
import { MessageBridge } from '../services/MessageBridge';
/**
 * SidebarProvider implements VS Code's WebviewViewProvider interface.
 *
 * Responsibilities:
 * - Render the React webview HTML shell
 * - Manage lifecycle (create, show, hide, dispose)
 * - Delegate message passing to MessageBridge
 * - Sync VS Code configuration to the webview
 * - Handle AI generation requests and API key storage
 */
export declare class SidebarProvider implements vscode.WebviewViewProvider {
    private readonly outputChannel;
    static readonly VIEW_ID = "quantumUI.sidebar";
    private view?;
    private readonly messageBridge;
    private readonly secretsManager;
    private readonly aiService;
    private readonly extensionUri;
    private readonly disposables;
    private isReady;
    constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel);
    /**
     * Called by VS Code when the webview view is first created or revealed.
     */
    resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    reveal(): void;
    postMessage(message: Parameters<MessageBridge['send']>[0]): Promise<boolean>;
    getMessageBridge(): MessageBridge;
    private registerMessageHandlers;
    /**
     * Send the current API key status (present/absent + masked preview)
     * to the webview without ever exposing the full key.
     */
    private sendApiKeyStatus;
    private syncConfig;
    private readConfig;
    private applyConfig;
    /**
     * Build the HTML shell for the webview.
     */
    private buildHtml;
    private log;
    dispose(): void;
}
//# sourceMappingURL=SidebarProvider.d.ts.map