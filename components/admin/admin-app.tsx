"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  createDefaultContent,
  normalizeSiteContent,
  type SiteContent,
} from "@/lib/content"
import { Sidebar, type SectionKey } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"
import { EditorProvider, useEditorRequired } from "@/components/admin/editor-provider"
import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { LandingSections } from "@/components/landing-sections"
import { SiteFooter } from "@/components/site-footer"
import { BrandingSettings, SeoSettings } from "@/components/admin/settings-panels"
import { Card } from "@/components/admin/primitives"
import {
  SectionPresenceBar,
  useActivePageSection,
} from "@/components/admin/section-presence"
import { InsertToolbar } from "@/components/admin/insert-toolbar"
import { LayersPanel } from "@/components/admin/layers-panel"
import {
  ARTBOARD_SELECT_EVENT,
  type ArtboardSelectDetail,
} from "@/components/artboard/section-artboard"
import {
  createDefaultArtboards,
  deleteItemFromArtboard,
  restoreRemovedItem,
  type ArtboardSectionId,
} from "@/lib/artboard"
import type { PageSectionId } from "@/lib/content"

function stripMeta(data: SiteContent & { _meta?: { dbConnected?: boolean } }): {
  content: SiteContent
  dbConnected: boolean
} {
  const { _meta, ...rest } = data
  return {
    content: normalizeSiteContent(rest as SiteContent),
    dbConnected: Boolean(_meta?.dbConnected),
  }
}

function VisualCanvas({
  viewport,
  onActiveSection,
}: {
  viewport: "desktop" | "mobile"
  onActiveSection?: (id: PageSectionId) => void
}) {
  const editor = useEditorRequired()
  const activeSection = useActivePageSection("#visual-canvas")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sectionId = activeSection as ArtboardSectionId
  const board =
    editor.content.settings.artboards?.[sectionId] ||
    createDefaultArtboards()[sectionId]

  useEffect(() => {
    onActiveSection?.(activeSection)
  }, [activeSection, onActiveSection])

  useEffect(() => {
    setSelectedId(null)
  }, [activeSection])

  useEffect(() => {
    const onSelect = (e: Event) => {
      const detail = (e as CustomEvent<ArtboardSelectDetail>).detail
      if (!detail) return
      if (detail.sectionId !== sectionId) return
      setSelectedId(detail.id)
    }
    window.addEventListener(ARTBOARD_SELECT_EVENT, onSelect)
    return () => window.removeEventListener(ARTBOARD_SELECT_EVENT, onSelect)
  }, [sectionId])

  const commitBoard = (next: typeof board) => {
    editor.patchSettings(["artboards", sectionId], next, "mutate")
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="sticky top-[57px] z-10 mx-4 mt-2 sm:mx-6 lg:top-[61px]">
        <SectionPresenceBar
          active={activeSection}
          actions={<InsertToolbar activeSection={activeSection} />}
        />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 justify-center overflow-auto bg-muted/50 p-4 sm:p-6">
          <div
            id="visual-canvas"
            className={`min-h-[70vh] overflow-hidden rounded-2xl border border-border bg-background shadow-lg transition-all ${
              viewport === "mobile" ? "w-full max-w-[390px]" : "w-full max-w-6xl"
            }`}
          >
            <div className="border-b border-border bg-muted/40 px-3 py-2 text-center text-[11px] font-medium text-muted-foreground">
              刪除 · 複製 ⌘D · 微移方向鍵 · 對齊線 · ⌘Z · 記得儲存
            </div>
            <SiteHeader />
            <main>
              <LandingSections />
            </main>
            <SiteFooter />
          </div>
        </div>
        <LayersPanel
          sectionId={activeSection}
          board={board}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            window.dispatchEvent(
              new CustomEvent<ArtboardSelectDetail>(ARTBOARD_SELECT_EVENT, {
                detail: { sectionId, id },
              }),
            )
          }}
          onDelete={(id) => {
            commitBoard(deleteItemFromArtboard(board, id))
            if (selectedId === id) setSelectedId(null)
          }}
          onRestore={(id) => {
            commitBoard(restoreRemovedItem(board, sectionId, id))
            setSelectedId(id)
            window.dispatchEvent(
              new CustomEvent<ArtboardSelectDetail>(ARTBOARD_SELECT_EVENT, {
                detail: { sectionId, id },
              }),
            )
          }}
        />
      </div>
    </div>
  )
}

