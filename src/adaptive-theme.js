export const THEME_NAMES = ["morning", "afternoon", "evening", "night"];
export const THEME_PREFERENCE_KEYS = [
  "rang.appearance",
  "rang.autoTimeTheme",
  "rang.timeTheme",
  "rang.natureAccent",
];
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export function resetThemePreferencesForBuild(storage, resetVersion) {
  if (!resetVersion) return false;

  const markerKey = "rang.themeResetBuild";
  if (storage.getItem(markerKey) === resetVersion) return false;

  for (const key of THEME_PREFERENCE_KEYS) storage.removeItem(key);
  storage.setItem(markerKey, resetVersion);
  return true;
}

const THEME_HUES = {
  morning: {
    light: {
      "--bg": "#eaf4ff",
      "--surface": "rgba(249, 252, 255, .95)",
      "--surface-strong": "#ffffff",
      "--text": "#19324d",
      "--muted": "#586e88",
      "--line": "rgba(25, 50, 77, .15)",
      "--shadow": "0 18px 50px rgba(43, 100, 160, .14)",
      "--accent": "#397eb5",
      "--theme-glow": "rgba(91, 165, 230, .24)",
      "--canvas-top": "#d8f2ff",
      "--canvas-bottom": "#fbfeff",
      "--canvas-speck": "#3979a8",
      "--canvas-paddle": "#102c42",
      "--canvas-ink": "#102033",
      "--sky-sun": "#ffe5a3",
      "--sky-sun-glow": "rgba(255, 218, 143, .42)",
      "--sky-cloud": "rgba(255, 255, 255, .72)",
      "--sky-cloud-shadow": "rgba(106, 157, 204, .19)",
      "--sky-bird": "rgba(41, 76, 113, .8)",
      "--sky-star": "#ffffff",
      "--sky-moon": "#eaf3ff",
    },
    dark: {
      "--bg": "#111f35",
      "--surface": "rgba(27, 43, 68, .96)",
      "--surface-strong": "#1b2b44",
      "--text": "#f0f6ff",
      "--muted": "#b3c2da",
      "--line": "rgba(240, 246, 255, .15)",
      "--shadow": "0 18px 50px rgba(0, 0, 0, .34)",
      "--accent": "#8bc8ff",
      "--theme-glow": "rgba(87, 157, 232, .34)",
      "--canvas-top": "#24445e",
      "--canvas-bottom": "#102334",
      "--canvas-speck": "#b6e4ff",
      "--canvas-paddle": "#e4f6ff",
      "--canvas-ink": "#f0f8ff",
      "--sky-sun": "#ffe9b1",
      "--sky-sun-glow": "rgba(149, 205, 255, .34)",
      "--sky-cloud": "rgba(216, 237, 255, .64)",
      "--sky-cloud-shadow": "rgba(17, 34, 58, .24)",
      "--sky-bird": "rgba(15, 31, 53, .78)",
      "--sky-star": "#ffffff",
      "--sky-moon": "#eaf3ff",
    },
  },
  afternoon: {
    light: {
      "--bg": "#dcefff",
      "--surface": "rgba(248, 252, 255, .96)",
      "--surface-strong": "#ffffff",
      "--text": "#142d46",
      "--muted": "#536d84",
      "--line": "rgba(20, 45, 70, .15)",
      "--shadow": "0 18px 50px rgba(28, 79, 125, .15)",
      "--accent": "#1769b0",
      "--theme-glow": "rgba(60, 159, 234, .38)",
      "--canvas-top": "#b5e8ff",
      "--canvas-bottom": "#f5fcff",
      "--canvas-speck": "#286b96",
      "--canvas-paddle": "#102c42",
      "--canvas-ink": "#102033",
      "--sky-sun": "#fff2c4",
      "--sky-sun-glow": "rgba(255, 244, 204, .62)",
      "--sky-cloud": "rgba(255, 255, 255, .8)",
      "--sky-cloud-shadow": "rgba(61, 133, 190, .17)",
      "--sky-bird": "rgba(36, 73, 110, .76)",
      "--sky-star": "#ffffff",
      "--sky-moon": "#eaf3ff",
    },
    dark: {
      "--bg": "#164b72",
      "--surface": "rgba(27, 83, 122, .98)",
      "--surface-strong": "#1b537a",
      "--text": "#f0f7ff",
      "--muted": "#c1d8eb",
      "--line": "rgba(240, 247, 255, .15)",
      "--shadow": "0 18px 50px rgba(0, 0, 0, .34)",
      "--accent": "#a4e4ff",
      "--theme-glow": "rgba(67, 190, 255, .62)",
      "--canvas-top": "#399bd0",
      "--canvas-bottom": "#164b72",
      "--canvas-speck": "#c2efff",
      "--canvas-paddle": "#e4f6ff",
      "--canvas-ink": "#f0f8ff",
      "--sky-sun": "#fff1be",
      "--sky-sun-glow": "rgba(177, 230, 255, .5)",
      "--sky-cloud": "rgba(227, 243, 255, .72)",
      "--sky-cloud-shadow": "rgba(12, 54, 87, .28)",
      "--sky-bird": "rgba(13, 40, 67, .78)",
      "--sky-star": "#ffffff",
      "--sky-moon": "#eaf3ff",
    },
  },
  evening: {
    light: {
      "--bg": "#e8edff",
      "--surface": "rgba(250, 251, 255, .95)",
      "--surface-strong": "#fafbff",
      "--text": "#303857",
      "--muted": "#646e91",
      "--line": "rgba(48, 56, 87, .16)",
      "--shadow": "0 18px 50px rgba(70, 78, 145, .16)",
      "--accent": "#596cb6",
      "--theme-glow": "rgba(119, 132, 217, .32)",
      "--canvas-top": "#c1c9f2",
      "--canvas-bottom": "#edf0ff",
      "--canvas-speck": "#565f9d",
      "--canvas-paddle": "#303857",
      "--canvas-ink": "#303857",
      "--sky-sun": "#ffd3a6",
      "--sky-sun-glow": "rgba(255, 187, 146, .4)",
      "--sky-cloud": "rgba(255, 244, 239, .7)",
      "--sky-cloud-shadow": "rgba(70, 76, 139, .2)",
      "--sky-bird": "rgba(44, 56, 94, .8)",
      "--sky-star": "#f8f4ff",
      "--sky-moon": "#edf0ff",
    },
    dark: {
      "--bg": "#201d3b",
      "--surface": "rgba(48, 44, 82, .96)",
      "--surface-strong": "#302c52",
      "--text": "#f4f2ff",
      "--muted": "#c4c0e2",
      "--line": "rgba(244, 242, 255, .16)",
      "--shadow": "0 18px 50px rgba(0, 0, 0, .38)",
      "--accent": "#b4baff",
      "--theme-glow": "rgba(132, 123, 222, .42)",
      "--canvas-top": "#504c86",
      "--canvas-bottom": "#201d3b",
      "--canvas-speck": "#d4d4ff",
      "--canvas-paddle": "#f4f2ff",
      "--canvas-ink": "#f4f2ff",
      "--sky-sun": "#ffc995",
      "--sky-sun-glow": "rgba(255, 171, 139, .3)",
      "--sky-cloud": "rgba(228, 222, 255, .48)",
      "--sky-cloud-shadow": "rgba(15, 14, 38, .28)",
      "--sky-bird": "rgba(20, 22, 48, .86)",
      "--sky-star": "#f5f4ff",
      "--sky-moon": "#f0edff",
    },
  },
  night: {
    light: {
      "--bg": "#e8ecf8",
      "--surface": "rgba(250, 251, 255, .95)",
      "--surface-strong": "#fafbff",
      "--text": "#263852",
      "--muted": "#5a6880",
      "--line": "rgba(38, 56, 82, .16)",
      "--shadow": "0 18px 50px rgba(35, 48, 90, .16)",
      "--accent": "#456899",
      "--theme-glow": "rgba(92, 113, 187, .25)",
      "--canvas-top": "#b9c9df",
      "--canvas-bottom": "#eaf0f8",
      "--canvas-speck": "#425c7b",
      "--canvas-paddle": "#263852",
      "--canvas-ink": "#263852",
      "--sky-sun": "#e8edff",
      "--sky-sun-glow": "rgba(193, 211, 255, .22)",
      "--sky-cloud": "rgba(255, 255, 255, .46)",
      "--sky-cloud-shadow": "rgba(81, 104, 158, .14)",
      "--sky-bird": "rgba(39, 57, 86, .7)",
      "--sky-star": "#f9fbff",
      "--sky-moon": "#f0f5ff",
    },
    dark: {
      "--bg": "#080f22",
      "--surface": "rgba(19, 29, 56, .96)",
      "--surface-strong": "#131d38",
      "--text": "#f1f4ff",
      "--muted": "#b5bfdc",
      "--line": "rgba(241, 244, 255, .16)",
      "--shadow": "0 18px 50px rgba(0, 0, 0, .4)",
      "--accent": "#9bb6ff",
      "--theme-glow": "rgba(77, 99, 177, .35)",
      "--canvas-top": "#17294e",
      "--canvas-bottom": "#091326",
      "--canvas-speck": "#d9e6ff",
      "--canvas-paddle": "#f4f8ff",
      "--canvas-ink": "#f4f8ff",
      "--sky-sun": "#dbe6ff",
      "--sky-sun-glow": "rgba(117, 154, 232, .2)",
      "--sky-cloud": "rgba(187, 207, 255, .24)",
      "--sky-cloud-shadow": "rgba(3, 8, 24, .26)",
      "--sky-bird": "rgba(11, 19, 39, .8)",
      "--sky-star": "#f7f8ff",
      "--sky-moon": "#e5edff",
    },
  },
};

