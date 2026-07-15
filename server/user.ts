import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDatabase, User } from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const db = await getDatabase();

  const existing = db.data.users.find(u => u.email === email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: randomUUID(),
    email,
    passwordHash,
    name,
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  return user;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDatabase();
  return db.data.users.find(u => u.email === email);
}

export async function findUserById(id: string): Promise<User | undefined> {
  const db = await getDatabase();
  return db.data.users.find(u => u.id === id);
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  return valid ? user : null;
}
