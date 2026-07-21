import { createDefaultContent } from "@/lib/content"
import { getSiteContent } from "@/lib/site-store"

export async function JsonLd() {
  let content = createDefaultContent()
  try {
    content = await getSiteContent()
  } catch {
    /* defaults */
  }

  const { settings } = content
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: settings.brandNameZh,
        alternateName: settings.brandNameEn,
        url: settings.seo.canonical || "https://oneclick.hk",
        logo: settings.logoUrl,
        sameAs: [settings.appUrl, settings.playStoreUrl, settings.appStoreUrl].filter(Boolean),
      },
      {
        "@type": "WebSite",
        name: settings.brandNameZh,
        url: settings.seo.canonical || "https://oneclick.hk",
        description: settings.seo.description,
        inLanguage: ["zh-Hant", "en"],
      },
      {
        "@type": "SoftwareApplication",
        name: "OneClick Wellness",
        applicationCategory: "HealthApplication",
        operatingSystem: "iOS, Android, Web",
        url: settings.appUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "HKD",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
