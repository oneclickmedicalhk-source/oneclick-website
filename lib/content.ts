import { dict, APP_URL, type Dict, type Lang } from "@/lib/i18n"
import {
  createDefaultArtboards,
  normalizeArtboards,
  type ArtboardsMap,
} from "@/lib/artboard"

export type { ArtboardItem, ArtboardsMap, SectionArtboardData } from "@/lib/artboard"
export { ARTBOARD_WIDTH, createDefaultArtboards, normalizeArtboards } from "@/lib/artboard"

export type MediaItem = {
  id: string
  url: string
  alt: string
  createdAt: string
}

export type ActivityItem = {
  who: string
  what: string
  when: string
  at: string
}

export type PageSectionId =
  | "hero"
  | "features"
  | "how"
  | "enterprise"
  | "about"
  | "download"

export type LayoutTransform = {
  x: number
  y: number
  scale: number
}

export const DEFAULT_SECTION_ORDER: PageSectionId[] = [
  "hero",
  "features",
  "how",
  "enterprise",
  "about",
  "download",
]

export const SECTION_ANCHORS: Record<PageSectionId, string> = {
  hero: "#top",
  features: "#features",
  how: "#how",
  enterprise: "#enterprise",
  about: "#about",
  download: "#download",
}

export const SECTION_LABELS: Record<PageSectionId, string> = {
  hero: "Hero 主視覺",
  features: "平台功能",
  how: "使用流程",
  enterprise: "企業方案",
  about: "關於我們",
  download: "下載區塊",
}

export type SiteSettings = {
  appUrl: string
  appStoreUrl: string
  playStoreUrl: string
  brandNameZh: string
  brandNameEn: string
  logoUrl: string
  iconUrl: string
  images: {
    heroPrimary: string
    heroSecondary: string
    pillars: string[]
    enterprise: string
  }
  sectionOrder: PageSectionId[]
  layout: Record<string, LayoutTransform>
  artboards: ArtboardsMap
  seo: {
    title: string
    description: string
    themeColor: string
    canonical: string
    indexing: boolean
    ogEnabled: boolean
    ogImage: string
  }
}

export type LocaleContent = {
  nav: Dict["nav"]
  hero: Dict["hero"]
  pillars: Dict["pillars"]
  how: Dict["how"]
  enterprise: Dict["enterprise"]
  about: Dict["about"]
  download: Dict["download"]
  footer: Dict["footer"]
}

export type SiteContent = {
  _id?: string
  zh: LocaleContent
  en: LocaleContent
  settings: SiteSettings
  media: MediaItem[]
  activity: ActivityItem[]
  updatedAt?: string
}

const DEFAULT_MEDIA: MediaItem[] = [
  { id: "dashboard", url: "/screens/dashboard.jpeg", alt: "主畫面截圖", createdAt: new Date(0).toISOString() },
  { id: "ai-report", url: "/screens/ai-report.jpeg", alt: "AI 報告截圖", createdAt: new Date(0).toISOString() },
  { id: "checkup", url: "/screens/checkup.jpeg", alt: "體檢預約截圖", createdAt: new Date(0).toISOString() },
  { id: "enterprise", url: "/screens/enterprise.jpeg", alt: "企業方案截圖", createdAt: new Date(0).toISOString() },
  { id: "products", url: "/screens/products.jpeg", alt: "保健產品截圖", createdAt: new Date(0).toISOString() },
  { id: "questionnaire", url: "/screens/questionnaire.jpeg", alt: "問卷截圖", createdAt: new Date(0).toISOString() },
  { id: "apple-icon", url: "/apple-icon.png", alt: "App 圖示", createdAt: new Date(0).toISOString() },
  { id: "logo", url: "/brand/oneclick-logo.png", alt: "主要 Logo", createdAt: new Date(0).toISOString() },
]

