"use client"

import type { JSX } from "react"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Enterprise } from "@/components/enterprise"
import { About } from "@/components/about"
import { DownloadCta } from "@/components/download-cta"
import { useLanguage } from "@/components/language-provider"
import {
  DEFAULT_SECTION_ORDER,
  normalizeSectionOrder,
  type PageSectionId,
} from "@/lib/content"

const SECTION_COMPONENTS: Record<PageSectionId, () => JSX.Element> = {
  hero: Hero,
  features: Features,
  how: HowItWorks,
  enterprise: Enterprise,
  about: About,
  download: DownloadCta,
}

export function LandingSections() {
  const { settings } = useLanguage()
  const order = normalizeSectionOrder(settings.sectionOrder || DEFAULT_SECTION_ORDER)

  return (
    <>
      {order.map((id) => {
        const Comp = SECTION_COMPONENTS[id]
        return <Comp key={id} />
      })}
    </>
  )
}
