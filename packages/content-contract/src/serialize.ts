import type { JsonValue } from "./schema/common.js";

export function canonicalize(value: unknown): JsonValue {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) return value.map((entry) => canonicalize(entry));
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, JsonValue> = {};
    for (const key of Object.keys(record).sort()) {
      const entry = record[key];
      if (entry !== undefined) sorted[key] = canonicalize(entry);
    }
    return sorted;
  }
  return null;
}

export function canonicalJson(value: unknown): string {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}