export function createDefaultContent(): SiteContent {
  return {
    zh: structuredClone(dict.zh) as LocaleContent,
    en: structuredClone(dict.en) as LocaleContent,
    settings: {
      appUrl: APP_URL,
      appStoreUrl: APP_URL,
      playStoreUrl: "https://play.google.com/store/apps/details?id=hk.com.oneclick.wellness",
      brandNameZh: "壹鍵康",
      brandNameEn: "OneClick Wellness",
      logoUrl: "/brand/oneclick-logo.png",
      iconUrl: "/apple-icon.png",
      images: {
        heroPrimary: "/screens/dashboard.jpeg",
        heroSecondary: "/screens/ai-report.jpeg",
        pillars: [
          "/screens/ai-report.jpeg",
          "/screens/checkup.jpeg",
          "/screens/enterprise.jpeg",
          "/screens/products.jpeg",
        ],
        enterprise: "/screens/enterprise.jpeg",
      },
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      layout: {},
      artboards: createDefaultArtboards(),
      seo: {
        title: "壹鍵康 OneClick Wellness | 一站式 AI 健康管理平台",
        description:
          "壹鍵康 OneClick Wellness — 由壹健康科技有限公司打造的一站式 AI 健康平台。健康問卷、AI 健康報告、體檢預約、企業團體計劃及保健產品，一鍵掌握你的健康。",
        themeColor: "#2151a1",
        canonical: "https://oneclick.hk",
        indexing: true,
        ogEnabled: true,
        ogImage: "/screens/dashboard.jpeg",
      },
    },
    media: structuredClone(DEFAULT_MEDIA),
    activity: [],
  }
}

export function normalizeSectionOrder(order: unknown): PageSectionId[] {
  const allowed = new Set<PageSectionId>(DEFAULT_SECTION_ORDER)
  const list = Array.isArray(order)
    ? order.filter((id): id is PageSectionId => typeof id === "string" && allowed.has(id as PageSectionId))
    : []
  const seen = new Set<PageSectionId>()
  const next: PageSectionId[] = []
  for (const id of list) {
    if (seen.has(id)) continue
    seen.add(id)
    next.push(id)
  }
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) next.push(id)
  }
  return next
}

export function normalizeLayout(layout: unknown): Record<string, LayoutTransform> {
  if (!layout || typeof layout !== "object") return {}
  const out: Record<string, LayoutTransform> = {}
  for (const [key, value] of Object.entries(layout as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue
    const v = value as Partial<LayoutTransform>
    const x = typeof v.x === "number" && Number.isFinite(v.x) ? v.x : 0
    const y = typeof v.y === "number" && Number.isFinite(v.y) ? v.y : 0
    const scale =
      typeof v.scale === "number" && Number.isFinite(v.scale) ? Math.min(1.5, Math.max(0.5, v.scale)) : 1
    if (x === 0 && y === 0 && scale === 1) continue
    out[key] = { x, y, scale }
  }
  return out
}

/** Merge older Mongo docs that lack sectionOrder / layout / artboards. */
export function normalizeSiteContent(raw: SiteContent): SiteContent {
  const defaults = createDefaultContent()
  return {
    ...defaults,
    ...raw,
    zh: raw.zh || defaults.zh,
    en: raw.en || defaults.en,
    media: Array.isArray(raw.media) ? raw.media : defaults.media,
    activity: Array.isArray(raw.activity) ? raw.activity : [],
    settings: {
      ...defaults.settings,
      ...(raw.settings || {}),
      images: {
        ...defaults.settings.images,
        ...(raw.settings?.images || {}),
        pillars:
          Array.isArray(raw.settings?.images?.pillars) && raw.settings.images.pillars.length
            ? raw.settings.images.pillars
            : defaults.settings.images.pillars,
      },
      seo: {
        ...defaults.settings.seo,
        ...(raw.settings?.seo || {}),
      },
      sectionOrder: normalizeSectionOrder(raw.settings?.sectionOrder),
      layout: normalizeLayout(raw.settings?.layout),
      artboards: normalizeArtboards(raw.settings?.artboards),
    },
  }
}

export function countEditableStrings(locale: LocaleContent): number {
  let n = 0
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      n += 1
      return
    }
    if (Array.isArray(v)) {
      v.forEach(walk)
      return
    }
    if (v && typeof v === "object") {
      Object.values(v).forEach(walk)
    }
  }
  walk(locale)
  return n
}

export type { Lang, Dict } from "@/lib/i18n"
