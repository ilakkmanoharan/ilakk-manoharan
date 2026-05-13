import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "portfolio_admin";

export function getJwtSecret(): Uint8Array | null {
  const s =
    process.env.ADMIN_SESSION_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "development-insecure-secret-min-32-chars!!"
      : null);
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function signAdminSession() {
  const key = getJwtSecret();
  if (!key) {
    throw new Error("ADMIN_SESSION_SECRET is required in production");
  }
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);
}

export async function verifyAdminSession(token: string) {
  const key = getJwtSecret();
  if (!key) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}
