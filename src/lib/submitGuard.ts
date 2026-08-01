// フォーム送信の「同期ロック」。React state（setStatus）は再描画まで反映されないため、
// 同一描画（同一tick）内の連続 submit を state だけでは防げない。
// このガードは boolean を同期的に更新するため、useRef に載せて即時ロックに使う。
//
// 使い方（コンポーネント側）:
//   const guard = useRef(createSubmitGuard()).current;
//   if (guard.isLocked()) return;         // 先頭で即時 return（取得はしない）
//   ...入力検証...（検証エラー時は return。ロックは取得しない＝残さない）
//   guard.lock();                         // 外部送信の直前に取得
//   try { ...fetch... } finally { guard.unlock(); }  // 失敗・例外でも解放
export type SubmitGuard = {
  isLocked: () => boolean;
  lock: () => void;
  unlock: () => void;
};

export function createSubmitGuard(): SubmitGuard {
  let locked = false;
  return {
    isLocked: () => locked,
    lock: () => {
      locked = true;
    },
    unlock: () => {
      locked = false;
    },
  };
}
