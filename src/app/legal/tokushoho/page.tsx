import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | dokugaku link合同会社",
  description: "dokugaku link合同会社の特定商取引法に基づく表記ページです。",
};

const items = [
  { label: "販売事業者", value: "dokugaku link合同会社" },
  { label: "所在地", value: "〒530-0001 大阪府大阪市北区梅田1-1-3" },
  { label: "メールアドレス", value: "info@dokugakulink.com", isEmail: true },
  { label: "サービス名", value: "ウカレル（仮） / 宅建学習支援アプリ" },
  {
    label: "販売価格",
    value: "現在β版につき無料でご提供しています。正式版リリース時の価格は、決定次第本サービス上に表示します。",
  },
  {
    label: "追加手数料",
    value: "本サービスの利用に際して発生するインターネット通信料は、利用者のご負担となります。",
  },
  {
    label: "お支払い方法",
    value: "正式版のご提供開始時に、対応する決済方法を表示します。",
  },
  {
    label: "サービス提供時期",
    value: "β版は準備が整い次第、登録いただいたメールアドレスへご案内します。",
  },
  {
    label: "キャンセル・返金",
    value: "現在のβ版登録は無料のため、料金は一切発生しません。正式版移行後のキャンセルポリシーは、リリース時に別途表示します。",
  },
  {
    label: "動作環境",
    value: "iOS（iPhone）・Android に対応予定です。",
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
          {items.map(({ label, value, isEmail }) => (
            <div key={label} className="py-5 sm:grid sm:grid-cols-3 sm:gap-8">
              <dt className="text-sm font-semibold text-[#0d2545] mb-2 sm:mb-0">{label}</dt>
              <dd className="text-sm text-gray-600 leading-loose sm:col-span-2">
                {isEmail ? (
                  <a
                    href={`mailto:${value}`}
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                  >
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
