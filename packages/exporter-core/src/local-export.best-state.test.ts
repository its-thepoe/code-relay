import test from "node:test";
import assert from "node:assert/strict";
import { shouldResetToBestAttempt } from "./local-export.js";

test("shouldResetToBestAttempt flags attempts that materially reduce best overall fidelity", () => {
  assert.equal(
    shouldResetToBestAttempt({
      targetFidelity: 0.92,
      best: {
        desktop: 92,
        laptop: 90,
        tablet: 88,
        mobile: 86,
        overall: 89,
        layout: 87,
        typography: 91,
        color: 90,
        assets: 95,
        motion: 70,
        nodeMatch: 82,
      },
      current: {
        desktop: 90,
        laptop: 88,
        tablet: 84,
        mobile: 80,
        overall: 86,
        layout: 82,
        typography: 89,
        color: 88,
        assets: 95,
        motion: 66,
        nodeMatch: 80,
      },
    }),
    true,
  );
});

test("shouldResetToBestAttempt keeps slightly weaker branches when they do not materially regress weak categories", () => {
  assert.equal(
    shouldResetToBestAttempt({
      targetFidelity: 0.92,
      best: {
        desktop: 92,
        laptop: 90,
        tablet: 88,
        mobile: 86,
        overall: 89,
        layout: 87,
        typography: 91,
        color: 90,
        assets: 95,
        motion: 70,
        nodeMatch: 82,
      },
      current: {
        desktop: 92,
        laptop: 90,
        tablet: 88,
        mobile: 86,
        overall: 88.4,
        layout: 86.8,
        typography: 90.5,
        color: 89.7,
        assets: 95,
        motion: 69.4,
        nodeMatch: 81.7,
      },
    }),
    false,
  );
});

test("shouldResetToBestAttempt flags regressions in weak categories even when overall drop is small", () => {
  assert.equal(
    shouldResetToBestAttempt({
      targetFidelity: 92,
      best: {
        desktop: 93,
        laptop: 91,
        tablet: 88,
        mobile: 86,
        overall: 90.4,
        layout: 89,
        typography: 91,
        color: 90,
        assets: 96,
        motion: 74,
        nodeMatch: 85,
      },
      current: {
        desktop: 93,
        laptop: 91,
        tablet: 88,
        mobile: 83.8,
        overall: 89.9,
        layout: 88.6,
        typography: 90.7,
        color: 89.8,
        assets: 96,
        motion: 73.5,
        nodeMatch: 84.9,
      },
    }),
    true,
  );
});
