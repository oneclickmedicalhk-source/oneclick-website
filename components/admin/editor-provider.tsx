"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { Lang } from "@/lib/i18n"
import type { SiteContent } from "@/lib/content"

export type EditorPath = (string | number)[]

const MAX_HISTORY = 80
const COALESCE_MS = 600

type EditorContextValue = {
  enabled: true
  content: SiteContent
  lang: Lang
  setLang: (l: Lang) => void
  dirty: boolean
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
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

function pathKey(path: EditorPath) {
  return path.map(String).join(".")
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
  const [undoStack, setUndoStack] = useState<SiteContent[]>([])
  const [redoStack, setRedoStack] = useState<SiteContent[]>([])
  const coalesceRef = useRef<{ key: string; at: number }>({ key: "", at: 0 })
  const contentRef = useRef(content)
  contentRef.current = content

  const pushUndo = useCallback((prev: SiteContent, key: string) => {
    const now = Date.now()
    const last = coalesceRef.current
    const coalesce =
      key.startsWith("artboards") &&
      last.key.startsWith("artboards") &&
      now - last.at < COALESCE_MS

    coalesceRef.current = { key, at: now }
    if (coalesce) return

    setUndoStack((stack) => [...stack, structuredClone(prev)].slice(-MAX_HISTORY))
    setRedoStack([])
  }, [])

  const setContent = useCallback((c: SiteContent) => {
    setContentState(c)
    // Loading / saving resets history so undo doesn't jump across sessions
    setUndoStack([])
    setRedoStack([])
    coalesceRef.current = { key: "", at: 0 }
  }, [])

  const markClean = useCallback(() => setDirty(false), [])
  const markDirty = useCallback(() => setDirty(true), [])

  const patch = useCallback(
    (path: EditorPath, value: unknown) => {
      const prev = contentRef.current
      pushUndo(prev, `locale.${pathKey(path)}`)
      setContentState({
        ...prev,
        [lang]: setIn(prev[lang], path, value),
      })
      setDirty(true)
    },
    [lang, pushUndo],
  )

  const patchSettings = useCallback(
    (path: EditorPath, value: unknown) => {
      const prev = contentRef.current
      pushUndo(prev, `settings.${pathKey(path)}`)
      setContentState({
        ...prev,
        settings: setIn(prev.settings, path, value),
      })
      setDirty(true)
    },
    [pushUndo],
  )

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack
      const prev = stack[stack.length - 1]
      const current = contentRef.current
      setRedoStack((redo) => [...redo, structuredClone(current)].slice(-MAX_HISTORY))
      setContentState(structuredClone(prev))
      setDirty(true)
      coalesceRef.current = { key: "", at: 0 }
      return stack.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setRedoStack((stack) => {
      if (stack.length === 0) return stack
      const next = stack[stack.length - 1]
      const current = contentRef.current
      setUndoStack((undo) => [...undo, structuredClone(current)].slice(-MAX_HISTORY))
      setContentState(structuredClone(next))
      setDirty(true)
      coalesceRef.current = { key: "", at: 0 }
      return stack.slice(0, -1)
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        target?.isContentEditable ||
        target?.closest?.("[contenteditable=true]")
      // Allow undo even while editing text fields (restore previous CMS state)
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault()
        redo()
        return
      }
      void typing
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [undo, redo])

  const value = useMemo<EditorContextValue>(
    () => ({
      enabled: true,
      content,
      lang,
      setLang,
      dirty,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      undo,
      redo,
      patch,
      patchSettings,
      setContent,
      markClean,
      markDirty,
    }),
    [
      content,
      lang,
      dirty,
      undoStack.length,
      redoStack.length,
      undo,
      redo,
      patch,
      patchSettings,
      setContent,
      markClean,
      markDirty,
    ],
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
