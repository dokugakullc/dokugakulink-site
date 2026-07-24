import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "dokugaku link合同会社の特定商取引法に基づく表記ページです。",
  alternates: {
    canonical: "/legal/tokushoho",
  },
};

type LegalItem = {
  label: string;
  value: string;
  isEmail?: boolean;
  isPhone?: boolean;
};

const items: LegalItem[] = [
  { label: "販売事業者", value: "dokugaku link合同会社" },
  { label: "代表者", value: "陣内 智徳" },
  { label: "所在地", value: "〒530-0001\n大阪市北区梅田1-1-3\n大阪駅前第3ビル29階1-1-1号室" },
  { label: "電話番号", value: "06-7652-1304", isPhone: true },
  { label: "メールアドレス", value: "info@dokugakulink.com", isEmail: true },
  { label: "受付時間", value: "平日 10:00〜18:00" },
  { label: "サービス名", value: "ウカレル" },
  {
    label: "販売価格",
    value: "プレミアムプラン：月額580円（税込）\n利用登録日から30日間はすべての機能を無料で利用できます。30日経過後も「今日の15問」および学習履歴の閲覧は無料です。",
  },
  {
    label: "追加手数料",
    value: "インターネット通信料は利用者負担です。",
  },
  {
    label: "支払方法",
    value: "Apple App内課金",
  },
  {
    label: "支払時期",
    value: "プレミアムプランへの加入時および以後の各更新時に、Apple IDへ請求されます。",
  },
  {
    label: "提供時期",
    value: "プレミアムプランの購入手続き完了後、直ちに有料機能を利用できます。",
  },
  {
    label: "自動更新",
    value: "30日間の無料期間終了後にプレミアムプランが自動的に開始されることはなく、料金も発生しません。プレミアムプランは利用者が任意に加入した場合に限り開始し、解約されるまで1か月ごとに自動更新されます。",
  },
  {
    label: "解約方法",
    value: "Apple IDのサブスクリプション設定からいつでも解約できます。次回更新を停止するには、現在の契約期間が終了する24時間前までに自動更新をオフにしてください。",
  },
  {
    label: "返品・返金",
    value: "デジタルコンテンツの性質上、購入後の返品・返金には原則として応じられません。返金の可否および手続きはAppleの定める条件に従います。ただし、法令上認められる場合はこの限りではありません。",
  },
  {
    label: "適格請求書発行事業者登録番号",
    value: "未登録（免税事業者）",
  },
];

export default function TokushohoPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-20 md:py-28">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Legal</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
            特定商取引法に基づく表記
          </h1>
          <p className="text-sm text-gray-500 mt-4">
            特定商取引に関する法律第11条に基づき、以下の事項を表示します。
          </p>
        </div>

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {items.map(({ label, value, isEmail, isPhone }) => (
            <div key={label} className="py-5 sm:grid sm:grid-cols-3 sm:gap-8">
              <dt className="text-sm font-semibold text-[#0d2545] mb-2 sm:mb-0">{label}</dt>
                  <dd className="text-sm text-gray-600 leading-loose whitespace-pre-line sm:col-span-2">
                {isEmail ? (
                  <a
                    href={`mailto:${value}`}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    {value}
                  </a>
                ) : isPhone ? (
                  <a href="tel:06-7652-1304" className="text-blue-700 hover:text-blue-900 transition-colors">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            &larr; ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
