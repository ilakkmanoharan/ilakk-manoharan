/**
 * Memoir authentication utilities
 * Password-based authentication with HttpOnly session cookies
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'memoir_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function getJwtSecret(): Uint8Array {
  const secret = process.env.MEMOIR_JWT_SECRET;
  if (!secret) {
    throw new Error('MEMOIR_JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

function getMemoirPassword(): string {
  const password = process.env.MEMOIR_PASSWORD;
  if (!password) {
    throw new Error('MEMOIR_PASSWORD environment variable is required');
  }
  return password;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const correctPassword = getMemoirPassword();
  return password === correctPassword;
}

export async function createSession(): Promise<string> {
  const secret = getJwtSecret();
  const token = await new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_DURATION))
    .sign(secret);
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const secret = getJwtSecret();
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // in seconds
    path: '/',
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isOwnerAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  if (!token) {
    return false;
  }
  return verifySession(token);
}
