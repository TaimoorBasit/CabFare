"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
const jwt_1 = require("./jwt");
const user_1 = require("../services/user");
async function getCurrentUser(authHeader) {
    const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
    if (!token) {
        return null;
    }
    const payload = (0, jwt_1.verifyToken)(token);
    if (!payload) {
        return null;
    }
    const user = await (0, user_1.findUserById)(payload.id);
    return user ? { id: user.id, email: user.email, name: user.name } : null;
}
