import { NextResponse } from "next/server"
import { isAuthenticatedFromCookies } from "@/lib/auth"
import { getSiteContent } from "@/lib/site-store"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const content = await getSiteContent()
    return NextResponse.json({ activity: content.activity || [] })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "無法讀取活動" }, { status: 500 })
  }
}
