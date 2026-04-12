/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional public site URL for canonical tags and JSON-LD (e.g. https://www.example.com). */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
