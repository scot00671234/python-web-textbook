import type { PyodideInterface } from "pyodide";

/** Keep in sync with the installed `pyodide` npm package version. */
export const PYODIDE_VERSION = "0.27.7";

const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<PyodideInterface> | null = null;

/**
 * Lazily loads Pyodide once per page session (cached by the browser after first download).
 * Uses dynamic import so the main bundle stays small until someone opens the playground.
 * Wasm and the Python standard library load from the public jsDelivr CDN.
 */
export function ensurePyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await import("pyodide");
      return loadPyodide({ indexURL: INDEX_URL });
    })();
  }
  return pyodidePromise;
}
