import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_DESCRIPTION, SITE_NAME, getCanonicalBase } from "../lib/site";

type OgType = "website" | "article";

const HREFLANG_ATTR = "data-seo-hreflang";

function clearHreflangLinks() {
  document.querySelectorAll(`link[${HREFLANG_ATTR}]`).forEach((n) => n.remove());
}

function setHreflangAlternates(canonicalUrl: string) {
  clearHreflangLinks();
  for (const lang of ["en", "x-default"] as const) {
    const l = document.createElement("link");
    l.rel = "alternate";
    l.hreflang = lang;
    l.href = canonicalUrl;
    l.setAttribute(HREFLANG_ATTR, "1");
    document.head.appendChild(l);
  }
}

export type SeoProps = {
  title: string;
  description?: string;
  /** Comma-separated keywords (optional; used sparingly). */
  keywords?: string;
  /** When true, sets robots noindex,nofollow. */
  noIndex?: boolean;
  ogType?: OgType;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  /** Injected as JSON-LD (object or array of objects). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

const JSON_LD_ID = "structured-data-seo";

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  noIndex = false,
  ogType = "website",
  articlePublishedTime,
  articleModifiedTime,
  jsonLd,
}: SeoProps) {
  const location = useLocation();
  const fullTitle = `${title} · ${SITE_NAME}`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta("name", "description", description);
    if (keywords && !noIndex) {
      upsertMeta("name", "keywords", keywords);
    } else {
      removeMeta("name", "keywords");
    }
    if (!noIndex) {
      upsertMeta("name", "author", SITE_NAME);
    } else {
      removeMeta("name", "author");
    }
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "en_US");

    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);

    const base = getCanonicalBase();
    if (base) {
      const url = `${base}${location.pathname}${location.search}`;
      upsertMeta("property", "og:url", url);
      upsertCanonical(url);
      upsertMeta("property", "og:image", `${base}/favicon.svg`);
      if (!noIndex && !location.search) {
        setHreflangAlternates(`${base}${location.pathname}`);
      } else {
        clearHreflangLinks();
      }
    } else {
      removeMeta("property", "og:url");
      document.querySelector('link[rel="canonical"]')?.remove();
      removeMeta("property", "og:image");
      clearHreflangLinks();
    }

    if (noIndex) {
      upsertMeta("name", "robots", "noindex,nofollow");
      clearHreflangLinks();
    } else {
      upsertMeta("name", "robots", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    }

    if (ogType === "article" && articlePublishedTime) {
      upsertMeta("property", "article:published_time", articlePublishedTime);
    } else {
      removeMeta("property", "article:published_time");
    }
    if (ogType === "article" && articleModifiedTime) {
      upsertMeta("property", "article:modified_time", articleModifiedTime);
    } else {
      removeMeta("property", "article:modified_time");
    }

    let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = JSON_LD_ID;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload);
    } else if (script) {
      script.remove();
    }
  }, [
    fullTitle,
    description,
    keywords,
    noIndex,
    ogType,
    articlePublishedTime,
    articleModifiedTime,
    jsonLd,
    location.pathname,
    location.search,
  ]);

  return null;
}
