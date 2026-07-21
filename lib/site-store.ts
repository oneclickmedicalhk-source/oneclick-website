import { getDb, isDbConfigured } from "@/lib/db"
import {
  createDefaultContent,
  normalizeSiteContent,
  type ActivityItem,
  type MediaItem,
  type SiteContent,
} from "@/lib/content"

const DOC_ID = "site"
const COLLECTION = "content"

type StoredDoc = SiteContent & { _id: string }

let memoryFallback: SiteContent | null = null

function cloneDefault(): SiteContent {
  return createDefaultContent()
}

function stripId(doc: StoredDoc): SiteContent {
  const { _id, ...rest } = doc
  return rest
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isDbConfigured()) {
    if (!memoryFallback) memoryFallback = cloneDefault()
    return normalizeSiteContent(structuredClone(memoryFallback))
  }

  const db = await getDb()
  const col = db.collection<StoredDoc>(COLLECTION)
  const existing = await col.findOne({ _id: DOC_ID })
  if (existing) return normalizeSiteContent(stripId(existing))

  const seeded = cloneDefault()
  seeded.updatedAt = new Date().toISOString()
  await col.insertOne({ ...seeded, _id: DOC_ID })
  return normalizeSiteContent(seeded)
}

export async function saveSiteContent(
  content: SiteContent,
  activityWhat?: string,
): Promise<SiteContent> {
  const next: SiteContent = {
    ...normalizeSiteContent(content),
    updatedAt: new Date().toISOString(),
  }

  if (activityWhat) {
    const entry: ActivityItem = {
      who: "Admin",
      what: activityWhat,
      when: "剛剛",
      at: new Date().toISOString(),
    }
    next.activity = [entry, ...(next.activity || [])].slice(0, 50)
  }

  if (!isDbConfigured()) {
    memoryFallback = structuredClone(next)
    return structuredClone(memoryFallback)
  }

  const db = await getDb()
  const col = db.collection<StoredDoc>(COLLECTION)
  const { _id: _ignored, ...rest } = next as SiteContent & { _id?: string }
  await col.updateOne({ _id: DOC_ID }, { $set: { ...rest, _id: DOC_ID } }, { upsert: true })
  return next
}

export async function addMediaItem(item: MediaItem): Promise<SiteContent> {
  const content = await getSiteContent()
  content.media = [item, ...content.media.filter((m) => m.id !== item.id)]
  return saveSiteContent(content, `上傳了圖片「${item.alt || item.id}」`)
}

export async function replaceMediaUrl(
  id: string,
  url: string,
  alt?: string,
): Promise<SiteContent> {
  const content = await getSiteContent()
  const idx = content.media.findIndex((m) => m.id === id)
  if (idx >= 0) {
    content.media[idx] = {
      ...content.media[idx],
      url,
      alt: alt || content.media[idx].alt,
      createdAt: new Date().toISOString(),
    }
  } else {
    content.media.unshift({
      id,
      url,
      alt: alt || id,
      createdAt: new Date().toISOString(),
    })
  }
  return saveSiteContent(content, `替換了圖片「${alt || id}」`)
}
