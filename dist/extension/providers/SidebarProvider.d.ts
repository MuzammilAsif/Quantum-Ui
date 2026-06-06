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
 */
export declare class SidebarProvider implements vscode.WebviewViewProvider {
    private readonly extensionUri;
    private readonly outputChannel;
    static readonly VIEW_ID = "quantumUI.sidebar";
    private view?;
    private readonly messageBridge;
    private readonly disposables;
    private isReady;
    constructor(extensionUri: vscode.Uri, outputChannel: vscode.OutputChannel);
    /**
     * Called by VS Code when the webview view is first created or revealed.
     */
    resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    /**
     * Programmatically reveal the sidebar panel.
     */
    reveal(): void;
    /**
     * Send a message to the webview from extension code.
     */
    postMessage(message: Parameters<MessageBridge['send']>[0]): Promise<boolean>;
    /**
     * Get the current message bridge for external handler registration.
     */
    getMessageBridge(): MessageBridge;
    private registerMessageHandlers;
    private syncConfig;
    private readConfig;
    private applyConfig;
    /**
     * Build the HTML shell for the webview.
     * All scripts are loaded from the Vite build output.
     */
    private buildHtml;
    private log;
    dispose(): void;
}
//# sourceMappingURL=SidebarProvider.d.ts.map