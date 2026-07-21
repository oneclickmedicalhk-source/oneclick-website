"use client"

import { Card, Field, ImageField, ListEditor, TextArea, TextInput } from "@/components/admin/primitives"
import type { SiteSettings } from "@/lib/content"

type Patch = (path: (string | number)[], value: unknown) => void
type PatchSettings = (path: (string | number)[], value: unknown) => void

/* --------------------------------- Hero ---------------------------------- */

export function HeroEditor({
  d,
  patch,
  settings,
  patchSettings,
}: {
  d: any
  patch: Patch
  settings: SiteSettings
  patchSettings: PatchSettings
}) {
  const h = d.hero
  return (
    <div className="flex flex-col gap-6">
      <Card title="標題與文案" description="主視覺區的標題、描述與徽章文字。">
        <Field label="徽章文字 (Badge)">
          <TextInput value={h.badge} onChange={(v) => patch(["hero", "badge"], v)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="標題第一行">
            <TextInput value={h.titleA} onChange={(v) => patch(["hero", "titleA"], v)} />
          </Field>
          <Field label="標題第二行 (強調)">
            <TextInput value={h.titleB} onChange={(v) => patch(["hero", "titleB"], v)} />
          </Field>
        </div>
        <Field label="描述文字">
          <TextArea value={h.desc} rows={4} onChange={(v) => patch(["hero", "desc"], v)} />
        </Field>
      </Card>

      <Card title="按鈕文字" description="主視覺的行動按鈕標籤。">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="主要按鈕">
            <TextInput value={h.ctaPrimary} onChange={(v) => patch(["hero", "ctaPrimary"], v)} />
          </Field>
          <Field label="次要按鈕">
            <TextInput value={h.ctaSecondary} onChange={(v) => patch(["hero", "ctaSecondary"], v)} />
          </Field>
        </div>
      </Card>

      <Card title="數據亮點" description="Hero 底部的三組統計數字。">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col gap-3 rounded-lg border border-border p-3">
              <Field label={`項目 ${n} 標籤`}>
                <TextInput value={h[`stat${n}`]} onChange={(v) => patch(["hero", `stat${n}`], v)} />
              </Field>
              <Field label={`項目 ${n} 數值`}>
                <TextInput value={h[`stat${n}v`]} onChange={(v) => patch(["hero", `stat${n}v`], v)} />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      <Card title="主視覺圖片" description="Hero 展示的手機截圖。">
        <ImageField
          src={settings.images.heroPrimary}
          label="主畫面截圖"
          mediaId="dashboard"
          onUploaded={(url) => patchSettings(["images", "heroPrimary"], url)}
        />
        <ImageField
          src={settings.images.heroSecondary}
          label="AI 報告截圖"
          mediaId="ai-report"
          onUploaded={(url) => patchSettings(["images", "heroSecondary"], url)}
        />
      </Card>
    </div>
  )
}

/* -------------------------------- Pillars -------------------------------- */

export function PillarsEditor({
  d,
  patch,
  settings,
  patchSettings,
}: {
  d: any
  patch: Patch
  settings: SiteSettings
  patchSettings: PatchSettings
}) {
  const p = d.pillars
  const screens = settings.images.pillars
  return (
    <div className="flex flex-col gap-6">
      <Card title="區塊標題">
        <Field label="主標題">
          <TextInput value={p.title} onChange={(v) => patch(["pillars", "title"], v)} />
        </Field>
        <Field label="副標題">
          <TextArea value={p.subtitle} onChange={(v) => patch(["pillars", "subtitle"], v)} />
        </Field>
      </Card>

      {p.items.map((item: any, i: number) => (
        <Card key={i} title={`功能 ${i + 1}：${item.title}`} description="每個功能支柱的內容與行動按鈕。">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="標籤 (Tag)">
              <TextInput value={item.tag} onChange={(v) => patch(["pillars", "items", i, "tag"], v)} />
            </Field>
            <Field label="按鈕文字 (CTA)">
              <TextInput value={item.cta} onChange={(v) => patch(["pillars", "items", i, "cta"], v)} />
            </Field>
          </div>
          <Field label="標題">
            <TextInput value={item.title} onChange={(v) => patch(["pillars", "items", i, "title"], v)} />
          </Field>
          <Field label="描述">
            <TextArea value={item.desc} onChange={(v) => patch(["pillars", "items", i, "desc"], v)} />
          </Field>
          <Field label="重點列表">
            <ListEditor
              items={item.points}
              onChange={(items) => patch(["pillars", "items", i, "points"], items)}
              addLabel="新增重點"
            />
          </Field>
          <ImageField
            src={screens[i] || "/placeholder.svg"}
            label="功能截圖"
            mediaId={`pillar-${i}`}
            onUploaded={(url) => {
              const next = [...screens]
              next[i] = url
              patchSettings(["images", "pillars"], next)
            }}
          />
        </Card>
      ))}
    </div>
  )
}

/* ------------------------------ How it works ----------------------------- */

export function HowEditor({ d, patch }: { d: any; patch: Patch }) {
  const h = d.how
  return (
    <div className="flex flex-col gap-6">
      <Card title="區塊標題">
        <Field label="主標題">
          <TextInput value={h.title} onChange={(v) => patch(["how", "title"], v)} />
        </Field>
        <Field label="副標題">
          <TextInput value={h.subtitle} onChange={(v) => patch(["how", "subtitle"], v)} />
        </Field>
        <Field label="按鈕文字 (CTA)">
          <TextInput value={h.cta} onChange={(v) => patch(["how", "cta"], v)} />
        </Field>
      </Card>

      <Card title="步驟" description="四步流程說明。">
        <div className="grid gap-4 sm:grid-cols-2">
          {h.steps.map((s: any, i: number) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <span className="grid size-7 place-items-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                {i + 1}
              </span>
              <Field label="標題">
                <TextInput value={s.t} onChange={(v) => patch(["how", "steps", i, "t"], v)} />
              </Field>
              <Field label="說明">
                <TextArea value={s.d} rows={2} onChange={(v) => patch(["how", "steps", i, "d"], v)} />
              </Field>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------ Enterprise ------------------------------- */

export function EnterpriseEditor({
  d,
  patch,
  settings,
  patchSettings,
}: {
  d: any
  patch: Patch
  settings: SiteSettings
  patchSettings: PatchSettings
}) {
  const e = d.enterprise
  return (
    <div className="flex flex-col gap-6">
      <Card title="企業計劃內容">
        <Field label="徽章文字">
          <TextInput value={e.badge} onChange={(v) => patch(["enterprise", "badge"], v)} />
        </Field>
        <Field label="標題">
          <TextInput value={e.title} onChange={(v) => patch(["enterprise", "title"], v)} />
        </Field>
        <Field label="描述">
          <TextArea value={e.desc} rows={4} onChange={(v) => patch(["enterprise", "desc"], v)} />
        </Field>
        <Field label="按鈕文字 (CTA)">
          <TextInput value={e.cta} onChange={(v) => patch(["enterprise", "cta"], v)} />
        </Field>
        <Field label="重點列表">
          <ListEditor items={e.points} onChange={(items) => patch(["enterprise", "points"], items)} addLabel="新增重點" />
        </Field>
      </Card>
      <Card title="區塊圖片">
        <ImageField
          src={settings.images.enterprise}
          label="企業方案截圖"
          mediaId="enterprise"
          onUploaded={(url) => patchSettings(["images", "enterprise"], url)}
        />
      </Card>
    </div>
  )
}

/* --------------------------------- About --------------------------------- */

export function AboutEditor({ d, patch }: { d: any; patch: Patch }) {
  const a = d.about
  return (
    <div className="flex flex-col gap-6">
      <Card title="關於我們內容">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="徽章文字">
            <TextInput value={a.badge} onChange={(v) => patch(["about", "badge"], v)} />
          </Field>
          <Field label="公司名稱">
            <TextInput value={a.company} onChange={(v) => patch(["about", "company"], v)} />
          </Field>
        </div>
        <Field label="標題">
          <TextInput value={a.title} onChange={(v) => patch(["about", "title"], v)} />
        </Field>
        <Field label="描述">
          <TextArea value={a.desc} rows={4} onChange={(v) => patch(["about", "desc"], v)} />
        </Field>
        <Field label="按鈕文字 (CTA)">
          <TextInput value={a.cta} onChange={(v) => patch(["about", "cta"], v)} />
        </Field>
      </Card>

      <Card title="核心價值" description="三項品牌價值。">
        <div className="grid gap-4 sm:grid-cols-3">
          {a.values.map((val: any, i: number) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <Field label="標題">
                <TextInput value={val.t} onChange={(v) => patch(["about", "values", i, "t"], v)} />
              </Field>
              <Field label="說明">
                <TextArea value={val.d} rows={3} onChange={(v) => patch(["about", "values", i, "d"], v)} />
              </Field>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* -------------------------------- Download ------------------------------- */

export function DownloadEditor({ d, patch }: { d: any; patch: Patch }) {
  const dl = d.download
  return (
    <Card title="下載區塊" description="頁尾上方的行動呼籲區。">
      <Field label="標題">
        <TextInput value={dl.title} onChange={(v) => patch(["download", "title"], v)} />
      </Field>
      <Field label="描述">
        <TextArea value={dl.desc} onChange={(v) => patch(["download", "desc"], v)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="按鈕文字 (CTA)">
          <TextInput value={dl.cta} onChange={(v) => patch(["download", "cta"], v)} />
        </Field>
        <Field label="附註文字">
          <TextInput value={dl.note} onChange={(v) => patch(["download", "note"], v)} />
        </Field>
      </div>
    </Card>
  )
}
