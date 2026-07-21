"use client"

export function Logo({
  showText = false,
  className = "",
  logoUrl = "/brand/oneclick-logo.png",
}: {
  showText?: boolean
  brandZh?: string
  brandEn?: string
  logoUrl?: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl || "/brand/oneclick-logo.png"}
        alt="OneClick Wellness"
        className="h-9 w-auto max-w-[160px] object-contain object-left sm:h-10 sm:max-w-[180px]"
      />
      {showText ? null : null}
    </div>
  )
}
