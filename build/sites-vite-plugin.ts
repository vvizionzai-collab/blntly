/**
 * Stub for the OpenAI Sites environment plugin.
 * Returns a no-op Vite plugin when running outside that environment.
 */
import type { Plugin } from "vite";

export function sites(): Plugin {
  return {
    name: "blntly-sites-env",
    enforce: "pre",
  };
}
