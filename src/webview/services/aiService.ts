import type { AIGenerationRequest, AIGenerationOptions, Framework } from '../types';
import { generateId } from '../utils';
import { AI_STREAM_TIMEOUT_MS } from '../constants';

type StreamChunkCallback = (chunk: string) => void;
type StreamCompleteCallback = (result: string) => void;
type StreamErrorCallback = (error: string) => void;

/**
 * AIService — infrastructure layer for AI-powered component generation.
 *
 * Phase 1 (current): Architecture + placeholder methods.
 * Phase 2 (future): Wire to real streaming API endpoint.
 */
class AIService {
  private activeRequests = new Map<string, AbortController>();

  /**
   * Generate a UI component from a natural language prompt.
   * Returns a request object for tracking state.
   */
  async generate(
    prompt: string,
    framework: Framework,
    _options: AIGenerationOptions = {}
  ): Promise<AIGenerationRequest> {
    const request: AIGenerationRequest = {
      id: generateId(),
      prompt,
      framework,
      options: _options,
      status: 'pending',
      createdAt: Date.now(),
    };

    // TODO Phase 2: Replace with real API call
    // const response = await apiService.post(API_ENDPOINTS.AI_GENERATE, { prompt, framework, options });

    return request;
  }

  /**
   * Stream AI-generated component code chunk by chunk.
   * Uses Server-Sent Events for real-time streaming.
   */
  async streamGenerate(
    prompt: string,
    framework: Framework,
    callbacks: {
      onChunk: StreamChunkCallback;
      onComplete: StreamCompleteCallback;
      onError: StreamErrorCallback;
    },
    _options: AIGenerationOptions = {}
  ): Promise<string> {
    const requestId = generateId();
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);

    const timeoutId = setTimeout(() => {
      controller.abort();
      callbacks.onError('Request timed out');
    }, AI_STREAM_TIMEOUT_MS);

    try {
      // TODO Phase 2: Implement real SSE streaming
      // const url = `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AI_STREAM}`;
      // const response = await fetch(url, { ... });
      // const reader = response.body?.getReader();
      // while (true) { const { done, value } = await reader.read(); ... }

      // Phase 1 placeholder: simulate streaming
      await this.simulateStream(prompt, framework, callbacks, controller.signal);
      return requestId;
    } finally {
      clearTimeout(timeoutId);
      this.activeRequests.delete(requestId);
    }
  }

  /**
   * Cancel an in-progress generation request.
   */
  cancelRequest(requestId: string): void {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  /**
   * Cancel all active requests.
   */
  cancelAll(): void {
    this.activeRequests.forEach((controller) => controller.abort());
    this.activeRequests.clear();
  }

  /**
   * Placeholder streaming simulation for development.
   * Remove when real API is integrated.
   */
  private async simulateStream(
    prompt: string,
    _framework: Framework,
    callbacks: { onChunk: StreamChunkCallback; onComplete: StreamCompleteCallback; onError: StreamErrorCallback },
    signal: AbortSignal
  ): Promise<void> {
    const mockCode = `// Generated for: "${prompt}"\n// AI integration coming in Phase 2\nexport function Component() {\n  return <div>AI Studio</div>;\n}`;
    const chunks = mockCode.split('');

    for (const chunk of chunks) {
      if (signal.aborted) return;
      await new Promise<void>((resolve) => setTimeout(resolve, 10));
      callbacks.onChunk(chunk);
    }

    callbacks.onComplete(mockCode);
  }
}

export const aiService = new AIService();