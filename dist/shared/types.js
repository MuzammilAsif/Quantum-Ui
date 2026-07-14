"use strict";
// ─── Message Types (Extension ↔ Webview) ─────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["READY"] = "READY";
    MessageType["GET_CONFIG"] = "GET_CONFIG";
    MessageType["SET_CONFIG"] = "SET_CONFIG";
    MessageType["OPEN_FILE"] = "OPEN_FILE";
    MessageType["COPY_TO_CLIPBOARD"] = "COPY_TO_CLIPBOARD";
    MessageType["SHOW_NOTIFICATION"] = "SHOW_NOTIFICATION";
    MessageType["LOG"] = "LOG";
    MessageType["CONFIG_LOADED"] = "CONFIG_LOADED";
    MessageType["THEME_CHANGED"] = "THEME_CHANGED";
    MessageType["ERROR"] = "ERROR";
    MessageType["AI_GENERATE"] = "AI_GENERATE";
    MessageType["AI_STREAM_CHUNK"] = "AI_STREAM_CHUNK";
    MessageType["AI_STREAM_END"] = "AI_STREAM_END";
    MessageType["AI_ERROR"] = "AI_ERROR";
    MessageType["INSERT_COMPONENT"] = "INSERT_COMPONENT";
    MessageType["PREVIEW_COMPONENT"] = "PREVIEW_COMPONENT";
    MessageType["SET_API_KEY"] = "SET_API_KEY";
    MessageType["GET_API_KEY_STATUS"] = "GET_API_KEY_STATUS";
    MessageType["API_KEY_STATUS"] = "API_KEY_STATUS";
    MessageType["CLEAR_API_KEY"] = "CLEAR_API_KEY";
})(MessageType || (exports.MessageType = MessageType = {}));
exports.DEFAULT_CONFIG = {
    theme: 'dark',
    accentColor: 'purple',
    animationsEnabled: true,
    compactMode: false,
    defaultFramework: 'react',
    defaultLanguage: 'typescript',
};
//# sourceMappingURL=types.js.map