function AdminShell({
  dbConnected,
  onDbConnected,
}: {
  dbConnected: boolean
  onDbConnected: (v: boolean) => void
}) {
  const router = useRouter()
  const editor = useEditorRequired()
  const [active, setActive] = useState<SectionKey>("visual")
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")
  const [activePageSection, setActivePageSection] = useState<PageSectionId>("hero")

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editor.content),
      })
      if (res.status === 401) {
        router.replace("/admin/login")
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "儲存失敗")
      const { content, dbConnected: connected } = stripMeta(data)
      editor.setContent(content)
      editor.markClean()
      onDbConnected(connected)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "儲存失敗")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  const titles: Record<SectionKey, string> = {
    visual: "視覺編輯",
    branding: "品牌與連結",
    seo: "SEO 與 Meta",
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar
        active={active}
        onSelect={(k) => {
          setActive(k)
          setSidebarOpen(false)
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sectionOrder={editor.content.settings.sectionOrder}
        onReorderSections={(next) => editor.patchSettings(["sectionOrder"], next)}
        activePageSection={activePageSection}
        onJumpSection={(anchor) => {
          setActive("visual")
          requestAnimationFrame(() => {
            const el = document.querySelector(`#visual-canvas ${anchor}`)
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
          })
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          breadcrumb={titles[active]}
          lang={editor.lang}
          onLangChange={editor.setLang}
          dirty={editor.dirty}
          saved={saved}
          saving={saving}
          dbConnected={dbConnected}
          viewport={viewport}
          onViewportChange={setViewport}
          onSave={handleSave}
          onUndo={editor.undo}
          onRedo={editor.redo}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          onLogout={handleLogout}
          onMenu={() => setSidebarOpen(true)}
        />

        {!dbConnected ? (
          <p className="mx-4 mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive sm:mx-6">
            未連接資料庫（MONGODB_URI）。變更唔會永久保存。
          </p>
        ) : null}
        {error ? (
          <p className="mx-4 mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive sm:mx-6">
            {error}
          </p>
        ) : null}

        {active === "visual" ? (
          <VisualCanvas viewport={viewport} onActiveSection={setActivePageSection} />
        ) : (
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <Card title={titles[active]}>
              {active === "branding" ? (
                <BrandingSettings
                  settings={editor.content.settings}
                  patchSettings={editor.patchSettings}
                />
              ) : (
                <SeoSettings
                  settings={editor.content.settings}
                  patchSettings={editor.patchSettings}
                />
              )}
            </Card>
          </main>
        )}
      </div>
    </div>
  )
}

export function AdminApp() {
  const router = useRouter()
  const [initial, setInitial] = useState<SiteContent | null>(null)
  const [dbConnected, setDbConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/content", { cache: "no-store" })
      if (res.status === 401) {
        router.replace("/admin/login")
        return
      }
      if (!res.ok) throw new Error("無法載入內容")
      const data = await res.json()
      const { content, dbConnected: connected } = stripMeta(data)
      setInitial(content)
      setDbConnected(connected)
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗")
      setInitial(createDefaultContent())
      setDbConnected(false)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  if (loading || !initial) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 text-sm text-muted-foreground">
        載入視覺編輯器…
      </div>
    )
  }

  return (
    <EditorProvider initialContent={initial}>
      <LanguageProvider initialContent={initial}>
        {error ? (
          <p className="bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">{error}</p>
        ) : null}
        <AdminShell dbConnected={dbConnected} onDbConnected={setDbConnected} />
      </LanguageProvider>
    </EditorProvider>
  )
}
