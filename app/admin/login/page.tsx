import { Suspense } from "react"
import type { Metadata } from "next"
import AdminLoginPage from "./login-client"

export const metadata: Metadata = {
  title: "Admin Login | 壹鍵康",
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
          載入中…
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  )
}
