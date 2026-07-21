import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "私隱政策 | 壹鍵康 OneClick Wellness",
  robots: { index: true },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="私隱政策">
      <p>最後更新：2026 年 7 月</p>
      <p>
        壹健康科技有限公司（「本公司」、「我們」）營運壹鍵康 OneClick Wellness 平台。本私隱政策說明我們如何收集、使用及保護你的個人資料。
      </p>
      <h2 className="text-base font-semibold text-foreground">我們收集的資料</h2>
      <p>
        當你使用我們的服務時，我們可能收集你主動提供的資料（例如姓名、聯絡方式、健康問卷回答），以及使用服務時產生的技術資料（例如裝置類型、瀏覽器、IP 位址）。
      </p>
      <h2 className="text-base font-semibold text-foreground">資料用途</h2>
      <p>
        我們使用你的資料以提供 AI 健康分析、體檢預約、產品推薦及客戶支援，並改善平台體驗。我們不會在未經同意下將你的個人健康資料出售予第三方。
      </p>
      <h2 className="text-base font-semibold text-foreground">資料安全與保留</h2>
      <p>
        我們採取合理的技術及組織措施保護資料。資料只會在提供服務所需期間內保留，或按適用法律要求保留。
      </p>
      <h2 className="text-base font-semibold text-foreground">聯絡我們</h2>
      <p>
        如對本政策有任何疑問，請透過 App 內「聯絡我們」或電郵 oneclick.medical.hk@gmail.com 與我們聯絡。
      </p>
    </LegalPage>
  )
}
