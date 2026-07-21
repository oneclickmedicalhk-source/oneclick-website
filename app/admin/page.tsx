import type { Metadata } from "next"
import { AdminApp } from "@/components/admin/admin-app"

export const metadata: Metadata = {
  title: "內容管理後台 | 壹鍵康 OneClick Wellness",
  description: "OneClick Wellness 網站內容管理系統",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminApp />
}
