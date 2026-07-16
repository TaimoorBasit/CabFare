"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHandler = void 0;
const user_1 = require("../services/user");
const jwt_1 = require("../auth/jwt");
const postHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Missing required fields: email, password' });
        const user = await (0, user_1.authenticateUser)(email, password);
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = (0, jwt_1.createToken)({ id: user.id, email: user.email });
        return res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Login failed' });
    }
};
exports.postHandler = postHandler;
