import { NextResponse } from "next/server"
import { isAuthenticatedFromCookies } from "@/lib/auth"

export async function GET() {
  const ok = await isAuthenticatedFromCookies()
  return NextResponse.json({ authenticated: ok })
}
