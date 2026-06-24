import { memo, useRef, useEffect, useMemo, useCallback } from 'react';
import type { PreviewTheme } from './types';

interface PreviewSandboxProps {
  html: string | null;
  theme: PreviewTheme;
  width: number | null;
  onError: (message: string) => void;
  onReady: () => void;
}

// ─── Sandbox document builder ─────────────────────────────────────────────────

function buildSandboxDocument(html: string, theme: PreviewTheme, nonce: string): string {
  const bgColor = theme === 'dark' ? '#0a0a12' : '#ffffff';
  const textColor = theme === 'dark' ? '#e8e8ff' : '#1a1a2e';

  return /* html */`<!DOCTYPE html>
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
                50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',
                400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',
                800:'#1f2937',900:'#111827',
              },
            },
          },
        },
      };
    </script>
<style>
      *, *::before, *::after { box-sizing: border-box; }
      html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: ${bgColor};
        color: ${textColor};
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }
      body {
        margin: 0;
        padding: 24px;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${bgColor};
        overflow-x: hidden;
        overflow-y: auto;
      }
      #preview-root {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb {
        background: ${theme === 'dark' ? '#353570' : '#d1d5db'};
        border-radius: 999px;
      }
      ::-webkit-scrollbar-track { background: transparent; }
    </style>
  </head>
  <body>
    <div id="preview-root">${html}</div>

    <script nonce="${nonce}">
      // ── Error capture ──────────────────────────────────────────────────────
      window.addEventListener('error', function(event) {
        window.parent.postMessage({
          type: 'SANDBOX_ERROR',
          payload: { message: event.message || 'Unknown render error' }
        }, '*');
      });

      window.addEventListener('unhandledrejection', function(event) {
        window.parent.postMessage({
          type: 'SANDBOX_ERROR',
          payload: { message: String(event.reason) || 'Unhandled rejection' }
        }, '*');
      });

      // ── Listen for resize trigger from parent ──────────────────────────────
      // When the parent container width changes (device switching, drag resize),
      // it sends a SANDBOX_RESIZE message. We dispatch a real window resize
      // event so all Tailwind responsive classes recalculate immediately,
      // preventing the content snap-back during drag.
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'SANDBOX_RESIZE') {
          window.dispatchEvent(new Event('resize'));
        }
      });

      // ── Ready signal ───────────────────────────────────────────────────────
      window.addEventListener('load', function() {
        setTimeout(function() {
          window.parent.postMessage({ type: 'SANDBOX_READY' }, '*');
        }, 80);
      });
    </script>
  </body>
</html>`;
}

// ─── PreviewSandbox ────────────────────────────────────────────────────────────

export const PreviewSandbox = memo(function PreviewSandbox({
  html,
  theme,
  width,
  onError,
  onReady,
}: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevWidthRef = useRef<number | null>(null);

  // ── Build document ────────────────────────────────────────────────────────
  const srcDoc = useMemo(() => {
    if (!html) return null;
    const nonce =
      (window as unknown as { __CSP_NONCE__?: string }).__CSP_NONCE__ ?? '';
    return buildSandboxDocument(html, theme, nonce);
  }, [html, theme]);

  // ── Message handler ───────────────────────────────────────────────────────
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data = event.data as {
        type?: string;
        payload?: { message?: string };
      };

      if (data?.type === 'SANDBOX_READY') onReady();
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

  // ── Send resize signal to sandbox when width changes ──────────────────────
  // This fixes the content snap-back during drag resize.
  // We post a SANDBOX_RESIZE message to the iframe on every width change
  // so the content inside can immediately reflow at the correct size.
  useEffect(() => {
    if (width === prevWidthRef.current) return;
    prevWidthRef.current = width;

    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage({ type: 'SANDBOX_RESIZE' }, '*');
  }, [width]);

  // ── Surface error when no html ────────────────────────────────────────────
  useEffect(() => {
    if (!srcDoc) {
      onError('No preview content available');
    }
  }, [srcDoc, onError]);

  if (!srcDoc) return null;

  return (
    <iframe
      ref={iframeRef}
      title="Component preview"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="w-full h-full border-0 bg-transparent block"
      style={{
        // Do NOT constrain width here — the parent PreviewDeviceFrame
        // handles all width constraints. The iframe always fills 100%
        // of its container so content reflows correctly during resize.
        width: '100%',
        height: '100%',
        transition: 'none',
      }}
    />
  );
});