import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "独学リンク合同会社の会社概要ページです。所在地・事業内容をご確認いただけます。",
};

const businessItems = [
  "教育・学習支援事業",
  "コンテンツ・コミュニティ事業",
  "不動産情報サービス事業",
  "インターネットサービス事業",
];

const companyRows = [
  {
    label: "会社名",
    content: (
      <>
        独学リンク合同会社
        <span className="block text-xs text-gray-400 mt-1 font-normal">Dokugaku Link LLC</span>
      </>
    ),
  },
  {
    label: "所在地",
    content: (
      <>
        〒530-0001<br />
        大阪府大阪市北区梅田1-1-3
      </>
    ),
  },
  {
    label: "事業内容",
    content: (
      <ul className="space-y-1">
        {businessItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  },
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
            {companyRows.map((row) => (
              <tr key={row.label} className="border-b border-gray-200">
                <th className="py-6 pr-8 text-left font-medium text-gray-500 w-40 align-top whitespace-nowrap">
                  {row.label}
                </th>
                <td className="py-6 text-gray-900 leading-loose">{row.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
