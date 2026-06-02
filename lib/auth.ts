import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const key = new TextEncoder().encode(secretKey);

export interface UserSession extends JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  name: string;
  firstName?: string;
  lastName?: string;
  patientNumber?: string; // For patient role
  doctorNumber?: string; // For doctor role
}

// Create a JWT token
export async function createToken(payload: UserSession): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

// Verify and decode JWT token
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as UserSession;
  } catch {
    return null;
  }
}

// Get current user session from cookies
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  
  return await verifyToken(token);
}

// Set session cookie
export async function setSession(user: UserSession) {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Clear session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
