// 多重送信の同期ロックのテスト。コンポーネントはこの guard を useRef に載せて使う。
import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubmitGuard } from "../src/lib/submitGuard";

test("初期状態は未ロック", () => {
  const g = createSubmitGuard();
  assert.equal(g.isLocked(), false);
});

test("同一tickの2回目 submit は即時ブロック（fetch は1回相当）", () => {
  const g = createSubmitGuard();
  let fetchCount = 0;
  // コンポーネントの handleSubmit と同じ順序を模す
  const submit = () => {
    if (g.isLocked()) return; // 先頭ガード
    // 検証OK想定
    g.lock(); // 送信直前に取得
    fetchCount++; // ここが実際の外部送信
    // await は張らず、同期的に連続呼び出しされる状況を再現
  };
  submit();
  submit(); // 同一tickの2回目
  assert.equal(fetchCount, 1);
});

test("失敗後は unlock され再送できる", () => {
  const g = createSubmitGuard();
  let fetchCount = 0;
  const submit = (fail: boolean) => {
    if (g.isLocked()) return;
    g.lock();
    try {
      fetchCount++;
      if (fail) throw new Error("boom");
    } catch {
      /* エラー表示 */
    } finally {
      g.unlock();
    }
  };
  submit(true); // 1回目失敗
  assert.equal(g.isLocked(), false);
  submit(false); // 再送できる
  assert.equal(fetchCount, 2);
});

test("入力検証エラーはロックを残さない（後で修正して送信できる）", () => {
  const g = createSubmitGuard();
  let fetchCount = 0;
  const submit = (valid: boolean) => {
    if (g.isLocked()) return;
    if (!valid) return; // 検証エラー: lock 前に return
    g.lock();
    try {
      fetchCount++;
    } finally {
      g.unlock();
    }
  };
  submit(false); // 検証エラー
  assert.equal(g.isLocked(), false);
  submit(true); // 修正後に送信
  assert.equal(fetchCount, 1);
});

test("送信中（未 unlock）は2回目がブロックされ、submissionId 生成も1回だけ", () => {
  const g = createSubmitGuard();
  let idCount = 0;
  const makeId = () => `id${++idCount}`;
  const submit = () => {
    if (g.isLocked()) return;
    g.lock(); // まだ unlock しない＝送信中
    makeId(); // submissionId 生成はロック後に1回
  };
  submit();
  submit(); // 送信中の2回目
  assert.equal(idCount, 1);
});
