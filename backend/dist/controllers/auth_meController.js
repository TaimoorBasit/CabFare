"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const jwt_1 = require("../auth/jwt");
const user_1 = require("../services/user");
const getHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ error: 'No token provided' });
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded)
            return res.status(401).json({ error: 'Invalid or expired token' });
        const user = await (0, user_1.findUserById)(decoded.id);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};
exports.getHandler = getHandler;
