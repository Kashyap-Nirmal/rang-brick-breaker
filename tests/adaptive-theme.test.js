import test from "node:test";
import assert from "node:assert/strict";
import {
  applyThemePalette,
  getLocalClockParts,
  resetThemePreferencesForBuild,
  resolveAdaptiveTheme,
  resolveTimezone,
  THEME_PREFERENCE_KEYS,
  THEME_NAMES,
} from "../src/adaptive-theme.js";

const utcContext = { timezone: "UTC" };

test("theme reset clears only theme preferences once per reset version", () => {
  const values = new Map([
    ...THEME_PREFERENCE_KEYS.map((key) => [key, "saved-theme-value"]),
    ["rang.best.v015", "250"],
    ["rang.language", "es"],
    ["rang.soundEnabled", "false"],
  ]);
  const storage = {
    getItem(key) {
      return values.get(key) ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };

  assert.equal(resetThemePreferencesForBuild(storage, null), false);
  assert.equal(values.get("rang.timeTheme"), "saved-theme-value");
  assert.equal(resetThemePreferencesForBuild(storage, "reset-a"), true);
  assert.equal(resetThemePreferencesForBuild(storage, "reset-a"), false);
  assert.equal(values.get("rang.themeResetBuild"), "reset-a");
  for (const key of THEME_PREFERENCE_KEYS) assert.equal(values.has(key), false);
  assert.equal(values.get("rang.best.v015"), "250");
  assert.equal(values.get("rang.language"), "es");
  assert.equal(values.get("rang.soundEnabled"), "false");

  values.set("rang.timeTheme", "night");
  assert.equal(resetThemePreferencesForBuild(storage, "reset-a"), false);
  assert.equal(values.get("rang.timeTheme"), "night");
  assert.equal(resetThemePreferencesForBuild(storage, "reset-b"), true);
  assert.equal(values.has("rang.timeTheme"), false);
});

function withSystemTimezone(timezone, callback) {
  const originalIntl = globalThis.Intl;
  const DateTimeFormat = originalIntl.DateTimeFormat;
  globalThis.Intl = {
    DateTimeFormat: function DateTimeFormatWithSystemZone(locale, options = {}) {
      return new DateTimeFormat(locale, {
        ...options,
        timeZone: options.timeZone || timezone,
      });
    },
  };

  try {
    return callback();
  } finally {
    globalThis.Intl = originalIntl;
  }
}

test("uses the system timezone before an available IP timezone", () => {
  const originalIntl = globalThis.Intl;
  globalThis.Intl = {
    DateTimeFormat: function DateTimeFormat(_locale, options) {
      return {
        format() {},
        resolvedOptions: () => ({
          timeZone: options?.timeZone || "America/Los_Angeles",
        }),
      };
    },
  };

  try {
    assert.equal(
      resolveTimezone({ timezone: "Asia/Tokyo" }),
      "America/Los_Angeles",
    );
  } finally {
    globalThis.Intl = originalIntl;
  }
});

test("uses IP timezone if system timezone identification is unavailable", () => {
  const originalIntl = globalThis.Intl;
  globalThis.Intl = {
    DateTimeFormat: function DateTimeFormat(_locale, options) {
      return {
        format() {},
        resolvedOptions: () => ({ timeZone: options?.timeZone || undefined }),
      };
    },
  };

  try {
    assert.equal(resolveTimezone({ timezone: "Asia/Tokyo" }), "Asia/Tokyo");
  } finally {
    globalThis.Intl = originalIntl;
  }
});

test("system timezone drives theme selection even if IPWHO reports another zone", () => {
  const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  assert.equal(
    resolveTimezone({ timezone: "Asia/Tokyo" }),
    systemTimezone,
  );
});

test("falls back to the system timezone when the IP timezone is invalid", () => {
  assert.equal(
    resolveTimezone({ timezone: "Not/A_Timezone" }),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
});

test("uses browser-local clock methods when timezone identification is unavailable", () => {
  const originalIntl = globalThis.Intl;
  globalThis.Intl = undefined;

  try {
    assert.equal(
      resolveAdaptiveTheme(new Date(2024, 5, 21, 6, 0), null),
      "morning",
    );
  } finally {
    globalThis.Intl = originalIntl;
  }
});

test("selects all four themes at their clock-band boundaries", () => {
  withSystemTimezone("UTC", () => {
    const themeAt = (time) =>
      resolveAdaptiveTheme(new Date(`2024-06-21T${time}:00Z`), utcContext);

    assert.equal(themeAt("04:59"), "night");
    assert.equal(themeAt("05:00"), "morning");
    assert.equal(themeAt("10:59"), "morning");
    assert.equal(themeAt("11:00"), "afternoon");
    assert.equal(themeAt("16:59"), "afternoon");
    assert.equal(themeAt("17:00"), "evening");
    assert.equal(themeAt("19:59"), "evening");
    assert.equal(themeAt("20:00"), "night");
  });
});

test("one PM in the system timezone resolves to afternoon", () => {
  assert.equal(resolveAdaptiveTheme(new Date(2024, 5, 21, 13, 0)), "afternoon");
});

test("sky clock follows system-local time before the IP timezone", () => {
  withSystemTimezone("America/Los_Angeles", () => {
    assert.deepEqual(
      getLocalClockParts(new Date("2024-06-21T20:34:56Z"), {
        timezone: "Asia/Tokyo",
      }),
      { hour: 13, minute: 34, second: 56 },
    );
  });
});

test("uses the system timezone instead of a conflicting IP timezone", () => {
  withSystemTimezone("America/Los_Angeles", () => {
    const instant = new Date("2024-06-21T13:00:00Z");

    assert.equal(
      resolveAdaptiveTheme(instant, { timezone: "Asia/Tokyo" }),
      "morning",
    );
  });
});

test("uses valid coordinates for sunrise and sunset transitions", () => {
  withSystemTimezone("UTC", () => {
    const context = { timezone: "America/New_York", latitude: 0, longitude: 0 };

    assert.equal(
      resolveAdaptiveTheme(new Date("2024-06-21T10:00:00Z"), context),
      "morning",
    );
    assert.equal(
      resolveAdaptiveTheme(new Date("2024-06-21T14:00:00Z"), context),
      "afternoon",
    );
    assert.equal(
      resolveAdaptiveTheme(new Date("2024-06-21T18:00:00Z"), context),
      "evening",
    );
  });
});

test("falls back to clock bands when solar calculations are unavailable", () => {
  withSystemTimezone("UTC", () => {
    assert.equal(
      resolveAdaptiveTheme(new Date("2024-06-21T10:00:00Z"), {
        timezone: "UTC",
        latitude: 90,
        longitude: 0,
      }),
      "morning",
    );
    assert.equal(
      resolveAdaptiveTheme(new Date("2024-06-21T12:00:00Z"), {
        timezone: "UTC",
        latitude: 91,
        longitude: 0,
      }),
      "afternoon",
    );
  });
});

test("provides a distinct palette for each theme without touching game state", () => {
  const root = {
    dataset: {},
    style: {
      values: new Map(),
      setProperty(name, value) {
        this.values.set(name, value);
      },
    },
  };
  const backgrounds = new Set();

  for (const theme of THEME_NAMES) {
    applyThemePalette(root, theme, "system", false);
    assert.equal(root.dataset.timeTheme, theme);
    assert.ok(root.style.values.get("--canvas-top"));
    assert.ok(root.style.values.get("--canvas-bottom"));
    assert.ok(root.style.values.get("--theme-glow"));
    backgrounds.add(root.style.values.get("--bg"));
  }

  assert.equal(backgrounds.size, THEME_NAMES.length);
});

test("keeps automatic afternoon visibly blue and daylight-bright in dark system mode", () => {
  const root = {
    dataset: {},
    style: {
      values: new Map(),
      setProperty(name, value) {
        this.values.set(name, value);
      },
    },
  };

  const palette = applyThemePalette(root, "afternoon", "system", true);

  assert.equal(palette.dark, false);
  assert.equal(palette["--bg"], "#dcefff");
  assert.equal(palette["--accent"], "#1769b0");
  assert.match(palette["--theme-glow"], /60, 159, 234/);
});

test("keeps all time-theme hex colors blue-leaning rather than green", () => {
  const root = {
    dataset: {},
    style: { setProperty() {} },
  };

  for (const theme of THEME_NAMES) {
    const palette = applyThemePalette(root, theme, "light");
    for (const [name, value] of Object.entries(palette)) {
      if (name === "--sky-sun") continue;
      if (typeof value !== "string" || !/^#[\da-f]{6}$/i.test(value)) continue;

      const green = Number.parseInt(value.slice(3, 5), 16);
      const blue = Number.parseInt(value.slice(5, 7), 16);
      assert.ok(blue >= green, `${theme} palette color ${value} is green-leaning`);
    }
  }
});
