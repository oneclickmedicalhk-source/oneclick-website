import { NextResponse } from "next/server"
import { isAuthenticatedFromCookies } from "@/lib/auth"
import { getSiteContent, saveSiteContent } from "@/lib/site-store"
import type { SiteContent } from "@/lib/content"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const content = await getSiteContent()
    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "無法讀取內容" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const ok = await isAuthenticatedFromCookies()
  if (!ok) return NextResponse.json({ error: "未授權" }, { status: 401 })

  try {
    const body = (await req.json()) as SiteContent
    if (!body?.zh || !body?.en || !body?.settings) {
      return NextResponse.json({ error: "內容格式不正確" }, { status: 400 })
    }
    const saved = await saveSiteContent(body, "更新了網站內容")
    return NextResponse.json(saved)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "儲存失敗" }, { status: 500 })
  }
}
