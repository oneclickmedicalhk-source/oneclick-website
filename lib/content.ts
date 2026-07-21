import { dict, APP_URL, type Dict, type Lang } from "@/lib/i18n"

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
  { id: "logo", url: "/icon.svg", alt: "主要 Logo", createdAt: new Date(0).toISOString() },
]

export function createDefaultContent(): SiteContent {
  return {
    zh: structuredClone(dict.zh) as LocaleContent,
    en: structuredClone(dict.en) as LocaleContent,
    settings: {
      appUrl: APP_URL,
      appStoreUrl: APP_URL,
      playStoreUrl: APP_URL,
      brandNameZh: "壹鍵康",
      brandNameEn: "OneClick Wellness",
      logoUrl: "/icon.svg",
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
