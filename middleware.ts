import { NextResponse, type NextRequest } from "next/server"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect write APIs
  const isWriteApi =
    (pathname === "/api/content" && req.method === "PUT") ||
    (pathname === "/api/media" && req.method === "POST") ||
    pathname.startsWith("/api/auth/logout")

  if (pathname.startsWith("/admin") || isWriteApi) {
    // Allow login page itself
    if (pathname === "/admin/login") return NextResponse.next()

    const token = req.cookies.get(AUTH_COOKIE)?.value
    const ok = await verifySessionToken(token)

    if (!ok) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "未授權" }, { status: 401 })
      }
      const url = req.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/content", "/api/media", "/api/auth/logout"],
}
