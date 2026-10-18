import { INKAN_SERVICE } from "@/lib/webServices";

/** 「電子印鑑作るさん」の紹介カード（外部サイトへのリンク付き）。 */
export default function InkanServiceCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">公開中</span>
      <p className="text-lg font-bold text-[#0d2545] mt-4 mb-1">{INKAN_SERVICE.name}</p>
      <p className="text-sm font-medium text-[#0d2545] mb-3">{INKAN_SERVICE.tagline}</p>
      {!compact && <p className="text-sm text-gray-600 leading-loose mb-4">{INKAN_SERVICE.description}</p>}
      <ul className="flex flex-wrap gap-2 mb-5">
        {INKAN_SERVICE.features.map((f) => (
          <li key={f} className="text-xs px-3 py-1 border border-gray-200 rounded-full text-gray-600">
            {f}
          </li>
        ))}
      </ul>
      <a
        href={INKAN_SERVICE.url}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
      >
        電子印鑑作るさんを開く &rarr;
      </a>
    </div>
  );
}
