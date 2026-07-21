"use client"

import { Field, TextInput, TextArea, Toggle, ImageField } from "@/components/admin/primitives"
import type { SiteSettings } from "@/lib/content"
import type { EditorPath } from "@/components/admin/editor-provider"

export function BrandingSettings({
  settings,
  patchSettings,
}: {
  settings: SiteSettings
  patchSettings: (path: EditorPath, value: unknown) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        頁面上嘅文字／圖片請直接喺預覽入面撳住改。呢度改品牌名稱同下載連結。
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="中文品牌名">
          <TextInput
            value={settings.brandNameZh}
            onChange={(v) => patchSettings(["brandNameZh"], v)}
          />
        </Field>
        <Field label="英文品牌名">
          <TextInput
            value={settings.brandNameEn}
            onChange={(v) => patchSettings(["brandNameEn"], v)}
          />
        </Field>
      </div>
      <Field label="App 連結">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageField
          src={settings.logoUrl}
          label="Logo"
          ratio="aspect-square"
          mediaId="logo"
          onUploaded={(url) => patchSettings(["logoUrl"], url)}
          onClear={() => patchSettings(["logoUrl"], "/brand/oneclick-logo.png")}
        />
        <ImageField
          src={settings.iconUrl}
          label="Favicon / App Icon"
          ratio="aspect-square"
          mediaId="apple-icon"
          onUploaded={(url) => patchSettings(["iconUrl"], url)}
          onClear={() => patchSettings(["iconUrl"], "/apple-icon.png")}
        />
      </div>
    </div>
  )
}

export function SeoSettings({
  settings,
  patchSettings,
}: {
  settings: SiteSettings
  patchSettings: (path: EditorPath, value: unknown) => void
}) {
  const seo = settings.seo
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        控制搜尋結果標題、描述、索引同社交分享預覽。唔會自動保證排名。
      </p>
      <Field label="網站標題">
        <TextInput value={seo.title} onChange={(v) => patchSettings(["seo", "title"], v)} />
      </Field>
      <Field label="網站描述">
        <TextArea
          rows={3}
          value={seo.description}
          onChange={(v) => patchSettings(["seo", "description"], v)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="主題色">
          <TextInput
            value={seo.themeColor}
            onChange={(v) => patchSettings(["seo", "themeColor"], v)}
          />
        </Field>
        <Field label="Canonical URL">
          <TextInput
            value={seo.canonical}
            onChange={(v) => patchSettings(["seo", "canonical"], v)}
          />
        </Field>
      </div>
      <Toggle
        checked={seo.indexing}
        onChange={(v) => patchSettings(["seo", "indexing"], v)}
        label="允許搜尋引擎索引"
      />
      <Toggle
        checked={seo.ogEnabled}
        onChange={(v) => patchSettings(["seo", "ogEnabled"], v)}
        label="Open Graph 分享預覽"
      />
      <ImageField
        src={seo.ogImage}
        label="OG 圖片"
        ratio="aspect-[1200/630]"
        mediaId="og-image"
        onUploaded={(url) => patchSettings(["seo", "ogImage"], url)}
        onClear={() => patchSettings(["seo", "ogImage"], "/screens/dashboard.jpeg")}
      />
    </div>
  )
}
