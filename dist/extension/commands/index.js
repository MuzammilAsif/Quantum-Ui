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
exports.registerCommands = registerCommands;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../../shared/constants");
/**
 * Register all VS Code commands contributed by the Quantum UI extension.
 * Returns an array of disposables to be tracked by the extension context.
 */
function registerCommands(context, sidebarProvider, outputChannel) {
    const disposables = [];
    // ── Open Panel ───────────────────────────────────────────────────────────
    disposables.push(vscode.commands.registerCommand(constants_1.COMMANDS.OPEN_PANEL, () => {
        sidebarProvider.reveal();
        outputChannel.appendLine('[Commands] openPanel executed');
    }));
    // ── Refresh ──────────────────────────────────────────────────────────────
    disposables.push(vscode.commands.registerCommand(constants_1.COMMANDS.REFRESH, async () => {
        await vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
        outputChannel.appendLine('[Commands] refresh executed');
    }));
    // ── Toggle Theme ─────────────────────────────────────────────────────────
    disposables.push(vscode.commands.registerCommand(constants_1.COMMANDS.TOGGLE_THEME, async () => {
        const config = vscode.workspace.getConfiguration();
        const current = config.get(constants_1.CONFIG_KEYS.THEME, 'dark');
        const next = current === 'dark' ? 'light' : 'dark';
        await config.update(constants_1.CONFIG_KEYS.THEME, next, vscode.ConfigurationTarget.Global);
        outputChannel.appendLine(`[Commands] theme toggled to: ${next}`);
    }));
    // ── Open Settings ────────────────────────────────────────────────────────
    disposables.push(vscode.commands.registerCommand(constants_1.COMMANDS.OPEN_SETTINGS, async () => {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'quantumUI');
        outputChannel.appendLine('[Commands] openSettings executed');
    }));
    // Register all disposables with the extension context
    context.subscriptions.push(...disposables);
    return disposables;
}
//# sourceMappingURL=index.js.map