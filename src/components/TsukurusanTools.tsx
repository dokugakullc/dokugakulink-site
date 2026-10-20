import { TSUKURUSAN_SERIES_URL, TSUKURUSAN_TOOLS } from "@/lib/webServices";

/**
 * 無料ツール「作るさんシリーズ」の3ツールを同じ扱いで並べる。
 * 自社サイトどうしのリンクなので nofollow は付けない（新しいタブ＋noopener）。
 * columns: 横に並べる最大の列数（狭い欄では 1）。
 */
export default function TsukurusanTools({ columns = 3 }: { columns?: 1 | 3 }) {
  const grid = columns === 3 ? "grid grid-cols-1 md:grid-cols-3 gap-5" : "grid grid-cols-1 gap-4";
  return (
    <div>
      <ul className={grid}>
        {TSUKURUSAN_TOOLS.map((tool) => (
          <li key={tool.url} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              {/* 外部サイトのロゴ（SVG）。next/image の外部画像設定を増やさないため img を使う。 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tool.logo} alt={tool.name} width={36} height={36} loading="lazy" className="w-9 h-9 shrink-0" />
              <p className="text-base font-bold text-[#0d2545]">{tool.name}</p>
            </div>
            <p className="text-sm text-gray-600 leading-loose mb-4">{tool.description}</p>
            <ul className="flex flex-wrap gap-2 mb-5">
              {tool.features.map((f) => (
                <li key={f} className="text-xs px-3 py-1 border border-gray-200 rounded-full text-gray-600">
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener"
              className="mt-auto inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
            >
              {tool.name}を開く &rarr;
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm">
        <a
          href={TSUKURUSAN_SERIES_URL}
          target="_blank"
          rel="noopener"
          className="font-medium text-blue-700 hover:text-blue-900 transition-colors"
        >
          作るさんシリーズの一覧を見る &rarr;
        </a>
      </p>
    </div>
  );
}
