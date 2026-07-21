import { NextResponse } from "next/server"
import { isAuthenticatedFromCookies } from "@/lib/auth"
import { isDbConfigured } from "@/lib/db"
import { getSiteContent, saveSiteContent } from "@/lib/site-store"
import type { SiteContent } from "@/lib/content"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const content = await getSiteContent()
    return NextResponse.json(
      { ...content, _meta: { dbConnected: isDbConfigured() } },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "無法讀取內容" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const ok = await isAuthenticatedFromCookies()
  if (!ok) return NextResponse.json({ error: "未授權" }, { status: 401 })

  try {
    const body = (await req.json()) as SiteContent & { _meta?: unknown }
    const { _meta, ...rest } = body as SiteContent & { _meta?: unknown }
    if (!rest?.zh || !rest?.en || !rest?.settings) {
      return NextResponse.json({ error: "內容格式不正確" }, { status: 400 })
    }
    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "未連接資料庫，變更唔會永久保存。請設定 MONGODB_URI。" },
        { status: 503 },
      )
    }
    const saved = await saveSiteContent(rest, "更新了網站內容")
    return NextResponse.json({ ...saved, _meta: { dbConnected: true } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "儲存失敗" }, { status: 500 })
  }
}
