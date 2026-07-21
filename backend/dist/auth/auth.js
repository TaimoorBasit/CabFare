import { extractTokenFromHeader, verifyToken } from './jwt';
import { findUserById } from '../services/user';
export async function getCurrentUser(authHeader, env) {
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
        return null;
    }
    const payload = await verifyToken(token, env);
    if (!payload) {
        return null;
    }
    const user = await findUserById(payload.id, env);
    return user ? { id: user.id, email: user.email, name: user.name } : null;
}
