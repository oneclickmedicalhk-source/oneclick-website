"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { dict, type Lang } from "@/lib/i18n"
import { createDefaultContent, type LocaleContent, type SiteContent, type SiteSettings } from "@/lib/content"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: LocaleContent
  settings: SiteSettings
  content: SiteContent
  loading: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const LANG_KEY = "oc_lang"

export function LanguageProvider({
  children,
  initialContent,
}: {
  children: ReactNode
  initialContent?: SiteContent | null
}) {
  const fallback = useMemo(() => initialContent || createDefaultContent(), [initialContent])
  const [content, setContent] = useState<SiteContent>(fallback)
  const [loading, setLoading] = useState(!initialContent)
  const [lang, setLangState] = useState<Lang>("zh")

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null
      if (stored === "zh" || stored === "en") setLangState(stored)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en"
  }, [lang])

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent)
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/content", { cache: "no-store" })
        if (!res.ok) throw new Error("fail")
        const data = (await res.json()) as SiteContent
        if (!cancelled) setContent(data)
      } catch {
        if (!cancelled) {
          setContent({
            ...createDefaultContent(),
            zh: structuredClone(dict.zh) as LocaleContent,
            en: structuredClone(dict.en) as LocaleContent,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [initialContent])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === "zh" ? "en" : "zh")
  }, [lang, setLang])

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggle,
    t: content[lang],
    settings: content.settings,
    content,
    loading,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}

export function useAppUrl() {
  const { settings } = useLanguage()
  return settings.appUrl
}
