"use client"

import type { LucideIcon } from "lucide-react"
import {
  Building2,
  Info,
  LayoutDashboard,
  LayoutList,
  ListChecks,
  MousePointerClick,
  PanelBottom,
  Search,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react"
import { Logo } from "@/components/logo"

export type SectionKey =
  | "dashboard"
  | "branding"
  | "hero"
  | "pillars"
  | "how"
  | "enterprise"
  | "about"
  | "download"
  | "navigation"
  | "footer"
  | "seo"

type NavItem = { key: SectionKey; label: string; icon: LucideIcon }
type NavGroup = { title: string; items: NavItem[] }

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "總覽",
    items: [
      { key: "dashboard", label: "儀表板", icon: LayoutDashboard },
      { key: "branding", label: "品牌與 Logo", icon: Sparkles },
    ],
  },
  {
    title: "前台內容",
    items: [
      { key: "hero", label: "主視覺 Hero", icon: Smartphone },
      { key: "pillars", label: "平台功能", icon: LayoutList },
      { key: "how", label: "使用流程", icon: ListChecks },
      { key: "enterprise", label: "企業計劃", icon: Building2 },
      { key: "about", label: "關於我們", icon: Info },
      { key: "download", label: "下載區塊", icon: MousePointerClick },
    ],
  },
  {
    title: "全站設定",
    items: [
      { key: "navigation", label: "導覽與按鈕", icon: MousePointerClick },
      { key: "footer", label: "頁尾 Footer", icon: PanelBottom },
      { key: "seo", label: "SEO 與 Meta", icon: Search },
    ],
  },
]

export function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: SectionKey
  onSelect: (key: SectionKey) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉選單"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = active === item.key
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => onSelect(item.key)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="grid size-9 place-items-center overflow-hidden rounded-full bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apple-icon.png" alt="" className="size-full object-cover" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Admin</p>
              <p className="truncate text-xs text-muted-foreground">oneclick.medical.hk</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
