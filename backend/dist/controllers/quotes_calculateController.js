"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHandler = void 0;
const quoteEngine_1 = require("../engines/quoteEngine");
const postHandler = async (req, res) => {
    try {
        const journey = req.body;
        const quotes = await (0, quoteEngine_1.generateQuotes)(journey);
        return res.json({ quotes });
    }
    catch (error) {
        console.error("Quote calculation error:", error);
        return res.status(500).json({ error: error.message });
    }
};
exports.postHandler = postHandler;
