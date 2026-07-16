"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.authenticateUser = authenticateUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const db_1 = require("../database/db");
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
async function createUser(email, password, name) {
    const db = await (0, db_1.getDatabase)();
    const existing = db.data.users.find(u => u.email === email);
    if (existing) {
        throw new Error('User already exists');
    }
    const passwordHash = await hashPassword(password);
    const user = {
        id: (0, crypto_1.randomUUID)(),
        email,
        passwordHash,
        name,
        createdAt: new Date().toISOString(),
    };
    db.data.users.push(user);
    await db.write();
    return user;
}
async function findUserByEmail(email) {
    const db = await (0, db_1.getDatabase)();
    return db.data.users.find(u => u.email === email);
}
async function findUserById(id) {
    const db = await (0, db_1.getDatabase)();
    return db.data.users.find(u => u.id === id);
}
async function authenticateUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }
    const valid = await verifyPassword(password, user.passwordHash);
    return valid ? user : null;
}
