import { useCallback, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllLessons } from "../content/curriculum";
import { getCanonicalBase, SITE_NAME } from "../lib/site";

const footerLink =
  "text-sm font-medium text-[var(--muted)] no-underline underline-offset-2 hover:text-[var(--text)] hover:underline";

const shareIconBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm transition hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25";

function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}

function FooterShareLinks() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const origin = getCanonicalBase() || window.location.origin;
    return `${origin}${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(SITE_NAME);
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const redditHref = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const onShareOrCopy = useCallback(async () => {
    if (canUseNativeShare()) {
      try {
        await navigator.share({ title: SITE_NAME, text: SITE_NAME, url: pageUrl });
      } catch {
        /* dismissed or failed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [pageUrl]);

  return (
    <div className="mt-10 border-t border-[var(--border)] pt-8">
      <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Share this page</p>
      <p className="mt-2 max-w-xl text-xs leading-relaxed text-[var(--muted)]">
        Opens your account on each network with this page&apos;s link pre-filled where supported.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={pageUrl ? xHref : undefined}
          className={shareIconBtn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </a>
        <a
          href={pageUrl ? redditHref : undefined}
          className={shareIconBtn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Reddit"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <path
              fill="currentColor"
              d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.697-3.224 4.892-7.229 4.892-4.006 0-7.229-2.195-7.229-4.892 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.731-1.514l.56-2.624-2.457.516A1.236 1.236 0 0 1 9.983 3.31a1.25 1.25 0 1 1 2.449.518l-.004.017zM8.58 14.18c0 .558.405.966.859.966.454 0 .858-.408.858-.966 0-.558-.404-.966-.858-.966-.454 0-.859.408-.859.966zm6.728 0c0 .558.405.966.858.966.454 0 .859-.408.859-.966 0-.558-.405-.966-.859-.966-.453 0-.858.408-.858.966z"
            />
          </svg>
        </a>
        <a
          href={pageUrl ? fbHref : undefined}
          className={shareIconBtn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        </a>
        <button
          type="button"
          onClick={onShareOrCopy}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
          aria-label={canUseNativeShare() ? "Share using your device" : "Copy page link"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" strokeLinecap="round" />
          </svg>
          {canUseNativeShare() ? "Share" : copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const n = getAllLessons().length;

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Learn</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link className={footerLink} to="/learn">
                  All lessons ({n})
                </Link>
              </li>
              <li>
                <Link className={footerLink} to="/learn/how-to-use-this-site">
                  How to use this site
                </Link>
              </li>
              <li>
                <Link className={footerLink} to="/search">
                  Search
                </Link>
              </li>
              <li>
                <Link className={footerLink} to="/#faq">
                  FAQ (home)
                </Link>
              </li>
              <li>
                <Link className={footerLink} to="/blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Practice</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link className={footerLink} to="/learn/flashcards">
                  Flashcards
                </Link>
              </li>
              <li>
                <Link className={footerLink} to="/learn/python-in-plain-english">
                  Python in plain English
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">About</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {SITE_NAME} is a free, browser-based introduction to Python—structured lessons, optional typing
              checks on examples, flashcards, and plain-language companion readings. No account is required;
              this is study material, not a formal course provider.
            </p>
          </div>
        </div>

        <FooterShareLinks />

        <p className="mt-10 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
