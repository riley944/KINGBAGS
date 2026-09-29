// Fire-and-forget report of a browser-side failure to the server log.
export function reportClientError(where: string, err: unknown, extra?: Record<string, unknown>) {
  try {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    // eslint-disable-next-line no-console
    console.error(`[${where}]`, err);
    fetch("/api/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ where, message, extra }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
