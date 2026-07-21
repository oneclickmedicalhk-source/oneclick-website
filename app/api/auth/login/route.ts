import { NextResponse } from "next/server"
import { AUTH_COOKIE, checkAdminPassword, createSessionToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const password = String(body?.password || "")
    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: "密碼錯誤" }, { status: 401 })
    }
    const token = await createSessionToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch {
    return NextResponse.json({ error: "登入失敗" }, { status: 400 })
  }
}
