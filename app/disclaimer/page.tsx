import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "免責聲明 | 壹鍵康 OneClick Wellness",
  robots: { index: true },
}

export default function DisclaimerPage() {
  return (
    <LegalPage title="免責聲明">
      <p>最後更新：2026 年 7 月</p>
      <p>
        壹鍵康 OneClick Wellness 平台所提供的資訊、AI 分析結果及建議僅供健康管理參考，不能代替專業醫療診斷、治療或建議。
      </p>
      <h2 className="text-base font-semibold text-foreground">非醫療服務</h2>
      <p>
        如你有身體不適、急症或任何健康疑慮，請立即諮詢合資格醫護人員或前往急症室。請勿僅依賴本平台內容作出醫療決定。
      </p>
      <h2 className="text-base font-semibold text-foreground">準確性</h2>
      <p>
        我們致力確保資訊準確，惟不保證所有內容完整、即時或適用於你的個別情況。第三方體檢中心或產品供應商的服務條款另行適用。
      </p>
      <h2 className="text-base font-semibold text-foreground">責任限制</h2>
      <p>
        在法律允許的最大範圍內，壹健康科技有限公司對因使用或無法使用本平台而產生的任何直接或間接損失不承擔責任。
      </p>
    </LegalPage>
  )
}
