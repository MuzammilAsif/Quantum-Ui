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
exports.generateId = generateId;
exports.getWebviewUri = getWebviewUri;
exports.generateNonce = generateNonce;
exports.getConfig = getConfig;
exports.safeAsync = safeAsync;
exports.debounce = debounce;
exports.formatBytes = formatBytes;
exports.isValidUrl = isValidUrl;
const crypto = __importStar(require("crypto"));
const vscode = __importStar(require("vscode"));
/**
 * Generate a cryptographically unique ID.
 */
function generateId() {
    return crypto.randomUUID();
}
/**
 * Get the URI for a resource inside the extension's dist/webview folder,
 * converted to a webview-safe URI.
 */
function getWebviewUri(webview, extensionUri, ...pathSegments) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', ...pathSegments));
}
/**
 * Generate a strict Content Security Policy nonce.
 */
function generateNonce() {
    return crypto.randomBytes(16).toString('base64');
}
/**
 * Safely read a VS Code workspace configuration value.
 */
function getConfig(key, defaultValue) {
    const config = vscode.workspace.getConfiguration();
    return config.get(key, defaultValue);
}
/**
 * Wrap an async operation with structured error handling.
 */
async function safeAsync(operation, fallback, onError) {
    try {
        return await operation();
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onError?.(error);
        return fallback;
    }
}
/**
 * Debounce a function call.
 */
function debounce(fn, delay) {
    let timer;
    return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    });
}
/**
 * Format bytes to human-readable size string.
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
/**
 * Check if a string is a valid URL.
 */
function isValidUrl(str) {
    try {
        new URL(str);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=index.js.map