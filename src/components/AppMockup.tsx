import type { ReactNode } from "react";

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[200px] shrink-0">
      <div className="bg-gray-900 rounded-[40px] border-[5px] border-gray-800 shadow-2xl">
        <div className="flex justify-center pt-3 bg-gray-900">
          <div className="w-16 h-[14px] bg-black rounded-full" />
        </div>
        <div className="h-[400px] overflow-hidden">
          {children}
        </div>
        <div className="flex justify-center py-2 bg-gray-900">
          <div className="w-16 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function HomeScreen() {
  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-[#f5f7fa]">
        <div className="bg-[#0d2545] px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold text-[11px]">宅建学習</p>
            <div className="w-6 h-6 rounded-full bg-white/20" />
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="text-base leading-none">🔥</span>
            <div>
              <p className="text-white/70 text-[8px]">連続学習</p>
              <p className="text-white font-bold text-[13px]">15日目</p>
            </div>
            <p className="ml-auto text-blue-300 text-[8px]">自己ベスト更新中</p>
          </div>
        </div>

        <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <p className="text-gray-400 text-[9px] mb-1.5">今日の学習</p>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-[#0d2545] text-[14px]">12 / 20 問</p>
              <p className="text-blue-600 font-bold text-[11px]">60%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-[5px]">
              <div className="bg-blue-600 rounded-full h-full w-[60%]" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <p className="text-gray-400 text-[9px] mb-1">合格予測スコア</p>
            <div className="flex items-end justify-between">
              <p className="font-bold text-[#0d2545] text-[24px] leading-none">
                68<span className="text-[12px] font-normal text-gray-400">%</span>
              </p>
              <p className="text-green-600 font-semibold text-[9px]">↑ 前週比 +2%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-[5px] mt-2">
              <div className="bg-green-500 rounded-full h-full w-[68%]" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] leading-none">⏰</span>
              <p className="text-amber-700 font-semibold text-[9px]">復習タイミング</p>
            </div>
            <p className="text-gray-600 text-[10px] mt-0.5">3問が忘れる前に復習しましょう</p>
          </div>

          <div className="bg-[#0d2545] rounded-2xl py-3">
            <p className="text-white text-center font-bold text-[11px]">今日の問題を解く →</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ProblemScreen() {
  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-white">
        <div className="bg-[#0d2545] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-bold text-[11px]">問題演習</p>
            <p className="text-blue-200 text-[9px]">宅建業法</p>
          </div>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= 2 ? "bg-blue-400" : "bg-blue-400/30"}`}
              />
            ))}
          </div>
          <p className="text-blue-300 text-[8px]">2 / 5問目</p>
        </div>

        <div className="flex-1 px-4 py-4 flex flex-col">
          <div className="bg-[#f5f7fa] rounded-2xl p-3 mb-4 flex-1">
            <p className="text-gray-400 text-[8px] mb-2">Q.23　宅建業法</p>
            <p className="text-[#0d2545] text-[10px] leading-relaxed">
              宅地建物取引業者Aが行う宅地の売買において、重要事項の説明は取引士が記名した書面を交付して行わなければならない。
            </p>
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-gray-500 text-center font-medium text-[10px]">正しいですか？</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl py-4 text-center">
              <p className="text-green-600 font-bold text-[22px] leading-none">○</p>
              <p className="text-green-600 text-[9px] mt-0.5">正しい</p>
            </div>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 text-center">
              <p className="text-gray-400 font-bold text-[22px] leading-none">×</p>
              <p className="text-gray-400 text-[9px] mt-0.5">誤り</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl py-2.5 text-center">
            <p className="text-gray-500 font-medium text-[10px]">解答を確認する</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function AnalysisScreen() {
  const categories = [
    { name: "権利関係", pct: 72, color: "bg-blue-500" },
    { name: "宅建業法", pct: 88, color: "bg-green-500" },
    { name: "法令制限", pct: 55, color: "bg-amber-500" },
    { name: "税その他", pct: 79, color: "bg-purple-500" },
  ];

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-[#f5f7fa]">
        <div className="bg-[#0d2545] px-4 py-4">
          <p className="text-white font-bold text-[11px]">学習分析</p>
          <p className="text-blue-200 text-[9px] mt-0.5">分野別正答率</p>
        </div>

        <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <p className="text-gray-400 text-[9px] mb-3">分野別正答率</p>
            <div className="space-y-2.5">
              {categories.map(({ name, pct, color }) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#0d2545] font-medium text-[9px]">{name}</p>
                    <p className="text-gray-600 font-bold text-[9px]">{pct}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-[5px]">
                    <div className={`${color} rounded-full h-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d2545] rounded-2xl p-3">
            <p className="text-blue-200 text-[9px]">合格予測率</p>
            <p className="text-white font-bold text-[28px] leading-tight mt-0.5">
              68<span className="text-[14px] font-normal text-blue-300">%</span>
            </p>
            <p className="text-blue-300 text-[9px] mt-0.5">合格ラインまであと 7%</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <p className="text-amber-700 font-semibold text-[9px]">弱点分野</p>
            <p className="text-amber-800 font-bold text-[11px] mt-0.5">法令上の制限 55%</p>
            <p className="text-amber-600 text-[8px] mt-0.5">重点的に復習しましょう</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ReviewScreen() {
  const items = [
    { cat: "宅建業法", title: "重要事項説明書の記載事項", days: "7日前" },
    { cat: "権利関係", title: "解除権の行使と損害賠償", days: "5日前" },
    { cat: "法令制限", title: "建築確認の申請手続き", days: "4日前" },
  ];

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-[#f5f7fa]">
        <div className="bg-[#0d2545] px-4 py-4">
          <p className="text-white font-bold text-[11px]">要復習リスト</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="bg-orange-400 rounded-full px-2 py-0.5 text-white font-bold text-[9px]">3問</span>
            <p className="text-blue-200 text-[9px]">忘却タイミング到来</p>
          </div>
        </div>

        <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
          {items.map(({ cat, title, days }) => (
            <div key={title} className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-[#0d2545]/10 text-[#0d2545] rounded px-1.5 py-0.5 font-medium text-[8px]">
                  {cat}
                </span>
              </div>
              <p className="text-[#0d2545] font-medium text-[10px]">{title}</p>
              <p className="text-gray-400 text-[8px] mt-0.5">最終学習: {days}</p>
            </div>
          ))}

          <div className="bg-[#0d2545] rounded-2xl py-3">
            <p className="text-white text-center font-bold text-[11px]">復習を始める →</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function PredictionScreen() {
  const bars = [50, 55, 58, 62, 63, 65, 68];
  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-[#f5f7fa]">
        <div className="bg-[#0d2545] px-4 py-4">
          <p className="text-white font-bold text-[11px]">合格可能性予測</p>
          <p className="text-blue-200 text-[9px] mt-0.5">学習データから自動計算</p>
        </div>
        <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-400 text-[9px] mb-2">現在の合格可能性</p>
            <div className="flex items-end gap-1 mb-3">
              <p className="text-[#0d2545] font-black text-[38px] leading-none">68</p>
              <p className="text-[#0d2545] text-[16px] font-bold mb-1">%</p>
              <p className="text-green-500 text-[8px] font-semibold mb-2 ml-1">↑ +2%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-[6px] mb-1.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: "68%",
                  background: "linear-gradient(to right, #3b82f6, #22c55e)",
                }}
              />
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400 text-[7px]">0%</p>
              <p className="text-amber-600 font-bold text-[7px]">合格ライン 75%</p>
              <p className="text-gray-400 text-[7px]">100%</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
            <p className="text-blue-700 font-semibold text-[9px]">あと 7% で合格ライン</p>
            <p className="text-blue-600 text-[8px] mt-0.5">法令制限の強化で到達可能</p>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <p className="text-gray-400 text-[9px] mb-2">週間推移</p>
            <div className="flex items-end gap-1 h-10">
              {bars.map((v, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-blue-600" : "bg-blue-200"}`}
                  style={{ height: `${(v / 80) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-gray-400 text-[7px]">6週前</p>
              <p className="text-blue-600 font-bold text-[7px]">今週</p>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function RoadmapScreen() {
  const steps = [
    { label: "権利関係の基礎", done: true, score: "72%" },
    { label: "宅建業法の完成", done: true, score: "88%" },
    { label: "法令制限の強化", done: false, current: true, score: "55%" },
    { label: "税その他の仕上げ", done: false, current: false, score: "" },
    { label: "模試 → 弱点補強", done: false, current: false, score: "" },
  ];

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col bg-[#f5f7fa]">
        <div className="bg-[#0d2545] px-4 py-4">
          <p className="text-white font-bold text-[11px]">学習ロードマップ</p>
          <p className="text-blue-200 text-[9px] mt-0.5">試験日まで 87日</p>
        </div>
        <div className="flex-1 px-3 py-3 space-y-1.5 overflow-hidden">
          {steps.map(({ label, done, current, score }, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                current ? "bg-blue-600" : done ? "bg-white" : "bg-white/60"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold ${
                  done
                    ? "bg-green-400 text-white"
                    : current
                    ? "bg-white/30 border-2 border-white"
                    : "bg-gray-200"
                }`}
              >
                {done && "✓"}
              </div>
              <p
                className={`text-[9px] font-medium flex-1 ${
                  current ? "text-white" : done ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {label}
              </p>
              {score && (
                <p className={`text-[8px] font-bold ${current ? "text-blue-200" : "text-green-500"}`}>
                  {score}
                </p>
              )}
              {current && (
                <span className="bg-white/20 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  今ここ
                </span>
              )}
            </div>
          ))}
          <div className="bg-white rounded-2xl p-3 mt-1">
            <div className="flex justify-between mb-1">
              <p className="text-gray-400 text-[9px]">全体進捗</p>
              <p className="text-[#0d2545] font-bold text-[9px]">43%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-[5px]">
              <div className="bg-blue-600 rounded-full h-full w-[43%]" />
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
