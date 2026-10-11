import test from "node:test";
import assert from "node:assert/strict";
import {
  createIpContextLoader,
  getDeviceLocationContext,
  parseIpContext,
} from "../src/ip-context.js";

test("parses valid IPWHO context fields", () => {
  assert.deepEqual(
    parseIpContext({
      success: true,
      timezone: { id: "Asia/Tokyo" },
      latitude: 35.6762,
      longitude: 139.6503,
      country: "Japan",
    }),
    {
      timezone: "Asia/Tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
      country: "Japan",
    },
  );
});

test("rejects failed, malformed, or empty API responses", () => {
  assert.equal(parseIpContext(null), null);
  assert.equal(parseIpContext({ success: false }), null);
  assert.equal(parseIpContext({ success: true }), null);
});

test("discards invalid timezones and coordinate pairs but retains useful country", () => {
  assert.deepEqual(
    parseIpContext({
      success: true,
      timezone: { id: "Invalid/Zone" },
      latitude: 91,
      longitude: 200,
      country: " Japan ",
    }),
    {
      timezone: undefined,
      latitude: undefined,
      longitude: undefined,
      country: "Japan",
    },
  );
});

test("accepts boundary coordinates and rejects non-finite coordinates", () => {
  assert.deepEqual(
    parseIpContext({
      success: true,
      latitude: -90,
      longitude: 180,
    }),
    {
      timezone: undefined,
      latitude: -90,
      longitude: 180,
      country: undefined,
    },
  );
  assert.equal(
    parseIpContext({
      success: true,
      latitude: Number.POSITIVE_INFINITY,
      longitude: 0,
      country: "",
    }),
    null,
  );
});

test("memoizes one no-store IPWHO request", async () => {
  let requestCount = 0;
  let requestedUrl;
  let requestOptions;
  const load = createIpContextLoader(async (url, options) => {
    requestCount += 1;
    requestedUrl = url;
    requestOptions = options;
    return {
      ok: true,
      json: async () => ({
        success: true,
        timezone: { id: "Europe/London" },
      }),
    };
  });

  const [first, second] = await Promise.all([load(), load()]);

  assert.deepEqual(first, second);
  assert.equal(first.timezone, "Europe/London");
  assert.match(requestedUrl, /ipwho\.is\/\?fields=success,timezone,latitude,longitude,country/);
  assert.equal(requestOptions.cache, "no-store");
  assert.equal(requestOptions.headers.Accept, "application/json");
  assert.equal(requestCount, 1);
});

test("returns null for HTTP, network, malformed JSON, and timeout failures", async () => {
  const httpFailure = createIpContextLoader(async () => ({ ok: false }));
  const malformedResponse = createIpContextLoader(async () => ({
    ok: true,
    json: async () => {
      throw new SyntaxError("invalid JSON");
    },
  }));
  const networkFailure = createIpContextLoader(async () => {
    throw new TypeError("offline");
  });
  const timedOut = createIpContextLoader(
    (_url, { signal }) =>
      new Promise((resolve, reject) => {
        const abort = () => reject(new DOMException("Aborted", "AbortError"));
        if (signal.aborted) abort();
        else signal.addEventListener("abort", abort, { once: true });
      }),
    5,
  );

  assert.equal(await httpFailure(), null);
  assert.equal(await malformedResponse(), null);
  assert.equal(await networkFailure(), null);
  assert.equal(await timedOut(), null);
});

test("uses device location only when permission is already granted", async () => {
  let locationReads = 0;
  const grantedNavigator = {
    permissions: {
      query: async () => ({ state: "granted" }),
    },
    geolocation: {
      getCurrentPosition(success) {
        locationReads += 1;
        success({ coords: { latitude: 37.7749, longitude: -122.4194 } });
      },
    },
  };
  const deniedNavigator = {
    permissions: {
      query: async () => ({ state: "denied" }),
    },
    geolocation: {
      getCurrentPosition() {
        locationReads += 1;
      },
    },
  };

  assert.deepEqual(await getDeviceLocationContext(grantedNavigator), {
    latitude: 37.7749,
    longitude: -122.4194,
  });
  assert.equal(await getDeviceLocationContext(deniedNavigator), null);
  assert.equal(locationReads, 1);
});
