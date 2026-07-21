"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createDefaultContent, type Lang, type SiteContent } from "@/lib/content"
import { Sidebar, type SectionKey } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"
import { PageHeader } from "@/components/admin/primitives"
import {
  AboutEditor,
  DownloadEditor,
  EnterpriseEditor,
  HeroEditor,
  HowEditor,
  PillarsEditor,
} from "@/components/admin/content-editors"
import {
  BrandingEditor,
  DashboardView,
  FooterEditor,
  MediaLibrary,
  NavigationEditor,
  SeoEditor,
} from "@/components/admin/global-editors"

const SECTION_META: Record<SectionKey, { title: string; desc: string }> = {
  dashboard: { title: "儀表板", desc: "內容管理系統總覽與快速操作。" },
  branding: { title: "品牌與 Logo", desc: "管理標誌、品牌名稱、App 連結與主題色彩。" },
  hero: { title: "主視覺 Hero", desc: "首頁最上方的標題、文案、按鈕與圖片。" },
  pillars: { title: "平台功能", desc: "四大功能支柱的內容、重點與按鈕。" },
  how: { title: "使用流程", desc: "四步驟流程說明與行動按鈕。" },
  enterprise: { title: "企業計劃", desc: "企業團體方案區塊內容。" },
  about: { title: "關於我們", desc: "公司介紹與核心價值。" },
  download: { title: "下載區塊", desc: "頁尾上方的行動呼籲區。" },
  navigation: { title: "導覽與按鈕", desc: "頂部選單項目與全站所有行動按鈕文字。" },
  footer: { title: "頁尾 Footer", desc: "頁尾文案、連結、免責聲明與版權。" },
  media: { title: "圖片媒體庫", desc: "集中管理所有圖片資產。" },
  seo: { title: "SEO 與 Meta", desc: "搜尋引擎與社交分享設定。" },
}

function setIn(obj: any, path: (string | number)[], value: unknown): any {
  if (path.length === 0) return value
  const [head, ...rest] = path
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }
  clone[head as any] = setIn(obj?.[head as any], rest, value)
  return clone
}

export function AdminApp() {
  const router = useRouter()
  const [active, setActive] = useState<SectionKey>("dashboard")
  const [lang, setLang] = useState<Lang>("zh")
  const [content, setContent] = useState<SiteContent | null>(null)
  const [baseline, setBaseline] = useState<SiteContent | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      const data = (await res.json()) as SiteContent
      setContent(data)
      setBaseline(structuredClone(data))
      setDirty(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗")
      const fallback = createDefaultContent()
      setContent(fallback)
      setBaseline(structuredClone(fallback))
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const patch = (path: (string | number)[], value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev
      return { ...prev, [lang]: setIn(prev[lang], path, value) }
    })
    setDirty(true)
    setSaved(false)
  }

  const patchSettings = (path: (string | number)[], value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev
      return { ...prev, settings: setIn(prev.settings, path, value) }
    })
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (res.status === 401) {
        router.replace("/admin/login")
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "儲存失敗")
      }
      const savedContent = (await res.json()) as SiteContent
      setContent(savedContent)
      setBaseline(structuredClone(savedContent))
      setDirty(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "儲存失敗")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (!baseline) return
    setContent(structuredClone(baseline))
    setDirty(false)
    setSaved(false)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  const meta = SECTION_META[active]
  const d = content?.[lang]

  const body = useMemo(() => {
    if (!content || !d) return null
    switch (active) {
      case "dashboard":
        return <DashboardView content={content} onNavigate={setActive} />
      case "branding":
        return <BrandingEditor settings={content.settings} patchSettings={patchSettings} />
      case "hero":
        return (
          <HeroEditor
            d={d}
            patch={patch}
            settings={content.settings}
            patchSettings={patchSettings}
          />
        )
      case "pillars":
        return (
          <PillarsEditor
            d={d}
            patch={patch}
            settings={content.settings}
            patchSettings={patchSettings}
          />
        )
      case "how":
        return <HowEditor d={d} patch={patch} />
      case "enterprise":
        return (
          <EnterpriseEditor
            d={d}
            patch={patch}
            settings={content.settings}
            patchSettings={patchSettings}
          />
        )
      case "about":
        return <AboutEditor d={d} patch={patch} />
      case "download":
        return <DownloadEditor d={d} patch={patch} />
      case "navigation":
        return <NavigationEditor d={d} patch={patch} />
      case "footer":
        return <FooterEditor d={d} patch={patch} />
      case "media":
        return (
          <MediaLibrary
            media={content.media}
            onMediaChange={(media) => {
              setContent((prev) => (prev ? { ...prev, media } : prev))
              setDirty(true)
              setSaved(false)
            }}
          />
        )
      case "seo":
        return <SeoEditor settings={content.settings} patchSettings={patchSettings} />
      default:
        return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, d, lang, content])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 text-sm text-muted-foreground">
        載入內容管理系統…
      </div>
    )
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
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          breadcrumb={meta.title}
          lang={lang}
          onLangChange={setLang}
          dirty={dirty}
          saved={saved}
          saving={saving}
          onSave={handleSave}
          onReset={handleReset}
          onLogout={handleLogout}
          onMenu={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <PageHeader title={meta.title} description={meta.desc} />
          {error ? (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="mt-6">{body}</div>
        </main>
      </div>
    </div>
  )
}
