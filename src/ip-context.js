const IPWHO_URL =
  "https://ipwho.is/?fields=success,timezone,latitude,longitude,country";
const REQUEST_TIMEOUT_MS = 2200;

/**
 * Approximate IP-derived context. It is intentionally kept in memory only.
 *
 * @typedef {Object} IpContext
 * @property {string=} timezone
 * @property {number=} latitude
 * @property {number=} longitude
 * @property {string=} country
 */

function isValidTimezone(timezone) {
  if (typeof timezone !== "string" || !timezone.trim()) return false;

  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

function isValidCoordinates(latitude, longitude) {
  return (
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Uses device coordinates only when location permission is already granted.
 * The permission check intentionally never prompts; blocked/unavailable
 * location falls through to the IPWHO approximation in the caller.
 *
 * @param {Navigator} navigatorObject
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function getDeviceLocationContext(
  navigatorObject = globalThis.navigator,
) {
  try {
    if (
      !navigatorObject?.permissions?.query ||
      !navigatorObject?.geolocation?.getCurrentPosition
    ) {
      return null;
    }

    const permission = await navigatorObject.permissions.query({
      name: "geolocation",
    });
    if (permission.state !== "granted") return null;

    return await new Promise((resolve) => {
      navigatorObject.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(
            isValidCoordinates(latitude, longitude)
              ? { latitude, longitude }
              : null,
          );
        },
        () => resolve(null),
        {
          enableHighAccuracy: false,
          maximumAge: 15 * 60 * 1000,
          timeout: 1800,
        },
      );
    });
  } catch {
    return null;
  }
}

/**
 * Normalizes an IPWHO response without trusting optional fields.
 *
 * @param {unknown} responseData
 * @returns {IpContext | null}
 */
export function parseIpContext(responseData) {
  if (
    !responseData ||
    typeof responseData !== "object" ||
    responseData.success !== true
  ) {
    return null;
  }

  const data = responseData;
  const timezone = isValidTimezone(data.timezone?.id)
    ? data.timezone.id
    : undefined;
  const hasCoordinates = isValidCoordinates(data.latitude, data.longitude);
  const latitude = hasCoordinates ? data.latitude : undefined;
  const longitude = hasCoordinates ? data.longitude : undefined;
  const country =
    typeof data.country === "string" && data.country.trim()
      ? data.country.trim()
      : undefined;

  if (!timezone && latitude === undefined && !country) return null;

  return { timezone, latitude, longitude, country };
}

/**
 * Creates a memoized, time-limited loader so the page makes at most one request.
 *
 * @param {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} fetcher
 * @param {number} timeoutMs
 * @returns {() => Promise<IpContext | null>}
 */
export function createIpContextLoader(
  fetcher = (...args) => globalThis.fetch(...args),
  timeoutMs = REQUEST_TIMEOUT_MS,
) {
  let contextRequest;

  return function getIpContext() {
    if (!contextRequest) {
      contextRequest = (async () => {
        let timeout;

        try {
          const controller = new AbortController();
          timeout = globalThis.setTimeout(
            () => controller.abort(),
            timeoutMs,
          );
          const response = await fetcher(IPWHO_URL, {
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          });

          if (!response.ok) return null;

          return parseIpContext(await response.json());
        } catch {
          return null;
        } finally {
          if (timeout !== undefined) globalThis.clearTimeout(timeout);
        }
      })();
    }

    return contextRequest;
  };
}

export const getIpContext = createIpContextLoader();
