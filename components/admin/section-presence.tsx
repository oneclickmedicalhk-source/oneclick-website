"use client"

import { useEffect, useState, type ReactNode } from "react"
import { SECTION_LABELS, type PageSectionId } from "@/lib/content"

const SECTION_DOM: { key: PageSectionId; selector: string }[] = [
  { key: "hero", selector: '[data-page-section="hero"]' },
  { key: "features", selector: '[data-page-section="features"]' },
  { key: "how", selector: '[data-page-section="how"]' },
  { key: "enterprise", selector: '[data-page-section="enterprise"]' },
  { key: "about", selector: '[data-page-section="about"]' },
  { key: "download", selector: '[data-page-section="download"]' },
]

export function useActivePageSection(rootSelector = "#visual-canvas") {
  const [active, setActive] = useState<PageSectionId>("hero")

  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) return

    const nodes = SECTION_DOM.map(({ key, selector }) => ({
      key,
      el: root.querySelector(selector),
    })).filter((n): n is { key: PageSectionId; el: Element } => !!n.el)

    if (nodes.length === 0) return

    const ratios = new Map<PageSectionId, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const match = nodes.find((n) => n.el === entry.target)
          if (!match) continue
          ratios.set(match.key, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best: PageSectionId = "hero"
        let bestRatio = -1
        for (const { key } of nodes) {
          const r = ratios.get(key) ?? 0
          if (r > bestRatio) {
            bestRatio = r
            best = key
          }
        }
        // Prefer the topmost section that still has meaningful presence
        if (bestRatio <= 0) {
          const top = nodes.find(({ el }) => {
            const rect = el.getBoundingClientRect()
            return rect.bottom > 120
          })
          if (top) best = top.key
        }
        setActive(best)
      },
      {
        root: null,
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
        rootMargin: "-15% 0px -45% 0px",
      },
    )

    nodes.forEach(({ el }) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootSelector])

  return active
}

export function SectionPresenceBar({
  active,
  actions,
}: {
  active: PageSectionId
  actions?: ReactNode
}) {
  return (
    <div className="z-30 rounded-xl border border-border bg-background/95 px-4 py-2 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">而家編輯緊</p>
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {SECTION_LABELS[active]}
          </span>
        </div>
        {actions}
      </div>
    </div>
  )
}
