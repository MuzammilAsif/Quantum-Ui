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
exports.SidebarProvider = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("../../shared/types");
const constants_1 = require("../../shared/constants");
const MessageBridge_1 = require("../services/MessageBridge");
const utils_1 = require("../utils");
/**
 * SidebarProvider implements VS Code's WebviewViewProvider interface.
 *
 * Responsibilities:
 * - Render the React webview HTML shell
 * - Manage lifecycle (create, show, hide, dispose)
 * - Delegate message passing to MessageBridge
 * - Sync VS Code configuration to the webview
 */
class SidebarProvider {
    constructor(extensionUri, outputChannel) {
        this.extensionUri = extensionUri;
        this.outputChannel = outputChannel;
        this.disposables = [];
        this.isReady = false;
        this.messageBridge = new MessageBridge_1.MessageBridge(outputChannel);
    }
    /**
     * Called by VS Code when the webview view is first created or revealed.
     */
    resolveWebviewView(webviewView, _context, _token) {
        this.view = webviewView;
        // Configure webview security and capabilities
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.extensionUri, 'dist'),
                vscode.Uri.joinPath(this.extensionUri, 'src', 'assets'),
            ],
        };
        // Attach message bridge
        this.messageBridge.attach(webviewView);
        // Register message handlers
        this.registerMessageHandlers();
        // Render the webview HTML
        webviewView.webview.html = this.buildHtml(webviewView.webview);
        // Listen for visibility changes
        const visibilityListener = webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible && this.isReady) {
                void this.syncConfig();
            }
        });
        // Cleanup on dispose
        const disposeListener = webviewView.onDidDispose(() => {
            this.dispose();
        });
        this.disposables.push(visibilityListener, disposeListener);
        // Sync VS Code configuration changes in real-time
        const configWatcher = vscode.workspace.onDidChangeConfiguration((event) => {
            const keys = Object.values(constants_1.CONFIG_KEYS);
            if (keys.some((key) => event.affectsConfiguration(key))) {
                void this.syncConfig();
            }
        });
        this.disposables.push(configWatcher);
        this.log('Sidebar webview resolved');
    }
    /**
     * Programmatically reveal the sidebar panel.
     */
    reveal() {
        this.view?.show(true);
    }
    /**
     * Send a message to the webview from extension code.
     */
    async postMessage(message) {
        return this.messageBridge.send(message);
    }
    /**
     * Get the current message bridge for external handler registration.
     */
    getMessageBridge() {
        return this.messageBridge;
    }
    registerMessageHandlers() {
        // Webview signals it has mounted and is ready
        this.messageBridge.on(types_1.MessageType.READY, () => {
            this.isReady = true;
            this.log('Webview ready — syncing config');
            void this.syncConfig();
        });
        // Webview requests current configuration
        this.messageBridge.on(types_1.MessageType.GET_CONFIG, () => {
            void this.syncConfig();
        });
        // Webview updates a configuration value
        this.messageBridge.on(types_1.MessageType.SET_CONFIG, async (msg) => {
            const setMsg = msg;
            if (setMsg.payload) {
                await this.applyConfig(setMsg.payload);
            }
        });
        // Open a file in the editor
        this.messageBridge.on(types_1.MessageType.OPEN_FILE, async (msg) => {
            const openMsg = msg;
            if (openMsg.payload?.path) {
                const uri = vscode.Uri.file(openMsg.payload.path);
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, {
                    selection: openMsg.payload.line
                        ? new vscode.Range(openMsg.payload.line - 1, openMsg.payload.column ?? 0, openMsg.payload.line - 1, openMsg.payload.column ?? 0)
                        : undefined,
                });
            }
        });
        // Copy text to clipboard
        this.messageBridge.on(types_1.MessageType.COPY_TO_CLIPBOARD, async (msg) => {
            const copyMsg = msg;
            if (copyMsg.payload?.text) {
                await vscode.env.clipboard.writeText(copyMsg.payload.text);
                void vscode.window.showInformationMessage('Copied to clipboard!');
            }
        });
        // Show a VS Code notification
        this.messageBridge.on(types_1.MessageType.SHOW_NOTIFICATION, (msg) => {
            const notifMsg = msg;
            if (notifMsg.payload) {
                const { message, type } = notifMsg.payload;
                switch (type) {
                    case 'info':
                        void vscode.window.showInformationMessage(message);
                        break;
                    case 'warning':
                        void vscode.window.showWarningMessage(message);
                        break;
                    case 'error':
                        void vscode.window.showErrorMessage(message);
                        break;
                }
            }
        });
    }
    async syncConfig() {
        const config = this.readConfig();
        await this.messageBridge.send({
            type: types_1.MessageType.CONFIG_LOADED,
            payload: config,
        });
    }
    readConfig() {
        return {
            theme: (0, utils_1.getConfig)(constants_1.CONFIG_KEYS.THEME, types_1.DEFAULT_CONFIG.theme),
            accentColor: (0, utils_1.getConfig)(constants_1.CONFIG_KEYS.ACCENT_COLOR, types_1.DEFAULT_CONFIG.accentColor),
            animationsEnabled: (0, utils_1.getConfig)(constants_1.CONFIG_KEYS.ANIMATIONS_ENABLED, types_1.DEFAULT_CONFIG.animationsEnabled),
            compactMode: (0, utils_1.getConfig)(constants_1.CONFIG_KEYS.COMPACT_MODE, types_1.DEFAULT_CONFIG.compactMode),
            defaultFramework: types_1.DEFAULT_CONFIG.defaultFramework,
            defaultLanguage: types_1.DEFAULT_CONFIG.defaultLanguage,
        };
    }
    async applyConfig(partial) {
        const vsConfig = vscode.workspace.getConfiguration();
        const updates = [];
        if (partial.theme !== undefined) {
            updates.push([constants_1.CONFIG_KEYS.THEME, partial.theme]);
        }
        if (partial.accentColor !== undefined) {
            updates.push([constants_1.CONFIG_KEYS.ACCENT_COLOR, partial.accentColor]);
        }
        if (partial.animationsEnabled !== undefined) {
            updates.push([constants_1.CONFIG_KEYS.ANIMATIONS_ENABLED, partial.animationsEnabled]);
        }
        if (partial.compactMode !== undefined) {
            updates.push([constants_1.CONFIG_KEYS.COMPACT_MODE, partial.compactMode]);
        }
        await Promise.all(updates.map(([key, value]) => vsConfig.update(key, value, vscode.ConfigurationTarget.Global)));
    }
    /**
     * Build the HTML shell for the webview.
     * All scripts are loaded from the Vite build output.
     */
    buildHtml(webview) {
        const nonce = (0, utils_1.generateNonce)();
        const fs = require('fs');
        const webviewDistPath = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview');
        const distFiles = fs.readdirSync(webviewDistPath.fsPath);
        const jsFile = distFiles.find((f) => f.endsWith('.js') && !f.includes('chunk')) ?? 'main.js';
        let cssFile = 'style.css';
        const assetsPath = vscode.Uri.joinPath(webviewDistPath, 'assets');
        if (fs.existsSync(assetsPath.fsPath)) {
            const assetFiles = fs.readdirSync(assetsPath.fsPath);
            const foundCss = assetFiles.find((f) => f.endsWith('.css'));
            if (foundCss) {
                cssFile = `assets/${foundCss}`;
            }
        }
        else {
            cssFile = distFiles.find((f) => f.endsWith('.css')) ?? 'style.css';
        }
        const scriptUri = (0, utils_1.getWebviewUri)(webview, this.extensionUri, jsFile);
        const styleUri = (0, utils_1.getWebviewUri)(webview, this.extensionUri, ...cssFile.split('/'));
        // In production, load from built Vite output
        // In development, this would point to the Vite dev server
        // const scriptUri = getWebviewUri(webview, this.extensionUri, 'main.js');
        // const styleUri = getWebviewUri(webview, this.extensionUri, 'style.css');
        // Strict Content Security Policy
        const csp = [
            `default-src 'none'`,
            `style-src ${webview.cspSource} 'unsafe-inline'`,
            `script-src 'nonce-${nonce}' 'unsafe-eval' ${webview.cspSource}`,
            `font-src ${webview.cspSource} data:`,
            `img-src ${webview.cspSource} https: data:`,
            `connect-src https://api.quantumui.dev`,
            `frame-src 'self'`,
        ].join('; ');
        return /* html */ `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <title>Quantum UI</title>
    <link rel="stylesheet" href="${styleUri.toString()}" />
    <style nonce="${nonce}">
      /* Critical inline styles to prevent FOUC */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root {
        width: 100%; height: 100%;
        background: #0a0a12;
        color: #e8e8ff;
        font-family: 'Geist', 'Inter', system-ui, sans-serif;
        overflow: hidden;
      }
      #root { display: flex; flex-direction: column; }
      .q-loading {
        display: flex; align-items: center; justify-content: center;
        height: 100%; gap: 8px;
        color: #4a4a78; font-size: 0.75rem; letter-spacing: 0.1em;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="q-loading">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#6c5ce7" stroke-width="1.5"
            stroke-dasharray="20" stroke-dashoffset="0"
            style="animation: spin 1s linear infinite; transform-origin: center;">
          </circle>
        </svg>
        QUANTUM UI
      </div>
    </div>
<script nonce="${nonce}">
      // Inject VS Code API reference before React loads
      window.__VSCODE_API__ = acquireVsCodeApi();
      window.__QUANTUM_UI_VERSION__ = '${EXTENSION_VERSION}';
      window.__CSP_NONCE__ = '${nonce}';
    </script>
    <script nonce="${nonce}" type="module" src="${scriptUri.toString()}"></script>
  </body>
</html>`;
    }
    log(message) {
        this.outputChannel.appendLine(`[SidebarProvider] ${new Date().toISOString()} ${message}`);
    }
    dispose() {
        this.isReady = false;
        this.messageBridge.dispose();
        this.disposables.forEach((d) => d.dispose());
        this.disposables.length = 0;
    }
}
exports.SidebarProvider = SidebarProvider;
SidebarProvider.VIEW_ID = constants_1.WEBVIEW_ID;
// Re-export for buildHtml template literal usage
const EXTENSION_VERSION = '0.1.0';
//# sourceMappingURL=SidebarProvider.js.map