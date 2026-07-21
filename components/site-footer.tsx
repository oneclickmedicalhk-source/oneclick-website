"use client"

import { Logo } from "@/components/logo"
import { useLanguage } from "@/components/language-provider"
import { handleAnchorClick } from "@/lib/scroll"
import { EditableText } from "@/components/admin/editable-text"
import { EditableImage } from "@/components/admin/editable-image"
import { useEditor } from "@/components/admin/editor-provider"

export function SiteFooter() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const year = new Date().getFullYear()
  const appUrl = settings.appUrl

  const cols = [
    {
      titleKey: "product" as const,
      title: t.footer.product,
      links: [
        { labelKey: "features", label: t.footer.links.features, href: "#features", external: false },
        { labelKey: "enterprise", label: t.footer.links.enterprise, href: "#enterprise", external: false },
        { labelKey: "shop", label: t.footer.links.shop, href: "#shop", external: false },
      ],
    },
    {
      titleKey: "company" as const,
      title: t.footer.company,
      links: [
        { labelKey: "about", label: t.footer.links.about, href: "#about", external: false },
        { labelKey: "contact", label: t.footer.links.contact, href: appUrl, external: true },
        { labelKey: "careers", label: t.footer.links.careers, href: appUrl, external: true },
      ],
    },
    {
      titleKey: "legal" as const,
      title: t.footer.legal,
      links: [
        { labelKey: "privacy", label: t.footer.links.privacy, href: "/privacy", external: false },
        { labelKey: "terms", label: t.footer.links.terms, href: "/terms", external: false },
        { labelKey: "disclaimer", label: t.footer.links.disclaimer, href: "/disclaimer", external: false },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <EditableImage path={["logoUrl"]} src={settings.logoUrl} mediaId="logo" label="更換 Logo">
              <Logo logoUrl={settings.logoUrl} />
            </EditableImage>
            <EditableText
              path={["footer", "tagline"]}
              value={t.footer.tagline}
              as="p"
              className="max-w-xs text-sm leading-relaxed text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              OneClick HealthTech Limited
              <br />
              壹健康科技有限公司
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.titleKey} className="flex flex-col gap-3">
              <EditableText
                path={["footer", col.titleKey]}
                value={col.title}
                as="h3"
                className="text-sm font-bold text-foreground"
              />
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.labelKey}>
                    <a
                      href={editor && l.external ? undefined : l.href}
                      {...(l.href.startsWith("#")
                        ? {
                            onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
                              handleAnchorClick(e, l.href),
                          }
                        : editor && l.external
                          ? {
                              onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
                                e.preventDefault(),
                            }
                          : l.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : editor
                              ? {
                                  onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
                                    e.preventDefault(),
                                }
                              : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      <EditableText path={["footer", "links", l.labelKey]} value={l.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <EditableText
            path={["footer", "disclaimer"]}
            value={t.footer.disclaimer}
            as="p"
            multiline
            className="text-xs leading-relaxed text-muted-foreground"
          />
          <p className="mt-4 text-xs text-muted-foreground">
            © {year} OneClick HealthTech Limited.{" "}
            <EditableText path={["footer", "rights"]} value={t.footer.rights} />
          </p>
        </div>
      </div>
    </footer>
  )
}
