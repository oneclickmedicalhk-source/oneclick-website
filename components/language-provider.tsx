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
import {
  createDefaultContent,
  type LocaleContent,
  type SiteContent,
  type SiteSettings,
} from "@/lib/content"
import { useEditor } from "@/components/admin/editor-provider"

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

function stripMeta(data: SiteContent & { _meta?: unknown }): SiteContent {
  const { _meta, ...rest } = data as SiteContent & { _meta?: unknown }
  return rest as SiteContent
}

export function LanguageProvider({
  children,
  initialContent,
}: {
  children: ReactNode
  initialContent?: SiteContent | null
}) {
  const editor = useEditor()
  const fallback = useMemo(() => initialContent || createDefaultContent(), [initialContent])
  const [localContent, setLocalContent] = useState<SiteContent>(fallback)
  const [loading, setLoading] = useState(!initialContent && !editor)
  const [localLang, setLocalLangState] = useState<Lang>("zh")

  useEffect(() => {
    if (editor) return
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null
      if (stored === "zh" || stored === "en") setLocalLangState(stored)
    } catch {
      /* ignore */
    }
  }, [editor])

  useEffect(() => {
    if (editor) return
    document.documentElement.lang = localLang === "zh" ? "zh-Hant" : "en"
  }, [localLang, editor])

  useEffect(() => {
    if (editor) {
      setLoading(false)
      return
    }
    if (initialContent) {
      setLocalContent(stripMeta(initialContent as SiteContent & { _meta?: unknown }))
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/content", { cache: "no-store" })
        if (!res.ok) throw new Error("fail")
        const data = await res.json()
        if (!cancelled) setLocalContent(stripMeta(data))
      } catch {
        if (!cancelled) {
          setLocalContent({
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
  }, [initialContent, editor])

  const setLocalLang = useCallback((next: Lang) => {
    setLocalLangState(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const content = editor ? editor.content : localContent
  const lang = editor ? editor.lang : localLang
  const setLang = editor ? editor.setLang : setLocalLang

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
