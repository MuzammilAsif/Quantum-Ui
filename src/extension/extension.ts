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
  // Dedicated output channel for debugging
  outputChannel = vscode.window.createOutputChannel('Quantum UI', { log: true });
  outputChannel.appendLine('[Extension] Activating Quantum UI...');

  // Instantiate the sidebar webview provider
  sidebarProvider = new SidebarProvider(context.extensionUri, outputChannel);

  // Register the sidebar webview with VS Code
  const sidebarRegistration = vscode.window.registerWebviewViewProvider(
    SidebarProvider.VIEW_ID,
    sidebarProvider,
    {
      // Keep context alive when panel is hidden — avoids full reload
      webviewOptions: { retainContextWhenHidden: true },
    }
  );

  // Register all commands
  registerCommands(context, sidebarProvider, outputChannel);

  // Push long-lived disposables into the extension context
  context.subscriptions.push(sidebarRegistration, outputChannel);

  outputChannel.appendLine('[Extension] Quantum UI activated successfully ✓');
}

/**
 * Extension deactivation — VS Code calls this when the extension is unloaded.
 * Clean up resources that aren't tracked in context.subscriptions.
 */
export function deactivate(): void {
  outputChannel?.appendLine('[Extension] Deactivating Quantum UI...');
  sidebarProvider?.dispose();
}