import * as vscode from 'vscode';
/**
 * SecretsManager — wraps VS Code's SecretStorage API for securely
 * storing and retrieving the user's OpenAI API key.
 *
 * VS Code's SecretStorage is backed by the OS-level credential store
 * (Keychain on macOS, Credential Manager on Windows, libsecret on Linux).
 * This means the key is encrypted at rest and never readable by other
 * extensions or visible in settings.json.
 */
export declare class SecretsManager {
    private readonly secretStorage;
    constructor(secretStorage: vscode.SecretStorage);
    /**
     * Store the OpenAI API key securely.
     */
    setApiKey(key: string): Promise<void>;
    /**
     * Retrieve the OpenAI API key, or undefined if not set.
     */
    getApiKey(): Promise<string | undefined>;
    /**
     * Remove the stored API key.
     */
    clearApiKey(): Promise<void>;
    /**
     * Check if an API key is currently stored, without exposing it.
     */
    hasApiKey(): Promise<boolean>;
    /**
     * Validate the shape of an OpenAI API key before storing it.
     * Does not verify it works — just checks the format looks correct.
     */
    static isValidKeyFormat(key: string): boolean;
}
//# sourceMappingURL=SecretsManager.d.ts.map