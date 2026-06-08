import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "独学リンク合同会社の会社概要ページです。会社理念・事業方針・所在地・事業内容をご確認いただけます。",
};

const businessItems = [
  "教育・学習支援事業",
  "コンテンツ・コミュニティ事業",
  "不動産情報サービス事業",
  "インターネットサービス事業",
];

export default function CompanyPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#f5f7fa] border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
            Company
          </p>
          <h1 className="text-2xl font-bold text-[#0d2545]">会社概要</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="py-6 pr-8 text-left font-medium text-gray-500 w-40 align-top whitespace-nowrap">
                会社名
              </th>
              <td className="py-6 text-gray-900 leading-loose">
                独学リンク合同会社
                <span className="block text-xs text-gray-400 mt-1 font-normal">
                  Dokugaku Link LLC
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-6 pr-8 text-left font-medium text-gray-500 w-40 align-top whitespace-nowrap">
                所在地
              </th>
              <td className="py-6 text-gray-900 leading-loose">
                〒530-0001<br />
                大阪府大阪市北区梅田1-1-3
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-6 pr-8 text-left font-medium text-gray-500 w-40 align-top whitespace-nowrap">
                事業内容
              </th>
              <td className="py-6 text-gray-900">
                <ul className="space-y-1">
                  {businessItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-6 pr-8 text-left font-medium text-gray-500 w-40 align-top whitespace-nowrap">
                会社理念
              </th>
              <td className="py-6 text-gray-900 leading-loose">
                「独学で学ぶ人が、自らの可能性を広げられる社会をつくる」
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-6 pr-8 text-left font-medium text-gray-500 w-40 align-top whitespace-nowrap">
                事業方針
              </th>
              <td className="py-6 text-gray-900 leading-loose">
                「テクノロジーを活用し、継続的な学習と成長を支援する」
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
