"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHandler = exports.getHandler = void 0;
const getHandler = async (req, res) => {
    return res.status(400).json({ error: "sync-live-db is disabled on Edge/Cloudflare runtimes because local filesystem access is not available." });
};
exports.getHandler = getHandler;
const postHandler = async (req, res) => {
    return res.status(400).json({ error: "sync-live-db is disabled on Edge/Cloudflare runtimes." });
};
exports.postHandler = postHandler;
