import * as crypto from 'crypto';
import * as vscode from 'vscode';

/**
 * Generate a cryptographically unique ID.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Get the URI for a resource inside the extension's dist/webview folder,
 * converted to a webview-safe URI.
 */
export function getWebviewUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  ...pathSegments: string[]
): vscode.Uri {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview', ...pathSegments));
}

/**
 * Generate a strict Content Security Policy nonce.
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Safely read a VS Code workspace configuration value.
 */
export function getConfig<T>(key: string, defaultValue: T): T {
  const config = vscode.workspace.getConfiguration();
  return config.get<T>(key, defaultValue);
}

/**
 * Wrap an async operation with structured error handling.
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    onError?.(error);
    return fallback;
  }
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

/**
 * Format bytes to human-readable size string.
 */
export function formatBytes(bytes: number, decimals = 2): string {
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
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}