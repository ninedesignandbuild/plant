export const field = "w-full rounded-lg border border-sage/50 bg-white px-3 py-2 text-sm";
export const btn = "inline-block rounded-full bg-forest px-5 py-2 text-sm text-white disabled:opacity-60";
export const send = (method: string, url: string, body?: unknown) =>
  fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
