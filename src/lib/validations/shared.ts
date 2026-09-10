import { z } from "zod";

/**
 * An optional URL field coming from a plain <input>. Empty string is a
 * normal "not filled in" state for an optional field, not a validation
 * error — this normalizes "" to undefined before checking the URL shape,
 * so a blank field never blocks form submission.
 *
 * Validated with the URL constructor rather than a regex, so it
 * actually rejects malformed URLs (not just ones missing an "http(s)://"
 * prefix) and non-http(s) schemes (javascript:, data:, ftp:, etc).
 */
export const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine(
    (v) => {
      if (v === undefined) return true;
      try {
        const protocol = new URL(v).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL starting with http:// or https://" }
  );

/** An optional plain text field — "" normalizes to undefined/null. */
export const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));