function isValidTimezone(timezone) {
  if (typeof timezone !== "string" || !timezone.trim()) return false;

  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

function isValidCoordinates(context) {
  return (
    Number.isFinite(context?.latitude) &&
    context.latitude >= -90 &&
    context.latitude <= 90 &&
    Number.isFinite(context?.longitude) &&
    context.longitude >= -180 &&
    context.longitude <= 180
  );
}

/** Prefer the system timezone; use IPWHO only when the browser cannot identify one. */
export function resolveTimezone(context) {
  try {
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (isValidTimezone(systemTimezone)) return systemTimezone;
  } catch {
    // An unavailable Intl timezone falls through to the IP-derived value.
  }

  return isValidTimezone(context?.timezone) ? context.timezone : undefined;
}

function getDateParts(date, timezone) {
  if (!timezone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );

    if (
      !Number.isInteger(values.year) ||
      !Number.isInteger(values.month) ||
      !Number.isInteger(values.day) ||
      !Number.isInteger(values.hour) ||
      !Number.isInteger(values.minute) ||
      !Number.isInteger(values.second)
    ) {
      return null;
    }

    return values;
  } catch {
    return null;
  }
}

/** Return the current wall-clock fields in the selected system/IP timezone. */
export function getLocalClockParts(now = new Date(), context = null) {
  const timezone = resolveTimezone(context);
  const parts = getDateParts(now, timezone);
  return parts
    ? { hour: parts.hour, minute: parts.minute, second: parts.second }
    : {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      };
}

