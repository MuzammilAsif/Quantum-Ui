import * as vscode from 'vscode';
import { SidebarProvider } from './providers/SidebarProvider';
import { registerCommands } from './commands';

let outputChannel: vscode.OutputChannel;
let sidebarProvider: SidebarProvider;

/**
 * Extension activation — called once by VS Code on first use.
 * Registers all providers, commands, and event listeners.
 */
export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel('Quantum UI', { log: true });
  outputChannel.appendLine('[Extension] Activating Quantum UI...');

  // Instantiate the sidebar webview provider using the extension URI.
sidebarProvider = new SidebarProvider(context, outputChannel);

  const sidebarRegistration = vscode.window.registerWebviewViewProvider(
    SidebarProvider.VIEW_ID,
    sidebarProvider,
    {
      webviewOptions: { retainContextWhenHidden: true },
    }
  );

  registerCommands(context, sidebarProvider, outputChannel);

  context.subscriptions.push(sidebarRegistration, outputChannel);

  outputChannel.appendLine('[Extension] Quantum UI activated successfully ✓');
}

export function deactivate(): void {
  outputChannel?.appendLine('[Extension] Deactivating Quantum UI...');
  sidebarProvider?.dispose();
}