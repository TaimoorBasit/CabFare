export const getHandler = async (req, res) => {
    return res.json({
        message: 'Hello from the Next.js API route!',
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
};
