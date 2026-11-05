import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const customer = { name: "Ada", email: "ada@example.com", phone: "5551234567" };
const booking = { experience: "santa" as const, date: "2026-11-27", santaPackage: "one" as const, customer };
const photog = { date: "2026-11-27", startTime: "10:00", packageKey: "studio-hour", ...customer };

function mockFetch(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const fn = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

async function loadApi(base: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", base);
  return import("../api");
}

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => vi.unstubAllEnvs());

describe("createBooking", () => {
  it("returns the https checkout URL as pending_payment", async () => {
    const api = await loadApi("https://api.test/");
    const f = mockFetch({ success: true, data: { id: 7 }, checkoutUrl: "https://checkout.square.site/x" });
    const r = await api.createBooking(booking);
    expect(r).toEqual({ bookingId: "7", status: "pending_payment", checkoutUrl: "https://checkout.square.site/x" });
    expect(f.mock.calls[0][0]).toBe("https://api.test/api/bookable-events/public/santa-photos/bookings");
    expect(JSON.parse(f.mock.calls[0][1].body)).toMatchObject({ packageKey: "santa-one-child", dates: ["2026-11-27"], quantity: 1 });
  });

  it("is confirmed when there is no checkout URL", async () => {
    const api = await loadApi("https://api.test");
    mockFetch({ success: true, data: { id: 1 }, checkoutUrl: null });
    expect(await api.createBooking(booking)).toMatchObject({ status: "confirmed", checkoutUrl: undefined });
  });

  it.each(["javascript:alert(1)", "data:text/html,hi", "http://insecure.test/pay", "not a url"])(
    "rejects unsafe checkout URL %s",
    async (checkoutUrl) => {
      const api = await loadApi("https://api.test");
      mockFetch({ success: true, data: { id: 1 }, checkoutUrl });
      await expect(api.createBooking(booking)).rejects.toThrow("unexpected response");
    },
  );

  it("surfaces the backend error message and status", async () => {
    const api = await loadApi("https://api.test");
    mockFetch({ message: "Sold out" }, { ok: false, status: 409 });
    await expect(api.createBooking(booking)).rejects.toMatchObject({ message: "Sold out", status: 409 });
  });

  it("wraps network failures in ApiError", async () => {
    const api = await loadApi("https://api.test");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    await expect(api.createBooking(booking)).rejects.toBeInstanceOf(api.ApiError);
  });
});

describe("createPhotographerBooking", () => {
  it("rejects a javascript: checkout URL", async () => {
    const api = await loadApi("https://api.test");
    mockFetch({ success: true, data: { id: 2 }, checkoutUrl: "javascript:alert(1)" });
    await expect(api.createPhotographerBooking(photog)).rejects.toThrow("unexpected response");
  });

  it("accepts an https checkout URL", async () => {
    const api = await loadApi("https://api.test");
    mockFetch({ success: true, data: { id: 2 }, checkoutUrl: "https://pay.test/c" });
    expect(await api.createPhotographerBooking(photog)).toMatchObject({ status: "pending_payment", checkoutUrl: "https://pay.test/c" });
  });
});

describe("getAvailability", () => {
  it("maps date-only and slot-mode days", async () => {
    const api = await loadApi("https://api.test");
    mockFetch({
      data: {
        days: [
          { date: "2026-11-27", remaining: 0 },
          { date: "2026-11-28", remaining: 3 },
          { date: "2026-11-29", remaining: null, slots: [
            { startTime: "10:00", remaining: 1, privateAvailable: false },
            { startTime: "11:00", remaining: 0 },
            { startTime: "12:00", remaining: 2 },
          ] },
        ],
      },
    });
    const days = await api.getAvailability("selfie");
    expect(days.map((d) => d.available)).toEqual([false, true, true]);
    expect(days[2].times).toEqual(["10:00", "12:00"]);
    expect(days[2].privateTimes).toEqual(["12:00"]);
  });

  it("rejects a malformed response", async () => {
    const api = await loadApi("https://api.test");
    mockFetch({ data: {} });
    await expect(api.getAvailability("santa")).rejects.toThrow("unexpected response");
  });
});

describe("demo mode", () => {
  it("is active with no base URL and never calls fetch", async () => {
    const api = await loadApi("");
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    expect(api.MOCK_MODE).toBe(true);
    expect((await api.createBooking(booking)).status).toBe("confirmed");
    await expect(api.checkPhotographerAccess("a@b.co")).rejects.toBeInstanceOf(api.ApiError);
    expect(f).not.toHaveBeenCalled();
  });
});
