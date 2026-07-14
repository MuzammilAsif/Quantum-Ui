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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const SidebarProvider_1 = require("./providers/SidebarProvider");
const commands_1 = require("./commands");
let outputChannel;
let sidebarProvider;
/**
 * Extension activation — called once by VS Code on first use.
 * Registers all providers, commands, and event listeners.
 */
function activate(context) {
    outputChannel = vscode.window.createOutputChannel('Quantum UI', { log: true });
    outputChannel.appendLine('[Extension] Activating Quantum UI...');
    // Instantiate the sidebar webview provider using the extension URI.
    sidebarProvider = new SidebarProvider_1.SidebarProvider(context, outputChannel);
    const sidebarRegistration = vscode.window.registerWebviewViewProvider(SidebarProvider_1.SidebarProvider.VIEW_ID, sidebarProvider, {
        webviewOptions: { retainContextWhenHidden: true },
    });
    (0, commands_1.registerCommands)(context, sidebarProvider, outputChannel);
    context.subscriptions.push(sidebarRegistration, outputChannel);
    outputChannel.appendLine('[Extension] Quantum UI activated successfully ✓');
}
function deactivate() {
    outputChannel?.appendLine('[Extension] Deactivating Quantum UI...');
    sidebarProvider?.dispose();
}
//# sourceMappingURL=extension.js.map