function themeForHour(hour) {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function solarEventUtcHours(dayOfYear, latitude, longitude, sunrise) {
  const longitudeHour = longitude / 15;
  const approximateTime =
    dayOfYear + ((sunrise ? 6 : 18) - longitudeHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude = normalizeDegrees(
    meanAnomaly +
      1.916 * Math.sin((meanAnomaly * Math.PI) / 180) +
      0.02 * Math.sin((2 * meanAnomaly * Math.PI) / 180) +
      282.634,
  );
  let rightAscension = normalizeDegrees(
    (Math.atan(0.91764 * Math.tan((trueLongitude * Math.PI) / 180)) * 180) /
      Math.PI,
  );
  rightAscension += Math.floor(trueLongitude / 90) * 90;
  rightAscension -= Math.floor(rightAscension / 360) * 360;
  rightAscension /= 15;

  const sinDeclination =
    0.39782 * Math.sin((trueLongitude * Math.PI) / 180);
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const latitudeRadians = (latitude * Math.PI) / 180;
  const cosHourAngle =
    (Math.cos((90.833 * Math.PI) / 180) -
      sinDeclination * Math.sin(latitudeRadians)) /
    (cosDeclination * Math.cos(latitudeRadians));

  if (cosHourAngle < -1 || cosHourAngle > 1) return null;

  const hourAngle =
    (sunrise ? 360 - Math.acos(cosHourAngle) * (180 / Math.PI) : Math.acos(cosHourAngle) * (180 / Math.PI)) /
    15;
  const localMeanTime =
    hourAngle + rightAscension - 0.06571 * approximateTime - 6.622;

  return ((localMeanTime - longitudeHour) % 24 + 24) % 24;
}

function getLocalDateKey(date, timezone) {
  const parts = getDateParts(date, timezone);
  return parts
    ? `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`
    : null;
}

function eventForLocalDate(year, month, day, utcHours, timezone) {
  const base = Date.UTC(year, month - 1, day) + utcHours * HOUR_MS;
  const targetDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  for (const offset of [-1, 0, 1]) {
    const event = new Date(base + offset * 24 * HOUR_MS);
    if (getLocalDateKey(event, timezone) === targetDate) return event;
  }

  return null;
}

/**
 * Approximate sunrise/sunset using the NOAA sunrise equation. Polar-day/night
 * and short/long daylight cases return null so the stable clock bands apply.
 */
function getSolarTimes(parts, context, timezone) {
  if (!isValidCoordinates(context)) return null;

  const dayOfYear =
    Math.floor(
      (Date.UTC(parts.year, parts.month - 1, parts.day) -
        Date.UTC(parts.year, 0, 1)) /
        (24 * HOUR_MS),
    ) + 1;
  const sunriseHours = solarEventUtcHours(
    dayOfYear,
    context.latitude,
    context.longitude,
    true,
  );
  const sunsetHours = solarEventUtcHours(
    dayOfYear,
    context.latitude,
    context.longitude,
    false,
  );

  if (sunriseHours === null || sunsetHours === null) return null;

  const sunrise = eventForLocalDate(
    parts.year,
    parts.month,
    parts.day,
    sunriseHours,
    timezone,
  );
  const sunset = eventForLocalDate(
    parts.year,
    parts.month,
    parts.day,
    sunsetHours,
    timezone,
  );

  if (!sunrise || !sunset) return null;

  const daylight = sunset.getTime() - sunrise.getTime();
  if (daylight < 5 * HOUR_MS || daylight > 19 * HOUR_MS) return null;

  return { sunrise, sunset };
}

/**
 * Resolve a theme using the IP timezone when valid, otherwise system/local time.
 * Coordinates refine transition hours when a usable sunrise and sunset exist.
 *
 * @param {Date} now
 * @param {{timezone?: string, latitude?: number, longitude?: number}=} context
 */
export function resolveAdaptiveTheme(now = new Date(), context = null) {
  const timezone = resolveTimezone(context);
  const parts = getDateParts(now, timezone);
  if (!parts) {
    return themeForHour(now.getHours());
  }

  const clockTheme = themeForHour(parts.hour);
  const solarTimes = getSolarTimes(parts, context, timezone);
  if (!solarTimes) return clockTheme;

  const currentTime = now.getTime();
  const sunrise = solarTimes.sunrise.getTime();
  const sunset = solarTimes.sunset.getTime();
  const solarNoon = (sunrise + sunset) / 2;
  const morningStart = sunrise - 45 * MINUTE_MS;
  const eveningStart = sunset - 60 * MINUTE_MS;
  const eveningEnd = sunset + 60 * MINUTE_MS;

  if (eveningStart <= solarNoon) return clockTheme;
  if (currentTime >= morningStart && currentTime < solarNoon) return "morning";
  if (currentTime >= solarNoon && currentTime < eveningStart)
    return "afternoon";
  if (currentTime >= eveningStart && currentTime < eveningEnd) return "evening";
  return "night";
}

/** Apply the central CSS/canvas tokens without touching any game state. */
export function applyThemePalette(
  root,
  theme,
  appearance = "system",
  systemDark = false,
) {
  const selectedTheme = THEME_NAMES.includes(theme) ? theme : "morning";
  const dark =
    appearance === "dark"
      ? true
      : appearance === "light"
        ? false
        : selectedTheme === "night" ||
          (selectedTheme === "evening" && systemDark);
  const hue = THEME_HUES[selectedTheme][dark ? "dark" : "light"];

  root.dataset.timeTheme = selectedTheme;
  root.dataset.forcedTheme =
    appearance === "system" ? "" : appearance;
  root.style.colorScheme = dark ? "dark" : "light";
  root.style.setProperty("--theme-dark", dark ? "1" : "0");

  const tokens = hue;
  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(name, value);
  }

  return { theme: selectedTheme, dark, ...tokens };
}
