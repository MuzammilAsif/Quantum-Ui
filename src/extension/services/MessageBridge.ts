import * as vscode from 'vscode';
import { type ExtensionMessage, type WebviewMessage, MessageType } from '../../shared/types';
import { generateId } from '../utils';

type MessageHandler = (message: ExtensionMessage) => void | Promise<void>;

/**
 * MessageBridge manages the bidirectional communication channel
 * between the VS Code extension host and the webview.
 *
 * Architecture:
 * - Extension → Webview: postMessage via WebviewPanel API
 * - Webview → Extension: onDidReceiveMessage event listener
 */
export class MessageBridge {
  private readonly handlers = new Map<MessageType, MessageHandler[]>();
  private readonly pendingRequests = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (reason: unknown) => void }
  >();
  private panel: vscode.WebviewView | null = null;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(private readonly outputChannel: vscode.OutputChannel) {}

  /**
   * Attach a webview panel to enable message passing.
   */
  public attach(panel: vscode.WebviewView): void {
    this.panel = panel;

    const listener = panel.webview.onDidReceiveMessage(
      (message: ExtensionMessage) => {
        this.handleIncoming(message);
      },
      undefined,
      this.disposables
    );

    this.disposables.push(listener);
    this.log('info', 'MessageBridge attached to webview');
  }

  /**
   * Detach and cleanup resources.
   */
  public detach(): void {
    this.panel = null;
    this.disposables.forEach((d) => d.dispose());
    this.disposables.length = 0;
    this.pendingRequests.clear();
    this.log('info', 'MessageBridge detached');
  }

  /**
   * Send a message from extension to webview.
   */
  public async send(message: Omit<WebviewMessage, 'id' | 'timestamp'>): Promise<boolean> {
    if (!this.panel) {
      this.log('warn', 'Cannot send message: no webview attached');
      return false;
    }

    const fullMessage: WebviewMessage = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    } as WebviewMessage;

    try {
      await this.panel.webview.postMessage(fullMessage);
      return true;
    } catch (error) {
      this.log('error', `Failed to send message: ${String(error)}`);
      return false;
    }
  }

  /**
   * Register a handler for incoming messages of a specific type.
   */
  public on(type: MessageType, handler: MessageHandler): vscode.Disposable {
    const existing = this.handlers.get(type) ?? [];
    this.handlers.set(type, [...existing, handler]);

    return new vscode.Disposable(() => {
      const handlers = this.handlers.get(type) ?? [];
      this.handlers.set(
        type,
        handlers.filter((h) => h !== handler)
      );
    });
  }

  /**
   * Remove all handlers for a given message type.
   */
  public off(type: MessageType): void {
    this.handlers.delete(type);
  }

  private handleIncoming(message: ExtensionMessage): void {
    this.log('info', `Received: ${message.type}`);

    // Resolve pending request if applicable
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);
      pending.resolve(message);
      return;
    }

    // Dispatch to registered handlers
    const handlers = this.handlers.get(message.type) ?? [];
    handlers.forEach((handler) => {
      void Promise.resolve(handler(message)).catch((err: unknown) => {
        this.log('error', `Handler error for ${message.type}: ${String(err)}`);
      });
    });

    // Warn on unhandled messages
    if (handlers.length === 0) {
      this.log('warn', `No handler for message type: ${message.type}`);
    }
  }

  private log(level: 'info' | 'warn' | 'error', message: string): void {
    const prefix = `[MessageBridge] ${new Date().toISOString()}`;
    this.outputChannel.appendLine(`${prefix} [${level.toUpperCase()}] ${message}`);
  }

  public dispose(): void {
    this.detach();
    this.handlers.clear();
  }
}