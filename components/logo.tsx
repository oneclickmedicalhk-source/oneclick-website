"use client"

import { Activity } from "lucide-react"

export function Logo({
  showText = true,
  brandZh = "壹鍵康",
  brandEn = "OneClick Wellness",
  logoUrl,
}: {
  showText?: boolean
  brandZh?: string
  brandEn?: string
  logoUrl?: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-brand text-brand-foreground shadow-sm">
        {logoUrl && logoUrl !== "/icon.svg" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="size-full object-cover" />
        ) : (
          <Activity className="size-5" strokeWidth={2.5} aria-hidden="true" />
        )}
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="text-base font-bold text-foreground">{brandZh}</div>
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground">{brandEn}</div>
        </div>
      )}
    </div>
  )
}
