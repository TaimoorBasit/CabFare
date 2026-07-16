"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHandler = void 0;
const user_1 = require("../services/user");
const postHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: 'Missing required fields' });
        const newUser = await (0, user_1.createUser)(name, email, password);
        if (!newUser)
            return res.status(400).json({ error: 'Registration failed' });
        return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Registration failed' });
    }
};
exports.postHandler = postHandler;
