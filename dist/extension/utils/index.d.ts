import * as vscode from 'vscode';
/**
 * Generate a cryptographically unique ID.
 */
export declare function generateId(): string;
/**
 * Get the URI for a resource inside the extension's dist/webview folder,
 * converted to a webview-safe URI.
 */
export declare function getWebviewUri(webview: vscode.Webview, extensionUri: vscode.Uri, ...pathSegments: string[]): vscode.Uri;
/**
 * Generate a strict Content Security Policy nonce.
 */
export declare function generateNonce(): string;
/**
 * Safely read a VS Code workspace configuration value.
 */
export declare function getConfig<T>(key: string, defaultValue: T): T;
/**
 * Wrap an async operation with structured error handling.
 */
export declare function safeAsync<T>(operation: () => Promise<T>, fallback: T, onError?: (error: Error) => void): Promise<T>;
/**
 * Debounce a function call.
 */
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T;
/**
 * Format bytes to human-readable size string.
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * Check if a string is a valid URL.
 */
export declare function isValidUrl(str: string): boolean;
//# sourceMappingURL=index.d.ts.map