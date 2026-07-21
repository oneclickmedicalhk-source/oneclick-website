import Link from "next/link"
import { Logo } from "@/components/logo"

export function LegalPage({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-brand">
            返回首頁
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <div className="prose-legal mt-8 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </main>
    </div>
  )
}
