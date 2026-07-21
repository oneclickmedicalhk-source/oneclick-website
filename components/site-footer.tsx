"use client"

import { Logo } from "@/components/logo"
import { useLanguage } from "@/components/language-provider"
import { handleAnchorClick } from "@/lib/scroll"

export function SiteFooter() {
  const { t, settings } = useLanguage()
  const year = new Date().getFullYear()
  const appUrl = settings.appUrl

  const cols = [
    {
      title: t.footer.product,
      links: [
        { label: t.footer.links.features, href: "#features", external: false },
        { label: t.footer.links.enterprise, href: "#enterprise", external: false },
        { label: t.footer.links.shop, href: "#shop", external: false },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.links.about, href: "#about", external: false },
        { label: t.footer.links.contact, href: appUrl, external: true },
        { label: t.footer.links.careers, href: appUrl, external: true },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.links.privacy, href: "/privacy", external: false },
        { label: t.footer.links.terms, href: "/terms", external: false },
        { label: t.footer.links.disclaimer, href: "/disclaimer", external: false },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo
              brandZh={settings.brandNameZh}
              brandEn={settings.brandNameEn}
              logoUrl={settings.logoUrl}
            />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <p className="text-xs text-muted-foreground">
              OneClick HealthTech Limited
              <br />
              壹健康科技有限公司
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : l.href.startsWith("#")
                          ? { onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleAnchorClick(e, l.href) }
                          : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">{t.footer.disclaimer}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {year} OneClick HealthTech Limited. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
