import { test } from "node:test";
import assert from "node:assert/strict";
import { isPreviewDeployment, isProductionDeployment } from "../src/lib/deployEnv";

test("isPreviewDeployment は preview のみ true", () => {
  assert.equal(isPreviewDeployment("preview"), true);
  assert.equal(isPreviewDeployment("production"), false);
  assert.equal(isPreviewDeployment("development"), false);
  assert.equal(isPreviewDeployment(undefined), false);
});

test("isProductionDeployment は production のみ true（preview/dev/local は false）", () => {
  assert.equal(isProductionDeployment("production"), true);
  assert.equal(isProductionDeployment("preview"), false);
  assert.equal(isProductionDeployment("development"), false);
  assert.equal(isProductionDeployment(undefined), false);
});
