import crypto from "node:crypto";
import { canonicalJson } from "./serialize.js";

export function sha256Text(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashCanonical(value: unknown): string {
  return sha256Text(canonicalJson(value));
}
