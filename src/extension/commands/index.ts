import * as vscode from 'vscode';
import { COMMANDS, CONFIG_KEYS } from '../../shared/constants';
import type { SidebarProvider } from '../providers/SidebarProvider';

/**
 * Register all VS Code commands contributed by the Quantum UI extension.
 * Returns an array of disposables to be tracked by the extension context.
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  sidebarProvider: SidebarProvider,
  outputChannel: vscode.OutputChannel
): vscode.Disposable[] {
  const disposables: vscode.Disposable[] = [];

  // ── Open Panel ───────────────────────────────────────────────────────────
  disposables.push(
    vscode.commands.registerCommand(COMMANDS.OPEN_PANEL, () => {
      sidebarProvider.reveal();
      outputChannel.appendLine('[Commands] openPanel executed');
    })
  );

  // ── Refresh ──────────────────────────────────────────────────────────────
  disposables.push(
    vscode.commands.registerCommand(COMMANDS.REFRESH, async () => {
      await vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
      outputChannel.appendLine('[Commands] refresh executed');
    })
  );

  // ── Toggle Theme ─────────────────────────────────────────────────────────
  disposables.push(
    vscode.commands.registerCommand(COMMANDS.TOGGLE_THEME, async () => {
      const config = vscode.workspace.getConfiguration();
      const current = config.get<string>(CONFIG_KEYS.THEME, 'dark');
      const next = current === 'dark' ? 'light' : 'dark';
      await config.update(CONFIG_KEYS.THEME, next, vscode.ConfigurationTarget.Global);
      outputChannel.appendLine(`[Commands] theme toggled to: ${next}`);
    })
  );

  // ── Open Settings ────────────────────────────────────────────────────────
  disposables.push(
    vscode.commands.registerCommand(COMMANDS.OPEN_SETTINGS, async () => {
      await vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'quantumUI'
      );
      outputChannel.appendLine('[Commands] openSettings executed');
    })
  );

  // Register all disposables with the extension context
  context.subscriptions.push(...disposables);

  return disposables;
}