import test from "node:test";
import assert from "node:assert/strict";
import { shouldOfferBonusRound } from "../src/progression.js";

test("offers a bonus only after crossing the previous best and before using the run bonus", () => {
  assert.equal(shouldOfferBonusRound(false, false), false);
  assert.equal(shouldOfferBonusRound(true, false), true);
  assert.equal(shouldOfferBonusRound(true, true), false);
});
