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
exports.AIGenerationService = void 0;
const https = __importStar(require("https"));
const types_1 = require("../../shared/types");
const GEMINI_API_HOST = 'generativelanguage.googleapis.com';
const GEMINI_API_PATH = '/v1beta/interactions';
const GEMINI_API_REVISION = '2026-05-20';
const GEMINI_MODEL = 'gemini-3.6-flash';
class AIGenerationService {
    constructor(secretsManager, messageBridge, outputChannel) {
        this.secretsManager = secretsManager;
        this.messageBridge = messageBridge;
        this.outputChannel = outputChannel;
    }
    buildPrompt(userPrompt, framework) {
        const frameworkInstructions = {
            react: 'Generate a single React functional component using TypeScript and Tailwind CSS utility classes. Use JSX syntax with className attributes. Do not include imports or exports — just the JSX markup and any needed React hooks inline.',
            html: 'Generate clean semantic HTML with Tailwind CSS utility classes. Use class attributes.',
            vue: 'Generate a Vue 3 single-file component using the Composition API and Tailwind CSS utility classes.',
        };
        const instruction = frameworkInstructions[framework] ?? frameworkInstructions.react;
        return `You are an expert UI component generator for Quantum UI, a VS Code extension component library.

${instruction}

Rules:
- Output ONLY the code, no explanations, no markdown code fences, no backticks
- Keep the design modern, clean, and using a dark theme aesthetic with purple/violet accents
- Use Tailwind CSS classes exclusively for styling
- Make the component visually polished and production-ready
- Do not include comments in the code
- Keep it concise — a single component, not a full page

User request: ${userPrompt}`;
    }
    async generate(options) {
        const { requestId, prompt, framework } = options;
        this.outputChannel.appendLine(`[AI] generate() called — requestId=${requestId}, framework=${framework}`);
        const apiKey = await this.secretsManager.getApiKey();
        if (!apiKey) {
            this.outputChannel.appendLine('[AI] No API key found in SecretStorage');
            await this.sendError(requestId, 'No API key configured. Add your Gemini API key in Settings.');
            return;
        }
        this.outputChannel.appendLine(`[AI] API key found (length: ${apiKey.length}). Sending request...`);
        try {
            await this.streamInteraction(apiKey, prompt, framework, requestId);
            this.outputChannel.appendLine(`[AI] streamInteraction resolved for ${requestId}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            this.outputChannel.appendLine(`[AI] ERROR: ${message}`);
            await this.sendError(requestId, this.humanizeError(message));
        }
    }
    streamInteraction(apiKey, prompt, framework, requestId) {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify({
                model: GEMINI_MODEL,
                input: this.buildPrompt(prompt, framework),
                stream: true,
            });
            this.outputChannel.appendLine(`[AI] POST https://${GEMINI_API_HOST}${GEMINI_API_PATH} (model=${GEMINI_MODEL}, bodyBytes=${Buffer.byteLength(body)})`);
            const req = https.request({
                hostname: GEMINI_API_HOST,
                path: GEMINI_API_PATH,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                    'Api-Revision': GEMINI_API_REVISION,
                    'Content-Length': Buffer.byteLength(body),
                },
                timeout: 25000,
            }, (res) => {
                this.outputChannel.appendLine(`[AI] Response headers received — status ${res.statusCode}`);
                if (res.statusCode !== 200) {
                    let errorBody = '';
                    res.on('data', (chunk) => { errorBody += chunk; });
                    res.on('end', () => {
                        this.outputChannel.appendLine(`[AI] Non-200 body: ${errorBody.slice(0, 500)}`);
                        reject(new Error(this.parseErrorResponse(res.statusCode ?? 0, errorBody)));
                    });
                    return;
                }
                let fullResult = '';
                let buffer = '';
                let rawChunkCount = 0;
                res.on('data', (chunk) => {
                    rawChunkCount++;
                    buffer += chunk.toString('utf-8');
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith('data: '))
                            continue;
                        const data = trimmed.slice(6);
                        if (!data)
                            continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.event_type === 'step.delta' && parsed.delta?.type === 'text') {
                                const token = parsed.delta.text ?? '';
                                if (token) {
                                    fullResult += token;
                                    void this.sendChunk(requestId, token);
                                }
                            }
                        }
                        catch {
                            this.outputChannel.appendLine(`[AI] Unparseable SSE line: ${data.slice(0, 150)}`);
                        }
                    }
                });
                res.on('end', () => {
                    this.outputChannel.appendLine(`[AI] Stream ended — ${rawChunkCount} raw TCP chunks, ${fullResult.length} chars generated`);
                    void this.sendComplete(requestId, fullResult);
                    resolve();
                });
                res.on('error', (err) => {
                    this.outputChannel.appendLine(`[AI] Response stream error: ${String(err)}`);
                    reject(err);
                });
            });
            req.on('timeout', () => {
                this.outputChannel.appendLine('[AI] Request timed out after 25s — destroying socket');
                req.destroy(new Error('Request timed out'));
            });
            req.on('error', (err) => {
                this.outputChannel.appendLine(`[AI] Request-level error: ${String(err)}`);
                reject(err);
            });
            req.write(body);
            req.end();
        });
    }
    parseErrorResponse(statusCode, body) {
        try {
            const parsed = JSON.parse(body);
            if (parsed.error?.message)
                return parsed.error.message;
        }
        catch {
            // fall through
        }
        if (statusCode === 400)
            return 'Invalid request. The prompt may have been rejected by Gemini safety filters.';
        if (statusCode === 401 || statusCode === 403)
            return 'Invalid API key. Please check your Gemini API key in Settings.';
        if (statusCode === 429)
            return 'Rate limit reached. Please wait a moment and try again.';
        if (statusCode === 500 || statusCode === 503)
            return 'Gemini service error. Please try again shortly.';
        return `Request failed with status ${statusCode}`;
    }
    humanizeError(message) {
        if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
            return 'Could not connect to Gemini. Check your internet connection.';
        }
        if (message.includes('timed out')) {
            return 'The request timed out. Google\'s servers may be slow to respond — try again.';
        }
        return message;
    }
    async sendChunk(requestId, chunk) {
        await this.messageBridge.send({
            type: types_1.MessageType.AI_STREAM_CHUNK,
            payload: { chunk, requestId },
        });
    }
    async sendComplete(requestId, result) {
        await this.messageBridge.send({
            type: types_1.MessageType.AI_STREAM_END,
            payload: { requestId, result },
        });
    }
    async sendError(requestId, error) {
        await this.messageBridge.send({
            type: types_1.MessageType.AI_ERROR,
            payload: { requestId, error },
        });
    }
}
exports.AIGenerationService = AIGenerationService;
//# sourceMappingURL=AIGenerationService.js.map