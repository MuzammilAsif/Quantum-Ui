import { useCallback, useEffect, useRef } from 'react';
import type { WebviewMessage, ExtensionMessage, MessageType, VSCodeAPI } from '../types';
import { useUserStore } from '../store';
import { useThemeStore } from '../store';
import { MessageType as MsgType } from '../types';
import { generateId } from '../utils';

type MessageListener = (message: WebviewMessage) => void;

/**
 * Singleton VS Code API accessor.
 * The acquireVsCodeApi() function can only be called ONCE per webview session,
 * so we cache the result in module scope.
 */
let vsCodeApi: VSCodeAPI | null = null;

function getVSCodeApi() {
  if (!vsCodeApi) {
    if (typeof window.__VSCODE_API__ !== 'undefined') {
      vsCodeApi = window.__VSCODE_API__;
    } else if (typeof window.acquireVsCodeApi === 'function') {
      vsCodeApi = window.acquireVsCodeApi();
    }
  }
  return vsCodeApi;
}

/**
 * Global listener registry so multiple hook consumers can all receive messages.
 */
const listeners = new Set<MessageListener>();

if (typeof window !== 'undefined') {
  window.addEventListener('message', (event: MessageEvent<WebviewMessage>) => {
    const message = event.data;
    if (message?.type) {
      listeners.forEach((listener) => listener(message));
    }
  });
}

/**
 * useVSCode — typed hook for VS Code ↔ Webview communication.
 *
 * Usage:
 * ```tsx
 * const { postMessage, onMessage } = useVSCode();
 * postMessage({ type: MessageType.COPY_TO_CLIPBOARD, payload: { text: 'hello' } });
 * ```
 */
export function useVSCode() {
  const api = getVSCodeApi();

  const postMessage = useCallback(
    (message: Omit<ExtensionMessage, 'id' | 'timestamp'>) => {
      const full: ExtensionMessage = {
        ...message,
        id: generateId(),
        timestamp: Date.now(),
      } as ExtensionMessage;
      api?.postMessage(full);
    },
    [api]
  );

  const onMessage = useCallback((listener: MessageListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const saveState = useCallback(
    (state: unknown) => {
      api?.setState(state);
    },
    [api]
  );

  const getState = useCallback((): unknown => {
    return api?.getState();
  }, [api]);

  return { postMessage, onMessage, saveState, getState, isConnected: api !== null };
}

/**
 * useVSCodeMessage — subscribe to a specific message type.
 */
export function useVSCodeMessage<T extends WebviewMessage>(
  type: MessageType,
  handler: (message: T) => void
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener: MessageListener = (message) => {
      if (message.type === type) {
        handlerRef.current(message as T);
      }
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, [type]);
}

/**
 * useExtensionConfig — listens for CONFIG_LOADED messages and syncs stores.
 */
export function useExtensionConfig(): void {
  const { setConfig } = useUserStore();
  const { syncFromConfig } = useThemeStore();
  const { postMessage } = useVSCode();

  useEffect(() => {
    // Signal the extension we're ready
    postMessage({ type: MsgType.READY });

    const listener: MessageListener = (message) => {
      if (message.type === MsgType.CONFIG_LOADED) {
        const config = (message as WebviewMessage & { payload?: Parameters<typeof setConfig>[0] }).payload;
        if (config) {
          setConfig(config);
          syncFromConfig({
            theme: config.theme,
            accentColor: config.accentColor,
            animationsEnabled: config.animationsEnabled,
          });
        }
      }
    };

    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, [postMessage, setConfig, syncFromConfig]);
}