"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Lang } from "@/lib/i18n"
import type { SiteContent } from "@/lib/content"

export type EditorPath = (string | number)[]

type EditorContextValue = {
  enabled: true
  content: SiteContent
  lang: Lang
  setLang: (l: Lang) => void
  dirty: boolean
  patch: (path: EditorPath, value: unknown) => void
  patchSettings: (path: EditorPath, value: unknown) => void
  setContent: (c: SiteContent) => void
  markClean: () => void
  markDirty: () => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

function setIn(obj: any, path: EditorPath, value: unknown): any {
  if (path.length === 0) return value
  const [head, ...rest] = path
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }
  clone[head as any] = setIn(obj?.[head as any], rest, value)
  return clone
}

export function EditorProvider({
  initialContent,
  initialLang = "zh",
  children,
}: {
  initialContent: SiteContent
  initialLang?: Lang
  children: ReactNode
}) {
  const [content, setContentState] = useState<SiteContent>(initialContent)
  const [lang, setLang] = useState<Lang>(initialLang)
  const [dirty, setDirty] = useState(false)

  const setContent = useCallback((c: SiteContent) => {
    setContentState(c)
  }, [])

  const markClean = useCallback(() => setDirty(false), [])
  const markDirty = useCallback(() => setDirty(true), [])

  const patch = useCallback((path: EditorPath, value: unknown) => {
    setContentState((prev) => ({
      ...prev,
      [lang]: setIn(prev[lang], path, value),
    }))
    setDirty(true)
  }, [lang])

  const patchSettings = useCallback((path: EditorPath, value: unknown) => {
    setContentState((prev) => ({
      ...prev,
      settings: setIn(prev.settings, path, value),
    }))
    setDirty(true)
  }, [])

  const value = useMemo<EditorContextValue>(
    () => ({
      enabled: true,
      content,
      lang,
      setLang,
      dirty,
      patch,
      patchSettings,
      setContent,
      markClean,
      markDirty,
    }),
    [content, lang, dirty, patch, patchSettings, setContent, markClean, markDirty],
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor(): EditorContextValue | null {
  return useContext(EditorContext)
}

export function useEditorRequired(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error("useEditorRequired must be used within EditorProvider")
  return ctx
}
