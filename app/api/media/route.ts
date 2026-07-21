import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { isAuthenticatedFromCookies } from "@/lib/auth"
import { addMediaItem, getSiteContent, replaceMediaUrl } from "@/lib/site-store"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const content = await getSiteContent()
    return NextResponse.json({ media: content.media || [] })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "無法讀取媒體" }, { status: 500 })
  }
}

async function persistFile(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "")
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext || "bin"}`

  // Prefer Vercel Blob when token is present
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob")
      const blob = await put(filename, bytes, {
        access: "public",
        contentType: file.type || undefined,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      return blob.url
    } catch (e) {
      console.warn("Blob upload failed, falling back", e)
    }
  }

  // Local / writable filesystem fallback
  try {
    const dir = path.join(process.cwd(), "public", "uploads")
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, filename), bytes)
    return `/uploads/${filename}`
  } catch {
    // Serverless fallback: data URL (fine for modest CMS images)
    const mime = file.type || "application/octet-stream"
    return `data:${mime};base64,${bytes.toString("base64")}`
  }
}

export async function POST(req: Request) {
  const ok = await isAuthenticatedFromCookies()
  if (!ok) return NextResponse.json({ error: "未授權" }, { status: 401 })

  try {
    const form = await req.formData()
    const file = form.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "缺少檔案" }, { status: 400 })
    }

    const replaceId = String(form.get("id") || "")
    const alt = String(form.get("alt") || file.name || "上傳圖片")
    const url = await persistFile(file)

    if (replaceId) {
      const content = await replaceMediaUrl(replaceId, url, alt)
      return NextResponse.json({ url, media: content.media, content })
    }

    const item = {
      id: randomUUID(),
      url,
      alt,
      createdAt: new Date().toISOString(),
    }
    const content = await addMediaItem(item)
    return NextResponse.json({ url, item, media: content.media, content })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "上傳失敗" }, { status: 500 })
  }
}
