"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const getHandler = async (req, res) => {
    return res.json({
        message: 'Hello from the Next.js API route!',
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
};
exports.getHandler = getHandler;
