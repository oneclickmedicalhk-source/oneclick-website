import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "使用條款 | 壹鍵康 OneClick Wellness",
  robots: { index: true },
}

export default function TermsPage() {
  return (
    <LegalPage title="使用條款">
      <p>最後更新：2026 年 7 月</p>
      <p>
        歡迎使用壹鍵康 OneClick Wellness。使用本網站、App 或相關服務，即表示你同意遵守本使用條款。
      </p>
      <h2 className="text-base font-semibold text-foreground">服務說明</h2>
      <p>
        壹鍵康提供健康問卷、AI 健康報告、體檢預約、企業計劃及保健產品等功能。服務內容可能不時更新，我們會盡力於合理範圍內通知用戶。
      </p>
      <h2 className="text-base font-semibold text-foreground">用戶責任</h2>
      <p>
        你須確保所提供資料真實準確，並妥善保管帳戶。不得利用本服務從事違法、欺詐或損害他人權益的行為。
      </p>
      <h2 className="text-base font-semibold text-foreground">知識產權</h2>
      <p>
        平台上的商標、內容、介面設計及軟件均屬壹健康科技有限公司或其授權方所有，未經許可不得複製或用於商業用途。
      </p>
      <h2 className="text-base font-semibold text-foreground">聯絡</h2>
      <p>如有疑問，請聯絡 oneclick.medical.hk@gmail.com。</p>
    </LegalPage>
  )
}
