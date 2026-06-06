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
exports.MessageBridge = void 0;
const vscode = __importStar(require("vscode"));
const utils_1 = require("../utils");
/**
 * MessageBridge manages the bidirectional communication channel
 * between the VS Code extension host and the webview.
 *
 * Architecture:
 * - Extension → Webview: postMessage via WebviewPanel API
 * - Webview → Extension: onDidReceiveMessage event listener
 */
class MessageBridge {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
        this.handlers = new Map();
        this.pendingRequests = new Map();
        this.panel = null;
        this.disposables = [];
    }
    /**
     * Attach a webview panel to enable message passing.
     */
    attach(panel) {
        this.panel = panel;
        const listener = panel.webview.onDidReceiveMessage((message) => {
            this.handleIncoming(message);
        }, undefined, this.disposables);
        this.disposables.push(listener);
        this.log('info', 'MessageBridge attached to webview');
    }
    /**
     * Detach and cleanup resources.
     */
    detach() {
        this.panel = null;
        this.disposables.forEach((d) => d.dispose());
        this.disposables.length = 0;
        this.pendingRequests.clear();
        this.log('info', 'MessageBridge detached');
    }
    /**
     * Send a message from extension to webview.
     */
    async send(message) {
        if (!this.panel) {
            this.log('warn', 'Cannot send message: no webview attached');
            return false;
        }
        const fullMessage = {
            ...message,
            id: (0, utils_1.generateId)(),
            timestamp: Date.now(),
        };
        try {
            await this.panel.webview.postMessage(fullMessage);
            return true;
        }
        catch (error) {
            this.log('error', `Failed to send message: ${String(error)}`);
            return false;
        }
    }
    /**
     * Register a handler for incoming messages of a specific type.
     */
    on(type, handler) {
        const existing = this.handlers.get(type) ?? [];
        this.handlers.set(type, [...existing, handler]);
        return new vscode.Disposable(() => {
            const handlers = this.handlers.get(type) ?? [];
            this.handlers.set(type, handlers.filter((h) => h !== handler));
        });
    }
    /**
     * Remove all handlers for a given message type.
     */
    off(type) {
        this.handlers.delete(type);
    }
    handleIncoming(message) {
        this.log('info', `Received: ${message.type}`);
        // Resolve pending request if applicable
        if (message.id && this.pendingRequests.has(message.id)) {
            const pending = this.pendingRequests.get(message.id);
            this.pendingRequests.delete(message.id);
            pending.resolve(message);
            return;
        }
        // Dispatch to registered handlers
        const handlers = this.handlers.get(message.type) ?? [];
        handlers.forEach((handler) => {
            void Promise.resolve(handler(message)).catch((err) => {
                this.log('error', `Handler error for ${message.type}: ${String(err)}`);
            });
        });
        // Warn on unhandled messages
        if (handlers.length === 0) {
            this.log('warn', `No handler for message type: ${message.type}`);
        }
    }
    log(level, message) {
        const prefix = `[MessageBridge] ${new Date().toISOString()}`;
        this.outputChannel.appendLine(`${prefix} [${level.toUpperCase()}] ${message}`);
    }
    dispose() {
        this.detach();
        this.handlers.clear();
    }
}
exports.MessageBridge = MessageBridge;
//# sourceMappingURL=MessageBridge.js.map