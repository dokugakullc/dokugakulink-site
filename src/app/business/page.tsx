import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "事業内容",
  description:
    "独学リンク合同会社の事業内容の詳細ページです。教育・学習支援、コンテンツ・コミュニティ、不動産情報サービス、インターネットサービスの4事業を展開しています。",
};

const businesses = [
  {
    number: "01",
    title: "教育・学習支援事業",
    paragraphs: [
      "資格取得やスキル向上を目指す方に向けた学習支援サービスの企画、開発、運営を行っています。",
      "独学で学ぶ方々を対象に、効率的かつ継続しやすい学習環境の提供を目指しています。",
    ],
  },
  {
    number: "02",
    title: "コンテンツ・コミュニティ事業",
    paragraphs: [
      "学習コンテンツの企画・制作・提供のほか、イベントやコミュニティ運営を通じて学習者同士の交流や成長を支援します。",
    ],
  },
  {
    number: "03",
    title: "不動産情報サービス事業",
    paragraphs: [
      "不動産に関する情報提供、調査、分析およびコンサルティング業務を行っています。",
      "市場データや実務経験を活用し、利用者に有益な情報提供を行います。",
    ],
  },
  {
    number: "04",
    title: "インターネットサービス事業",
    paragraphs: [
      "Webサービスの企画・開発・運営、広告事業、アフィリエイト事業およびシステム開発を行っています。",
      "テクノロジーを活用し、ユーザーの課題解決につながるサービスの提供を目指しています。",
    ],
  },
];

export default function BusinessPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#f5f7fa] border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
            Business
          </p>
          <h1 className="text-2xl font-bold text-[#0d2545]">事業内容</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="divide-y divide-gray-100">
          {businesses.map((b) => (
            <div key={b.number} className="py-12 first:pt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <div className="md:col-span-1">
                  <p className="text-xs font-mono text-gray-400 mb-2">{b.number}</p>
                  <h2 className="text-lg font-bold text-[#0d2545] leading-snug">{b.title}</h2>
                </div>
                <div className="md:col-span-3 border-l border-[#1e5799] pl-8 space-y-3">
                  {b.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-loose">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
