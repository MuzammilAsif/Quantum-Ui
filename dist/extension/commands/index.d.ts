import * as vscode from 'vscode';
import type { SidebarProvider } from '../providers/SidebarProvider';
/**
 * Register all VS Code commands contributed by the Quantum UI extension.
 * Returns an array of disposables to be tracked by the extension context.
 */
export declare function registerCommands(context: vscode.ExtensionContext, sidebarProvider: SidebarProvider, outputChannel: vscode.OutputChannel): vscode.Disposable[];
//# sourceMappingURL=index.d.ts.map