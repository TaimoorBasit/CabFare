import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/db';
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export async function createUser(email, password, name, env) {
    const db = await getDatabase(env);
    if (!db.data)
        return null;
    const existingUser = db.data.users.find((u) => u.email === email);
    if (existingUser)
        return null; // Email already in use
    const passwordHash = await hashPassword(password);
    const newUser = {
        id: Date.now().toString(), // basic id generation
        email,
        passwordHash,
        name,
        createdAt: new Date().toISOString()
    };
    db.data.users.push(newUser);
    await db.write();
    return newUser;
}
export async function findUserByEmail(email, env) {
    const db = await getDatabase(env);
    if (!db.data)
        return null;
    return db.data.users.find((u) => u.email === email) || null;
}
export async function findUserById(id, env) {
    const db = await getDatabase(env);
    if (!db.data)
        return null;
    return db.data.users.find((u) => u.id === id) || null;
}
export async function authenticateUser(email, password, env) {
    const user = await findUserByEmail(email, env);
    if (!user) {
        return null;
    }
    const valid = await verifyPassword(password, user.passwordHash);
    return valid ? user : null;
}
