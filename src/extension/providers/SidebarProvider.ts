import * as vscode from 'vscode';
import {
  MessageType,
  type ExtensionMessage,
  type ExtensionConfig,
  DEFAULT_CONFIG,
} from '../../shared/types';
import { WEBVIEW_ID, CONFIG_KEYS } from '../../shared/constants';
import { MessageBridge } from '../services/MessageBridge';
import { SecretsManager } from '../services/SecretsManager';
import { AIGenerationService } from '../services/AIGenerationService';
import { generateNonce, getWebviewUri, getConfig } from '../utils';

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
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly VIEW_ID = WEBVIEW_ID;

  private view?: vscode.WebviewView;
  private readonly messageBridge: MessageBridge;
  private readonly secretsManager: SecretsManager;
  private readonly aiService: AIGenerationService;
  private readonly extensionUri: vscode.Uri;
  private readonly disposables: vscode.Disposable[] = [];
  private isReady = false;

  constructor(
    context: vscode.ExtensionContext,
    private readonly outputChannel: vscode.OutputChannel
  ) {
    this.extensionUri = context.extensionUri;
    this.messageBridge = new MessageBridge(outputChannel);
    this.secretsManager = new SecretsManager(context.secrets);
    this.aiService = new AIGenerationService(
      this.secretsManager,
      this.messageBridge,
      outputChannel
    );
  }

  /**
   * Called by VS Code when the webview view is first created or revealed.
   */
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.extensionUri, 'src', 'assets'),
      ],
    };

    this.messageBridge.attach(webviewView);
    this.registerMessageHandlers();
    webviewView.webview.html = this.buildHtml(webviewView.webview);

    const visibilityListener = webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible && this.isReady) {
        void this.syncConfig();
      }
    });

    const disposeListener = webviewView.onDidDispose(() => {
      this.dispose();
    });

    this.disposables.push(visibilityListener, disposeListener);

    const configWatcher = vscode.workspace.onDidChangeConfiguration((event) => {
      const keys = Object.values(CONFIG_KEYS);
      if (keys.some((key) => event.affectsConfiguration(key))) {
        void this.syncConfig();
      }
    });

    this.disposables.push(configWatcher);

    this.log('Sidebar webview resolved');
  }

  public reveal(): void {
    this.view?.show(true);
  }

  public async postMessage(
    message: Parameters<MessageBridge['send']>[0]
  ): Promise<boolean> {
    return this.messageBridge.send(message);
  }

  public getMessageBridge(): MessageBridge {
    return this.messageBridge;
  }

  private registerMessageHandlers(): void {
    // ── Ready ────────────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.READY, () => {
      this.isReady = true;
      this.log('Webview ready — syncing config');
      void this.syncConfig();
      void this.sendApiKeyStatus();
    });

    // ── Get Config ───────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.GET_CONFIG, () => {
      void this.syncConfig();
    });

    // ── Set Config ───────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.SET_CONFIG, async (msg) => {
      const setMsg = msg as ExtensionMessage & { payload?: Partial<ExtensionConfig> };
      if (setMsg.payload) {
        await this.applyConfig(setMsg.payload);
      }
    });

    // ── Open File ────────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.OPEN_FILE, async (msg) => {
      const openMsg = msg as ExtensionMessage & {
        payload?: { path: string; line?: number; column?: number };
      };
      if (openMsg.payload?.path) {
        const uri = vscode.Uri.file(openMsg.payload.path);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, {
          selection: openMsg.payload.line
            ? new vscode.Range(
                openMsg.payload.line - 1,
                openMsg.payload.column ?? 0,
                openMsg.payload.line - 1,
                openMsg.payload.column ?? 0
              )
            : undefined,
        });
      }
    });

    // ── Copy to Clipboard ────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.COPY_TO_CLIPBOARD, async (msg) => {
      const copyMsg = msg as ExtensionMessage & { payload?: { text: string } };
      if (copyMsg.payload?.text) {
        await vscode.env.clipboard.writeText(copyMsg.payload.text);
        void vscode.window.showInformationMessage('Copied to clipboard!');
      }
    });

    // ── Show Notification ────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.SHOW_NOTIFICATION, (msg) => {
      const notifMsg = msg as ExtensionMessage & {
        payload?: { message: string; type: 'info' | 'warning' | 'error' };
      };
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

    // ── AI Generation ────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.AI_GENERATE, async (msg) => {
      const genMsg = msg as ExtensionMessage & {
        payload?: { requestId: string; prompt: string; framework: string };
      };
      if (genMsg.payload) {
        await this.aiService.generate({
          requestId: genMsg.payload.requestId,
          prompt: genMsg.payload.prompt,
          framework: genMsg.payload.framework,
        });
      }
    });

    // ── Set API Key ──────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.SET_API_KEY, async (msg) => {
      const keyMsg = msg as ExtensionMessage & { payload?: { apiKey: string } };
      if (keyMsg.payload?.apiKey) {
        const trimmed = keyMsg.payload.apiKey.trim();

        if (!SecretsManager.isValidKeyFormat(trimmed)) {
          void vscode.window.showErrorMessage(
            'Invalid API key format. OpenAI keys start with "sk-".'
          );
          await this.sendApiKeyStatus();
          return;
        }

        await this.secretsManager.setApiKey(trimmed);
        void vscode.window.showInformationMessage('API key saved securely.');
        await this.sendApiKeyStatus();
      }
    });

    // ── Get API Key Status ───────────────────────────────────────────────────
    this.messageBridge.on(MessageType.GET_API_KEY_STATUS, async () => {
      await this.sendApiKeyStatus();
    });

    // ── Clear API Key ────────────────────────────────────────────────────────
    this.messageBridge.on(MessageType.CLEAR_API_KEY, async () => {
      await this.secretsManager.clearApiKey();
      void vscode.window.showInformationMessage('API key removed.');
      await this.sendApiKeyStatus();
    });
  }

  /**
   * Send the current API key status (present/absent + masked preview)
   * to the webview without ever exposing the full key.
   */
  private async sendApiKeyStatus(): Promise<void> {
    const key = await this.secretsManager.getApiKey();
    const hasKey = key !== undefined && key.length > 0;
    const maskedKey = hasKey ? `${key!.slice(0, 7)}...${key!.slice(-4)}` : undefined;

    await this.messageBridge.send({
      type: MessageType.API_KEY_STATUS,
      payload: { hasKey, maskedKey },
    });
  }

  private async syncConfig(): Promise<void> {
    const config = this.readConfig();
    await this.messageBridge.send({
      type: MessageType.CONFIG_LOADED,
      payload: config,
    });
  }

  private readConfig(): ExtensionConfig {
    return {
      theme: getConfig<ExtensionConfig['theme']>(CONFIG_KEYS.THEME, DEFAULT_CONFIG.theme),
      accentColor: getConfig<ExtensionConfig['accentColor']>(
        CONFIG_KEYS.ACCENT_COLOR,
        DEFAULT_CONFIG.accentColor
      ),
      animationsEnabled: getConfig<boolean>(
        CONFIG_KEYS.ANIMATIONS_ENABLED,
        DEFAULT_CONFIG.animationsEnabled
      ),
      compactMode: getConfig<boolean>(CONFIG_KEYS.COMPACT_MODE, DEFAULT_CONFIG.compactMode),
      defaultFramework: DEFAULT_CONFIG.defaultFramework,
      defaultLanguage: DEFAULT_CONFIG.defaultLanguage,
    };
  }

  private async applyConfig(partial: Partial<ExtensionConfig>): Promise<void> {
    const vsConfig = vscode.workspace.getConfiguration();
    const updates: Array<[string, unknown]> = [];

    if (partial.theme !== undefined) {
      updates.push([CONFIG_KEYS.THEME, partial.theme]);
    }
    if (partial.accentColor !== undefined) {
      updates.push([CONFIG_KEYS.ACCENT_COLOR, partial.accentColor]);
    }
    if (partial.animationsEnabled !== undefined) {
      updates.push([CONFIG_KEYS.ANIMATIONS_ENABLED, partial.animationsEnabled]);
    }
    if (partial.compactMode !== undefined) {
      updates.push([CONFIG_KEYS.COMPACT_MODE, partial.compactMode]);
    }

    await Promise.all(
      updates.map(([key, value]) =>
        vsConfig.update(key, value, vscode.ConfigurationTarget.Global)
      )
    );
  }

  /**
   * Build the HTML shell for the webview.
   */
  private buildHtml(webview: vscode.Webview): string {
    const nonce = generateNonce();

    const fs = require('fs') as typeof import('fs');
    const path = require('path') as typeof import('path');
    const webviewDistPath = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview');
    const distFiles = fs.readdirSync(webviewDistPath.fsPath);

    const jsFile = distFiles.find((f) => f.endsWith('.js') && !f.includes('chunk')) ?? 'main.js';

    // Vite outputs CSS into dist/webview/assets/ — scan that subfolder
    const assetsDir = path.join(webviewDistPath.fsPath, 'assets');
    const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
    const cssAsset = assetFiles.find((f) => f.endsWith('.css'));

    const scriptUri = getWebviewUri(webview, this.extensionUri, jsFile);
    const styleUri = cssAsset
      ? getWebviewUri(webview, this.extensionUri, 'assets', cssAsset)
      : getWebviewUri(webview, this.extensionUri, 'style.css');

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
      window.__VSCODE_API__ = acquireVsCodeApi();
      window.__QUANTUM_UI_VERSION__ = '${EXTENSION_VERSION}';
      window.__CSP_NONCE__ = '${nonce}';
    </script>
    <script nonce="${nonce}" type="module" src="${scriptUri.toString()}"></script>
  </body>
</html>`;
  }

  private log(message: string): void {
    this.outputChannel.appendLine(
      `[SidebarProvider] ${new Date().toISOString()} ${message}`
    );
  }

  public dispose(): void {
    this.isReady = false;
    this.messageBridge.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.disposables.length = 0;
  }
}

const EXTENSION_VERSION = '0.1.0';