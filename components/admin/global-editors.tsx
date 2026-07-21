"use client"

import type { SectionKey } from "@/components/admin/sidebar"
import {
  Card,
  Field,
  ImageField,
  ListEditor,
  MediaTile,
  TextArea,
  TextInput,
  Toggle,
  uploadImageFile,
} from "@/components/admin/primitives"
import type { MediaItem, SiteContent, SiteSettings } from "@/lib/content"
import { countEditableStrings } from "@/lib/content"
import { ArrowUpRight, FileEdit, ImagePlus, Languages, MousePointerClick } from "lucide-react"
import { useMemo, useRef, useState } from "react"

type Patch = (path: (string | number)[], value: unknown) => void
type PatchSettings = (path: (string | number)[], value: unknown) => void

function relativeWhen(iso?: string) {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "剛剛"
  if (mins < 60) return `${mins} 分鐘前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  return `${days} 天前`
}

/* ------------------------------- Dashboard ------------------------------- */

export function DashboardView({
  content,
  onNavigate,
}: {
  content: SiteContent
  onNavigate: (k: SectionKey) => void
}) {
  const stats = useMemo(() => {
    const strings = countEditableStrings(content.zh) + countEditableStrings(content.en)
    const buttons =
      2 +
      1 +
      1 +
      1 +
      1 +
      content.zh.pillars.items.length +
      1
    return [
      { label: "已發佈區塊", value: "6", sub: "全部上線中" },
      { label: "可編輯文字", value: String(strings), sub: "涵蓋雙語" },
      { label: "圖片資產", value: String(content.media?.length || 0), sub: "媒體庫" },
      { label: "行動按鈕", value: String(buttons), sub: "已連結 App" },
    ]
  }, [content])

  const activity = (content.activity || []).slice(0, 8)
  const quick: { key: SectionKey; label: string; icon: typeof FileEdit }[] = [
    { key: "hero", label: "編輯主視覺", icon: FileEdit },
    { key: "media", label: "上傳圖片", icon: ImagePlus },
    { key: "navigation", label: "調整按鈕", icon: MousePointerClick },
    { key: "seo", label: "SEO 設定", icon: Languages },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{s.value}</p>
            <p className="mt-1 text-xs text-success">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="最近活動" description="內容變更紀錄。">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">尚未有變更紀錄。儲存內容後會顯示在此。</p>
            ) : (
              <ul className="flex flex-col">
                {activity.map((a, i) => (
                  <li
                    key={`${a.at}-${i}`}
                    className="flex items-start gap-3 border-b border-border py-3 last:border-0 first:pt-0"
                  >
                    <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      AD
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{a.who}</span> {a.what}
                      </p>
                      <p className="text-xs text-muted-foreground">{relativeWhen(a.at) || a.when}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="快速操作">
          <div className="flex flex-col gap-2">
            {quick.map((q) => {
              const Icon = q.icon
              return (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => onNavigate(q.key)}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-muted"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="size-4 text-brand" />
                    {q.label}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* -------------------------------- Branding ------------------------------- */

const SWATCHES = [
  { name: "Brand 主色", cls: "bg-brand", hex: "#2151a1" },
  { name: "Gold 金色", cls: "bg-gold", hex: "#c8912b" },
  { name: "Success 綠色", cls: "bg-success", hex: "#2e8b6f" },
  { name: "Foreground", cls: "bg-foreground", hex: "#1e2532" },
]

export function BrandingEditor({
  settings,
  patchSettings,
}: {
  settings: SiteSettings
  patchSettings: PatchSettings
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card title="品牌 Logo" description="網站與 App 使用的標誌與圖示。">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <div className="grid size-11 place-items-center overflow-hidden rounded-xl bg-brand text-brand-foreground">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={settings.logoUrl || "/icon.svg"} alt="" className="size-full object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">{settings.brandNameZh}</p>
              <p className="text-[11px] text-muted-foreground">{settings.brandNameEn}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField
            src={settings.logoUrl}
            label="主要 Logo"
            ratio="aspect-square"
            mediaId="logo"
            onUploaded={(url) => patchSettings(["logoUrl"], url)}
          />
          <ImageField
            src={settings.iconUrl}
            label="App 圖示"
            ratio="aspect-square"
            mediaId="apple-icon"
            onUploaded={(url) => patchSettings(["iconUrl"], url)}
          />
        </div>
      </Card>

      <Card title="品牌名稱" description="顯示於導覽列與頁尾。">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="中文名稱">
            <TextInput
              value={settings.brandNameZh}
              onChange={(v) => patchSettings(["brandNameZh"], v)}
            />
          </Field>
          <Field label="英文名稱">
            <TextInput
              value={settings.brandNameEn}
              onChange={(v) => patchSettings(["brandNameEn"], v)}
            />
          </Field>
        </div>
        <Field label="App 連結 (所有按鈕指向)" hint="Application URL">
          <TextInput value={settings.appUrl} onChange={(v) => patchSettings(["appUrl"], v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="App Store 連結">
            <TextInput
              value={settings.appStoreUrl}
              onChange={(v) => patchSettings(["appStoreUrl"], v)}
            />
          </Field>
          <Field label="Google Play 連結">
            <TextInput
              value={settings.playStoreUrl}
              onChange={(v) => patchSettings(["playStoreUrl"], v)}
            />
          </Field>
        </div>
      </Card>

      <Card title="品牌色彩" description="全站主題色 (僅供預覽)。">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SWATCHES.map((s) => (
            <div key={s.name} className="rounded-lg border border-border p-3">
              <div className={`h-14 w-full rounded-md ${s.cls}`} />
              <p className="mt-2 text-xs font-medium text-foreground">{s.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{s.hex}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------ Navigation ------------------------------- */

export function NavigationEditor({ d, patch }: { d: any; patch: Patch }) {
  const nav = d.nav
  const navKeys: { key: string; label: string }[] = [
    { key: "features", label: "平台功能" },
    { key: "how", label: "使用流程" },
    { key: "enterprise", label: "企業計劃" },
    { key: "shop", label: "保健產品" },
    { key: "about", label: "關於我們" },
    { key: "openApp", label: "開啟 App 按鈕" },
  ]
  const ctas: { path: (string | number)[]; label: string; value: string }[] = [
    { path: ["hero", "ctaPrimary"], label: "Hero 主要按鈕", value: d.hero.ctaPrimary },
    { path: ["hero", "ctaSecondary"], label: "Hero 次要按鈕", value: d.hero.ctaSecondary },
    { path: ["how", "cta"], label: "使用流程按鈕", value: d.how.cta },
    { path: ["enterprise", "cta"], label: "企業計劃按鈕", value: d.enterprise.cta },
    { path: ["about", "cta"], label: "關於我們按鈕", value: d.about.cta },
    { path: ["download", "cta"], label: "下載區塊按鈕", value: d.download.cta },
    ...d.pillars.items.map((it: any, i: number) => ({
      path: ["pillars", "items", i, "cta"],
      label: `功能「${it.tag}」按鈕`,
      value: it.cta,
    })),
  ]
  return (
    <div className="flex flex-col gap-6">
      <Card title="導覽列項目" description="頂部選單的文字標籤。">
        <div className="grid gap-4 sm:grid-cols-2">
          {navKeys.map((n) => (
            <Field key={n.key} label={n.label}>
              <TextInput value={nav[n.key]} onChange={(v) => patch(["nav", n.key], v)} />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="所有行動按鈕" description="全站按鈕文字，皆連結至 App。">
        <div className="flex flex-col gap-3">
          {ctas.map((c, i) => (
            <div key={i} className="grid items-center gap-2 sm:grid-cols-[220px_1fr]">
              <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
              <TextInput value={c.value} onChange={(v) => patch(c.path, v)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* -------------------------------- Footer --------------------------------- */

export function FooterEditor({ d, patch }: { d: any; patch: Patch }) {
  const f = d.footer
  const linkKeys = Object.keys(f.links)
  return (
    <div className="flex flex-col gap-6">
      <Card title="頁尾文案">
        <Field label="標語">
          <TextInput value={f.tagline} onChange={(v) => patch(["footer", "tagline"], v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="欄目：產品">
            <TextInput value={f.product} onChange={(v) => patch(["footer", "product"], v)} />
          </Field>
          <Field label="欄目：公司">
            <TextInput value={f.company} onChange={(v) => patch(["footer", "company"], v)} />
          </Field>
          <Field label="欄目：條款">
            <TextInput value={f.legal} onChange={(v) => patch(["footer", "legal"], v)} />
          </Field>
        </div>
      </Card>

      <Card title="頁尾連結文字">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {linkKeys.map((k) => (
            <Field key={k} label={k}>
              <TextInput value={f.links[k]} onChange={(v) => patch(["footer", "links", k], v)} />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="免責聲明與版權">
        <Field label="免責聲明">
          <TextArea value={f.disclaimer} rows={3} onChange={(v) => patch(["footer", "disclaimer"], v)} />
        </Field>
        <Field label="版權文字">
          <TextInput value={f.rights} onChange={(v) => patch(["footer", "rights"], v)} />
        </Field>
      </Card>
    </div>
  )
}

/* --------------------------------- Media --------------------------------- */

export function MediaLibrary({
  media,
  onMediaChange,
}: {
  media: MediaItem[]
  onMediaChange: (media: MediaItem[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const upload = async (file: File, replaceId?: string, alt?: string) => {
    setBusy(true)
    setError("")
    try {
      const data = await uploadImageFile(file, { id: replaceId, alt })
      if (Array.isArray(data.media)) {
        onMediaChange(data.media as MediaItem[])
      } else if (data.url) {
        if (replaceId) {
          onMediaChange(
            media.map((m) => (m.id === replaceId ? { ...m, url: data.url, createdAt: new Date().toISOString() } : m)),
          )
        } else {
          onMediaChange([
            {
              id: crypto.randomUUID(),
              url: data.url,
              alt: alt || file.name,
              createdAt: new Date().toISOString(),
            },
            ...media,
          ])
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "上傳失敗")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card
      title="圖片媒體庫"
      description="集中管理所有網站圖片，點擊即可替換。"
      aside={
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          <ImagePlus className="size-3.5" />
          {busy ? "上傳中…" : "上傳圖片"}
        </button>
      }
    >
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((m) => (
          <MediaTile
            key={m.id}
            src={m.url}
            label={m.alt}
            onReplace={(file) => upload(file, m.id, m.alt)}
          />
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (file) upload(file)
          }}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
        >
          <ImagePlus className="size-6" />
          <span className="text-xs font-medium">拖曳或上傳</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
          e.target.value = ""
        }}
      />
    </Card>
  )
}

/* ---------------------------------- SEO ---------------------------------- */

export function SeoEditor({
  settings,
  patchSettings,
}: {
  settings: SiteSettings
  patchSettings: PatchSettings
}) {
  const seo = settings.seo
  return (
    <div className="flex flex-col gap-6">
      <Card title="Meta 資訊" description="搜尋引擎與分享預覽使用的標題與描述。">
        <Field label="網站標題 (Title)">
          <TextInput value={seo.title} onChange={(v) => patchSettings(["seo", "title"], v)} />
        </Field>
        <Field label="網站描述 (Description)">
          <TextArea
            rows={3}
            value={seo.description}
            onChange={(v) => patchSettings(["seo", "description"], v)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="主題色 (Theme Color)">
            <div className="flex items-center gap-2">
              <span
                className="size-9 shrink-0 rounded-lg border border-border"
                style={{ background: seo.themeColor }}
              />
              <TextInput
                value={seo.themeColor}
                onChange={(v) => patchSettings(["seo", "themeColor"], v)}
              />
            </div>
          </Field>
          <Field label="標準網址 (Canonical URL)">
            <TextInput
              value={seo.canonical}
              onChange={(v) => patchSettings(["seo", "canonical"], v)}
            />
          </Field>
        </div>
      </Card>

      <Card title="索引與分享">
        <Toggle
          checked={seo.indexing}
          onChange={(v) => patchSettings(["seo", "indexing"], v)}
          label="允許搜尋引擎索引"
          description="關閉後將加入 noindex 標籤。"
        />
        <div className="h-px bg-border" />
        <Toggle
          checked={seo.ogEnabled}
          onChange={(v) => patchSettings(["seo", "ogEnabled"], v)}
          label="社交分享預覽 (Open Graph)"
          description="於分享連結時顯示縮圖與描述。"
        />
      </Card>

      <Card title="分享預覽圖">
        <ImageField
          src={seo.ogImage}
          label="Open Graph 圖片"
          ratio="aspect-[1200/630]"
          mediaId="og-image"
          onUploaded={(url) => patchSettings(["seo", "ogImage"], url)}
        />
      </Card>
    </div>
  )
}
