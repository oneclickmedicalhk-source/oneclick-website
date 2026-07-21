import { LanguageProvider } from "@/components/language-provider"
import { SiteHeader } from "@/components/site-header"
import { LandingSections } from "@/components/landing-sections"
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
          <LandingSections />
        </main>
        <SiteFooter />
      </div>
    </LanguageProvider>
  )
}
