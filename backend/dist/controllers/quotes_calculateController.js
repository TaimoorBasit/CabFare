import { generateQuotes } from '../engines/quoteEngine';
export const postHandler = async (req, res) => {
    try {
        const journey = req.body;
        const quotes = await generateQuotes(journey, req.env);
        return res.json({ quotes });
    }
    catch (error) {
        console.error("Quote calculation error:", error);
        return res.status(500).json({ error: error.message });
    }
};
