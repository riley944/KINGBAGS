// First-touch ad attribution. When a visitor lands with UTM parameters
// (every ad click will carry them), we remember the first source and stamp
// it onto any quote or sample request they later submit — so CAC per
// campaign is answerable straight from the database, not just GA4.

const KEY = "kb_attribution";

export function captureAttribution() {
  try {
    if (localStorage.getItem(KEY)) return; // first touch wins
    const p = new URLSearchParams(window.location.search);
    const source = p.get("utm_source");
    if (!source) return;
    const parts = [source, p.get("utm_medium"), p.get("utm_campaign"), p.get("utm_term")]
      .filter(Boolean)
      .map((s) => String(s).slice(0, 60).replace(/[^a-zA-Z0-9 _./-]/g, ""));
    localStorage.setItem(KEY, parts.join("/"));
  } catch {
    // storage unavailable — attribution is best-effort
  }
}

export function getAttribution(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
