import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const AUTH_COOKIE = "oc_admin_session"

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-change-me"
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export async function isAuthenticatedFromCookies(): Promise<boolean> {
  const jar = await cookies()
  return verifySessionToken(jar.get(AUTH_COOKIE)?.value)
}

export async function isAuthenticatedFromRequest(req: NextRequest): Promise<boolean> {
  return verifySessionToken(req.cookies.get(AUTH_COOKIE)?.value)
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    // Dev fallback so local works before env is set
    return password === "oneclick-admin"
  }
  return password === expected
}
