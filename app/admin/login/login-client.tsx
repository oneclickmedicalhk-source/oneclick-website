"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/components/logo"

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "登入失敗")
        return
      }
      const next = search.get("next") || "/admin"
      router.replace(next)
      router.refresh()
    } catch {
      setError("無法連線，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <div>
            <h1 className="text-lg font-semibold text-foreground">內容管理登入</h1>
            <p className="mt-1 text-sm text-muted-foreground">請輸入管理員密碼以繼續</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground">密碼</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              placeholder="Admin password"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !password}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-60"
          >
            {loading ? "登入中…" : "登入"}
          </button>
        </form>
      </div>
    </div>
  )
}
