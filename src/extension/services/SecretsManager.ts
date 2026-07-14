import * as vscode from 'vscode';

const OPENAI_API_KEY_SECRET = 'quantumUI.openaiApiKey';

/**
 * SecretsManager — wraps VS Code's SecretStorage API for securely
 * storing and retrieving the user's OpenAI API key.
 *
 * VS Code's SecretStorage is backed by the OS-level credential store
 * (Keychain on macOS, Credential Manager on Windows, libsecret on Linux).
 * This means the key is encrypted at rest and never readable by other
 * extensions or visible in settings.json.
 */
export class SecretsManager {
  constructor(private readonly secretStorage: vscode.SecretStorage) {}

  /**
   * Store the OpenAI API key securely.
   */
  async setApiKey(key: string): Promise<void> {
    await this.secretStorage.store(OPENAI_API_KEY_SECRET, key);
  }

  /**
   * Retrieve the OpenAI API key, or undefined if not set.
   */
  async getApiKey(): Promise<string | undefined> {
    return this.secretStorage.get(OPENAI_API_KEY_SECRET);
  }

  /**
   * Remove the stored API key.
   */
  async clearApiKey(): Promise<void> {
    await this.secretStorage.delete(OPENAI_API_KEY_SECRET);
  }

  /**
   * Check if an API key is currently stored, without exposing it.
   */
  async hasApiKey(): Promise<boolean> {
    const key = await this.getApiKey();
    return key !== undefined && key.length > 0;
  }

  /**
   * Validate the shape of an OpenAI API key before storing it.
   * Does not verify it works — just checks the format looks correct.
   */
  static isValidKeyFormat(key: string): boolean {
    const trimmed = key.trim();
    return trimmed.startsWith('sk-') && trimmed.length > 20;
  }
}