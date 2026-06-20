import { memo, useRef, useEffect, useMemo, useCallback } from 'react';
import type { PreviewTheme } from './types';

interface PreviewSandboxProps {
  html: string | null;
  theme: PreviewTheme;
  width: number | null;
  onError: (message: string) => void;
  onReady: () => void;
}

// ─── Sandbox document template ────────────────────────────────────────────────
//
// Builds a complete standalone HTML document for the iframe.
// - Loads Tailwind via CDN (cached after first load)
// - Applies dark/light background matching the theme
// - Wraps content in error-catching script
// - Reports errors and ready state to the parent via postMessage

function buildSandboxDocument(html: string, theme: PreviewTheme, nonce: string): string {
  const bgColor = theme === 'dark' ? '#0a0a12' : '#ffffff';
  const textColor = theme === 'dark' ? '#e8e8ff' : '#1a1a2e';

  return /* html */ `<!DOCTYPE html>
<html lang="en" class="${theme}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script nonce="${nonce}" src="https://cdn.tailwindcss.com"></script>
    <script nonce="${nonce}">
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              gray: {
                50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
                400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
                800: '#1f2937', 900: '#111827',
              },
            },
          },
        },
      };
    </script>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        background: ${bgColor};
        color: ${textColor};
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        min-height: 100vh;
      }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #353570; border-radius: 999px; }
      ::-webkit-scrollbar-track { background: transparent; }
    </style>
  </head>
  <body>
    <div id="preview-root">${html}</div>

   <script nonce="${nonce}">
      // ── Error capture ────────────────────────────────────────────────────
      window.addEventListener('error', function (event) {
        window.parent.postMessage({
          type: 'SANDBOX_ERROR',
          payload: { message: event.message || 'Unknown render error' }
        }, '*');
      });

      window.addEventListener('unhandledrejection', function (event) {
        window.parent.postMessage({
          type: 'SANDBOX_ERROR',
          payload: { message: String(event.reason) || 'Unhandled rejection' }
        }, '*');
      });

      // ── Ready signal ─────────────────────────────────────────────────────
      // Wait for Tailwind CDN to process classes before signaling ready
      window.addEventListener('load', function () {
        setTimeout(function () {
          window.parent.postMessage({ type: 'SANDBOX_READY' }, '*');
        }, 80);
      });
    </script>
  </body>
</html>`;
}

// ─── PreviewSandbox ────────────────────────────────────────────────────────────

/**
 * PreviewSandbox — renders asset HTML inside an isolated iframe.
 *
 * Isolation guarantees:
 * - No shared DOM with the main application
 * - No shared CSS — Tailwind is loaded fresh inside the iframe
 * - No shared JS runtime — errors inside cannot crash the extension
 * - Communication only via postMessage (one-way: child → parent)
 *
 * This component is intentionally "dumb" — it just builds and renders
 * the sandbox document. All state (theme, device width, html content)
 * is passed in as props from PreviewRenderer.
 */
export const PreviewSandbox = memo(function PreviewSandbox({
  html,
  theme,
  width,
  onError,
  onReady,
}: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Build the sandbox document whenever html or theme changes ─────────────
  const srcDoc = useMemo(() => {
    if (!html) return null;
    const nonce = (window as unknown as { __CSP_NONCE__?: string }).__CSP_NONCE__ ?? '';
    return buildSandboxDocument(html, theme, nonce);
  }, [html, theme]);

  // ── Listen for messages from the sandboxed iframe ──────────────────────────
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Only accept messages from our own iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const data = event.data as { type?: string; payload?: { message?: string } };

      if (data?.type === 'SANDBOX_READY') {
        onReady();
      }

      if (data?.type === 'SANDBOX_ERROR') {
        onError(data.payload?.message ?? 'Unknown preview error');
      }
    },
    [onError, onReady]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // ── Reset ready state when html changes (new render cycle) ────────────────
  useEffect(() => {
    if (!srcDoc) {
      onError('No preview content available');
    }
  }, [srcDoc, onError]);

  if (!srcDoc) {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      title="Component preview"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="w-full h-full border-0 bg-transparent"
      style={{
        width: width !== null ? `${width}px` : '100%',
        maxWidth: '100%',
        transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    // Isolation: scripts allowed for Tailwind CDN + error reporting,
    // but no same-origin, no top navigation, no popups, no forms.
    />
  );
});