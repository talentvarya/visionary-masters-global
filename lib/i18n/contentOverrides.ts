/**
 * Site copy lives in locales/*.json. Admins can override any single string
 * from the dashboard; those overrides are stored against a dotted "content key"
 * (e.g. "home.heroTagline", "services.items.1.outcome") and merged over the
 * JSON at runtime. The JSON therefore always remains the working default — an
 * empty overrides table changes nothing.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Flattens a locale object into { "dotted.path": "string value" } pairs. */
export function flattenContent(value: Json, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};

  if (typeof value === "string") {
    if (prefix) out[prefix] = value;
    return out;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, i) => {
      Object.assign(out, flattenContent(entry, prefix ? `${prefix}.${i}` : String(i)));
    });
    return out;
  }

  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      Object.assign(out, flattenContent(entry, prefix ? `${prefix}.${key}` : key));
    }
  }

  return out;
}

/**
 * Returns a deep copy of `base` with each override applied at its dotted path.
 * Unknown paths are ignored, so a stale key left over from an older version of
 * the site can never break the page.
 */
export function applyOverrides<T>(base: T, overrides: Record<string, string>): T {
  const entries = Object.entries(overrides);
  if (entries.length === 0) return base;

  const copy = structuredClone(base) as unknown as Record<string, unknown>;

  for (const [path, value] of entries) {
    const parts = path.split(".");
    let node: unknown = copy;

    for (let i = 0; i < parts.length - 1; i++) {
      if (node === null || typeof node !== "object") {
        node = null;
        break;
      }
      node = (node as Record<string, unknown>)[parts[i]];
    }

    const lastKey = parts[parts.length - 1];
    if (node && typeof node === "object" && lastKey in (node as Record<string, unknown>)) {
      const target = node as Record<string, unknown>;
      // Only ever replace strings — never reshape the locale structure.
      if (typeof target[lastKey] === "string") {
        target[lastKey] = value;
      }
    }
  }

  return copy as unknown as T;
}
