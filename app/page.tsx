import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Enterprise } from "@/components/enterprise"
import { About } from "@/components/about"
import { DownloadCta } from "@/components/download-cta"
import { SiteFooter } from "@/components/site-footer"
import { getSiteContent } from "@/lib/site-store"
import { createDefaultContent } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function Page() {
  let initialContent = createDefaultContent()
  try {
    initialContent = await getSiteContent()
  } catch (e) {
    console.error("Failed to load site content", e)
  }

  return (
    <LanguageProvider initialContent={initialContent}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Hero />
          <Features />
          <HowItWorks />
          <Enterprise />
          <About />
          <DownloadCta />
        </main>
        <SiteFooter />
      </div>
    </LanguageProvider>
  )
}
