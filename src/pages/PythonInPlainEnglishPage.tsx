import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CodeRetypePractice } from "../components/CodeRetypePractice";
import { Seo } from "../components/Seo";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd } from "../lib/structuredData";
import {
  getPlainEnglishCardsGrouped,
  plainEnglishLevelLabel,
  type PlainEnglishCard,
} from "../content/pythonInPlainEnglish";

const LAYOUT_STORAGE_KEY = "python-plain-english-layout";

type LayoutMode = "split" | "stacked";
type AnimationPhase = "typingCode" | "holdCode" | "typingEnglish" | "holdEnglish";
type AnimationPlaybackMode = "auto" | "manual";
type ManualAnimationPanel = "code" | "english";

function readStoredLayout(): LayoutMode {
  try {
    const v = sessionStorage.getItem(LAYOUT_STORAGE_KEY);
    if (v === "stacked" || v === "split") return v;
  } catch {
    /* ignore */
  }
  return "split";
}

function isPlainEnglishInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "textarea, input, select, button, a[href], [role='tablist'], [role='tab'], [role='dialog']",
    ),
  );
}

function shouldIgnoreCardStepArrows(): boolean {
  const ae = document.activeElement;
  if (ae instanceof HTMLTextAreaElement || ae instanceof HTMLInputElement || ae instanceof HTMLSelectElement)
    return true;
  return ae instanceof HTMLElement && ae.isContentEditable;
}

function CodeAndEnglish({
  card,
  layout,
  isFocus = false,
}: {
  card: PlainEnglishCard;
  layout: LayoutMode;
  isFocus?: boolean;
}) {
  const stacked = layout === "stacked";
  const hasCode = card.code.trim().length > 0;

  const pythonBlock = (
    <div>
      <p
        className={[
          "border-b border-[var(--border)] bg-[var(--surface-2)]/80 font-bold tracking-wide text-[var(--muted)] uppercase",
          isFocus ? "px-5 py-3 text-sm sm:px-6" : "px-4 py-2 text-xs sm:px-5",
        ].join(" ")}
      >
        Python
      </p>
      <pre
        className={[
          "overflow-auto bg-[var(--code-bg)] leading-[1.65]",
          isFocus
            ? "max-h-[min(36rem,72vh)] p-5 text-sm sm:p-6 sm:text-[15px]"
            : "max-h-[min(28rem,70vh)] p-4 text-[13px] sm:p-5 sm:text-sm",
        ].join(" ")}
      >
        <code className="font-mono text-[var(--code-fg)] [tab-size:2]">{card.code}</code>
      </pre>
      {hasCode ? (
        <div className="px-2 pb-2 sm:px-3">
          <CodeRetypePractice
            expectedCode={card.code}
            title={card.title}
            storageKey={`plain-english-${card.id}`}
            source="plainEnglish"
          />
        </div>
      ) : null}
    </div>
  );

  const englishBlock = (
    <>
      <p
        className={[
          "border-b border-[var(--border)] bg-[var(--surface-2)]/80 font-bold tracking-wide text-[var(--muted)] uppercase",
          isFocus ? "px-5 py-3 text-sm sm:px-6" : "px-4 py-2 text-xs sm:px-5",
        ].join(" ")}
      >
        Plain English
      </p>
      <ul
        className={[
          "space-y-3 text-[var(--muted)]",
          isFocus
            ? "p-5 text-base leading-relaxed sm:p-6 sm:text-lg"
            : "p-4 text-[15px] leading-relaxed sm:p-5 sm:text-base sm:leading-relaxed",
        ].join(" ")}
      >
        {card.bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
              aria-hidden
            />
            <span className="min-w-0 text-[var(--text)]">{b}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (stacked) {
    return (
      <div className="flex flex-col">
        <div className="border-b border-[var(--border)]">{pythonBlock}</div>
        <div>{englishBlock}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-0 lg:grid-cols-2 lg:gap-0">
      <div className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">{pythonBlock}</div>
      <div>{englishBlock}</div>
    </div>
  );
}

export function PythonInPlainEnglishPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const sections = useMemo(() => {
    let n = 0;
    return getPlainEnglishCardsGrouped().map(({ level, cards: levelCards }) => ({
      level,
      items: levelCards.map((card) => ({ card, number: ++n })),
    }));
  }, []);

  const flatItems = useMemo(() => {
    const out: { card: PlainEnglishCard; number: number }[] = [];
    for (const s of sections) {
      for (const item of s.items) out.push(item);
    }
    return out;
  }, [sections]);

  const cardIndexById = useMemo(() => {
    const m = new Map<string, number>();
    flatItems.forEach((item, i) => m.set(item.card.id, i));
    return m;
  }, [flatItems]);

  const [layout, setLayout] = useState<LayoutMode>(() => readStoredLayout());
  /** Index into `flatItems` while stepping with arrows; null = not stepping. */
  const [browseIndex, setBrowseIndex] = useState<number | null>(null);
  const [animationIndex, setAnimationIndex] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("typingCode");
  const [animationChars, setAnimationChars] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(80);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [animationPlaybackMode, setAnimationPlaybackMode] = useState<AnimationPlaybackMode>("auto");
  const [manualAnimationPanel, setManualAnimationPanel] = useState<ManualAnimationPanel>("code");
  const [showAnimationHelp, setShowAnimationHelp] = useState(false);
  const [animationZoom, setAnimationZoom] = useState(100);
  const [jumpInput, setJumpInput] = useState("");
  const [animationJumpInput, setAnimationJumpInput] = useState("");

  useEffect(() => {
    try {
      sessionStorage.setItem(LAYOUT_STORAGE_KEY, layout);
    } catch {
      /* ignore */
    }
  }, [layout]);

  /** Open step mode from URL hash (e.g. shared links from search). */
  useEffect(() => {
    const id = location.hash.replace(/^#/, "").trim();
    if (!id) return;
    const i = flatItems.findIndex(({ card }) => card.id === id);
    if (i >= 0) setBrowseIndex(i);
  }, [flatItems, location.hash]);

  /** Allow deep-linking into animation mode from homepage CTA. */
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    if (mode !== "animation") return;
    if (!flatItems.length) return;
    if (animationIndex !== null || browseIndex !== null) return;
    setAnimationIndex(0);
    setAnimationPhase("typingCode");
    setAnimationChars(0);
  }, [animationIndex, browseIndex, flatItems, location.search]);

  /** Lock page scroll while focus mode (full-screen card) is open. */
  useEffect(() => {
    if (browseIndex === null && animationIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [animationIndex, browseIndex]);

  /** Keep the URL hash in sync while stepping (React Router + no extra history entries). */
  useEffect(() => {
    if (browseIndex === null) return;
    const id = flatItems[browseIndex]?.card.id;
    if (!id) return;
    if (location.hash === `#${id}`) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: id },
      { replace: true, preventScrollReset: true },
    );
  }, [browseIndex, flatItems, location.hash, location.pathname, location.search, navigate]);

  const exitFocusMode = useCallback(() => {
    setBrowseIndex((prev) => {
      if (prev != null) {
        const id = flatItems[prev]?.card.id;
        if (id) {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
      }
      return null;
    });
    navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
  }, [flatItems, location.pathname, location.search, navigate]);

  const exitAnimationMode = useCallback(() => {
    setAnimationIndex((prev) => {
      if (prev != null) {
        const id = flatItems[prev]?.card.id;
        if (id) {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
      }
      return null;
    });
    setAnimationPhase("typingCode");
    setAnimationChars(0);
    navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
  }, [flatItems, location.pathname, location.search, navigate]);

  const applyJumpToSlide = useCallback(() => {
    const parsed = Number.parseInt(jumpInput.trim(), 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(1, Math.min(flatItems.length, parsed));
    setBrowseIndex(clamped - 1);
    setJumpInput(String(clamped));
  }, [flatItems.length, jumpInput]);

  const applyAnimationJumpToSlide = useCallback(() => {
    const parsed = Number.parseInt(animationJumpInput.trim(), 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(1, Math.min(flatItems.length, parsed));
    setAnimationIndex(clamped - 1);
    setAnimationJumpInput(String(clamped));
  }, [animationJumpInput, flatItems.length]);

  const onArticleBackgroundClick = useCallback(
    (globalIndex: number, e: React.MouseEvent) => {
      if (isPlainEnglishInteractiveTarget(e.target)) return;
      setBrowseIndex(globalIndex);
    },
    [],
  );

  const focusModeActive = browseIndex !== null;
  const animationModeActive = animationIndex !== null;
  const animationCard = animationIndex !== null ? flatItems[animationIndex]?.card : undefined;
  const animationEnglishText = animationCard ? animationCard.bullets.map((b) => `- ${b}`).join("\n") : "";
  const animationShowingEnglish =
    animationPlaybackMode === "manual"
      ? manualAnimationPanel === "english"
      : animationPhase === "typingEnglish" || animationPhase === "holdEnglish";
  const animationPanelMaxWidthPx = Math.round(980 * (animationZoom / 100));
  const animationPanelFontPx = Math.max(13, Math.round(15 * (animationZoom / 100)));

  useEffect(() => {
    if (browseIndex === null) return;
    setJumpInput(String(browseIndex + 1));
  }, [browseIndex]);

  useEffect(() => {
    if (animationIndex === null) return;
    setAnimationJumpInput(String(animationIndex + 1));
  }, [animationIndex]);

  useEffect(() => {
    if (!focusModeActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (shouldIgnoreCardStepArrows()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        exitFocusMode();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setBrowseIndex((i) => {
          if (i === null) return 0;
          return Math.min(flatItems.length - 1, i + 1);
        });
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setBrowseIndex((i) => {
          if (i === null) return 0;
          return Math.max(0, i - 1);
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitFocusMode, flatItems.length, focusModeActive]);

  useEffect(() => {
    if (!animationModeActive || animationIndex === null) return;
    if (animationPlaybackMode === "manual" || animationPaused) return;

    const card = flatItems[animationIndex]?.card;
    if (!card) return;
    const typingDelayMs = Math.max(1, Math.round(220 / animationSpeed));
    const shortHoldMs = Math.max(120, 900 - animationSpeed * 5);
    const longHoldMs = Math.max(220, 1450 - animationSpeed * 7);

    const englishText = card.bullets.map((b) => `- ${b}`).join("\n");
    const activeText = animationPhase === "typingCode" || animationPhase === "holdCode" ? card.code : englishText;
    const isTyping = animationPhase === "typingCode" || animationPhase === "typingEnglish";
    const fullLength = activeText.length;

    if (isTyping && animationChars < fullLength) {
      const timer = window.setTimeout(() => {
        setAnimationChars((n) => n + 1);
      }, typingDelayMs);
      return () => window.clearTimeout(timer);
    }

    if (animationPhase === "typingCode" && animationChars >= fullLength) {
      const timer = window.setTimeout(() => setAnimationPhase("holdCode"), shortHoldMs);
      return () => window.clearTimeout(timer);
    }

    if (animationPhase === "holdCode") {
      const timer = window.setTimeout(() => {
        setAnimationPhase("typingEnglish");
        setAnimationChars(0);
      }, shortHoldMs);
      return () => window.clearTimeout(timer);
    }

    if (animationPhase === "typingEnglish" && animationChars >= fullLength) {
      const timer = window.setTimeout(() => setAnimationPhase("holdEnglish"), shortHoldMs);
      return () => window.clearTimeout(timer);
    }

    if (animationPhase === "holdEnglish") {
      const timer = window.setTimeout(() => {
        setAnimationIndex((i) => {
          if (i === null) return 0;
          return (i + 1) % flatItems.length;
        });
      }, longHoldMs);
      return () => window.clearTimeout(timer);
    }
  }, [
    animationChars,
    animationIndex,
    animationModeActive,
    animationPaused,
    animationPhase,
    animationPlaybackMode,
    animationSpeed,
    flatItems,
  ]);

  useEffect(() => {
    if (animationIndex === null) return;
    setAnimationPhase("typingCode");
    setAnimationChars(0);
    setManualAnimationPanel("code");
    setShowAnimationHelp(false);
  }, [animationIndex]);

  useEffect(() => {
    if (!animationModeActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (shouldIgnoreCardStepArrows()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        exitAnimationMode();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setAnimationIndex((i) => {
          if (i === null) return 0;
          return (i + 1) % flatItems.length;
        });
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setAnimationIndex((i) => {
          if (i === null) return 0;
          return (i - 1 + flatItems.length) % flatItems.length;
        });
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setAnimationPlaybackMode("manual");
        setAnimationPaused(true);
        setManualAnimationPanel((panel) => (panel === "code" ? "english" : "code"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [animationModeActive, exitAnimationMode, flatItems.length]);

  const jsonLd = useMemo(() => {
    const base = getCanonicalBase();
    if (!base) return undefined;
    return [
      breadcrumbJsonLd(base, [
        { name: "Home", path: "/" },
        { name: "All lessons", path: "/learn" },
        { name: "Python in plain English", path: "/learn/python-in-plain-english" },
      ]),
    ];
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <Seo
        title="Python in plain English"
        description="Short Python snippets paired with plain-language bullets—an on-ramp and reading aid alongside the main lesson path, with optional typing practice on each card."
        jsonLd={jsonLd}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link className="font-semibold text-[var(--accent)] no-underline" to="/learn">
              All lessons
            </Link>
          </li>
          <li aria-hidden className="select-none text-[var(--border)]">
            /
          </li>
          <li className="font-medium text-[var(--text)]">Python in plain English</li>
        </ol>
      </nav>

      <header className="mt-6">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Reading aid</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Python in plain English
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Cards ramp from small snippets to busier patterns. The English is about intent and flow, not
            a symbol-by-symbol grammar lesson. Under each Python panel, open{" "}
            <strong className="font-semibold text-[var(--text)]">TYPE</strong> to practice typing the
            snippet with the same check used in lessons. Pick a layout that matches how you like to
            read: two columns on a wide screen, or code first with translation underneath (works well on
            a phone or when you want to read top to bottom).
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">Layout</p>
            <div
              className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm"
              role="group"
              aria-label="How to show code and plain English"
            >
              <button
                type="button"
                onClick={() => setLayout("split")}
                aria-pressed={layout === "split"}
                className={[
                  "rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm",
                  layout === "split"
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                Side by side
              </button>
              <button
                type="button"
                onClick={() => setLayout("stacked")}
                aria-pressed={layout === "stacked"}
                className={[
                  "rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm",
                  layout === "stacked"
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                Stacked (code first)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBrowseIndex(0)}
              title="One card at a time, full screen. Arrow keys to step, Esc to exit. You can also open focus mode by clicking a card (outside TYPE and other controls)."
              aria-label="Open focus mode from the first card. Full screen, one translation at a time. Arrow keys to move, Escape to exit."
              className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-full bg-[var(--text)] px-4 text-sm font-semibold text-[var(--bg)] shadow-md transition hover:opacity-95 sm:self-center sm:px-5"
            >
              Focus mode
            </button>
            <button
              type="button"
            onClick={() => {
              setAnimationPlaybackMode("auto");
              setAnimationPaused(false);
              setManualAnimationPanel("code");
              setAnimationIndex(0);
            }}
              title="Autoplay typewriter: code first, then plain English translation."
              aria-label="Open animation mode with typewriter playback."
              className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--surface-2)] sm:self-center sm:px-5"
            >
              Animation mode
            </button>
          </div>
        </div>
      </header>

      <div className="mt-12 space-y-14 sm:space-y-16">
        {sections.map(({ level, items }) => (
          <section key={level} aria-labelledby={`level-${level}-heading`}>
            <h2
              id={`level-${level}-heading`}
              className="border-b border-[var(--border)] pb-3 font-serif text-2xl font-semibold tracking-tight text-[var(--text)]"
            >
              {plainEnglishLevelLabel[level]}
              <span className="ml-2 text-base font-normal text-[var(--muted)]">
                (level {level} of 3)
              </span>
            </h2>
            <div className="mt-8 space-y-10 sm:space-y-12">
              {items.map(({ card, number: n }) => {
                const globalIndex = cardIndexById.get(card.id) ?? 0;
                const isBrowseActive = browseIndex !== null && browseIndex === globalIndex;
                return (
                <article
                  id={card.id}
                  key={card.id}
                  onClick={(e) => onArticleBackgroundClick(globalIndex, e)}
                  className={[
                    "cursor-pointer overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow dark:ring-white/10",
                    isBrowseActive
                      ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)] dark:ring-offset-[var(--bg)]"
                      : "ring-1 ring-black/5 hover:ring-[var(--accent)]/25",
                  ].join(" ")}
                  aria-labelledby={`plain-${card.id}-title`}
                  aria-current={isBrowseActive ? "true" : undefined}
                >
                  <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:px-5">
                    <p className="font-mono text-xs font-semibold text-[var(--accent)]">
                      {String(n).padStart(2, "0")}
                    </p>
                    <h3
                      id={`plain-${card.id}-title`}
                      className="mt-1 font-serif text-lg font-semibold tracking-tight text-[var(--text)] sm:text-xl"
                    >
                      {card.title}
                    </h3>
                  </div>
                  <CodeAndEnglish card={card} layout={layout} />
                </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {browseIndex !== null && flatItems[browseIndex] && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="plain-english-focus-title"
              className="fixed inset-0 z-[200] flex flex-col bg-[var(--bg)] text-[var(--text)]"
            >
              <p className="sr-only" aria-live="polite">
                Card {browseIndex + 1} of {flatItems.length}: {flatItems[browseIndex].card.title}
              </p>
              <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                    Python in plain English · Focus
                  </p>
                  <h2
                    id="plain-english-focus-title"
                    className="mt-0.5 truncate font-serif text-lg font-semibold tracking-tight sm:text-xl"
                  >
                    {flatItems[browseIndex].card.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs font-semibold text-[var(--accent)]">
                    {String(flatItems[browseIndex].number).padStart(2, "0")} · {browseIndex + 1} of{" "}
                    {flatItems.length}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <div
                    className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5 shadow-sm"
                    role="group"
                    aria-label="Layout in focus mode"
                  >
                    <button
                      type="button"
                      onClick={() => setLayout("split")}
                      aria-pressed={layout === "split"}
                      className={[
                        "rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs",
                        layout === "split"
                          ? "bg-[var(--text)] text-[var(--bg)]"
                          : "text-[var(--muted)] hover:text-[var(--text)]",
                      ].join(" ")}
                    >
                      Side by side
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayout("stacked")}
                      aria-pressed={layout === "stacked"}
                      className={[
                        "rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs",
                        layout === "stacked"
                          ? "bg-[var(--text)] text-[var(--bg)]"
                          : "text-[var(--muted)] hover:text-[var(--text)]",
                      ].join(" ")}
                    >
                      Stacked
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={exitFocusMode}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)] sm:text-sm"
                  >
                    Exit
                  </button>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto flex min-h-full w-full max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                  <article className="w-full max-w-6xl overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                    <div className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:px-5">
                      <p className="font-mono text-xs font-semibold text-[var(--accent)]">
                        {String(flatItems[browseIndex].number).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">
                        {flatItems[browseIndex].card.title}
                      </h3>
                    </div>
                    <CodeAndEnglish card={flatItems[browseIndex].card} layout={layout} isFocus />
                  </article>
                </div>
              </div>

              <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-md sm:px-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex gap-2 sm:flex-1">
                    <button
                      type="button"
                      className="min-h-11 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface)] disabled:opacity-40"
                      onClick={() => setBrowseIndex((i) => (i === null ? 0 : Math.max(0, i - 1)))}
                      disabled={browseIndex <= 0}
                      aria-label="Previous card"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="min-h-11 flex-1 rounded-full bg-[var(--text)] py-3 text-sm font-bold text-[var(--bg)] transition hover:opacity-95 disabled:opacity-40"
                      onClick={() =>
                        setBrowseIndex((i) => (i === null ? 0 : Math.min(flatItems.length - 1, i + 1)))
                      }
                      disabled={browseIndex >= flatItems.length - 1}
                      aria-label="Next card"
                    >
                      Next →
                    </button>
                  </div>
                  <div className="flex flex-col items-stretch gap-2 sm:w-auto sm:min-w-[15rem] sm:items-end">
                    <label
                      htmlFor="focus-jump-input"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-semibold text-[var(--muted)]"
                    >
                      <span>Slide</span>
                      <input
                        id="focus-jump-input"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={flatItems.length}
                        value={jumpInput}
                        onChange={(e) => setJumpInput(e.target.value)}
                        onBlur={applyJumpToSlide}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyJumpToSlide();
                          }
                        }}
                        className="h-8 w-16 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 text-center text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                        aria-label={`Slide number from 1 to ${flatItems.length}`}
                      />
                      <span className="font-mono text-xs text-[var(--text)]">/ {flatItems.length}</span>
                    </label>
                    <p className="text-center text-[11px] leading-snug text-[var(--muted)] sm:text-right sm:text-xs">
                      Arrow keys · Esc exits · not while typing in TYPE
                    </p>
                  </div>
                </div>
              </footer>
            </div>,
            document.body,
          )
        : null}

      {animationIndex !== null && flatItems[animationIndex] && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="plain-english-animation-title"
              className="fixed inset-0 z-[210] flex flex-col bg-[var(--bg)] text-[var(--text)]"
            >
              <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                    Python in plain English · Animation
                  </p>
                  <h2
                    id="plain-english-animation-title"
                    className="mt-0.5 truncate font-serif text-lg font-semibold tracking-tight sm:text-xl"
                  >
                    {flatItems[animationIndex].card.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs font-semibold text-[var(--accent)]">
                    {String(flatItems[animationIndex].number).padStart(2, "0")} · {animationIndex + 1} of{" "}
                    {flatItems.length}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={exitAnimationMode}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)] sm:text-sm"
                  >
                    Exit
                  </button>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                  <article
                    className="w-full overflow-hidden rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                    style={{ maxWidth: `${animationPanelMaxWidthPx}px` }}
                  >
                    <p className="border-b border-[var(--border)] bg-[var(--surface-2)]/80 px-5 py-3 text-sm font-bold tracking-wide text-[var(--muted)] uppercase sm:px-6">
                      {animationPlaybackMode === "manual"
                        ? manualAnimationPanel === "code"
                          ? "Python"
                          : "Plain English"
                        : animationPhase === "typingCode" || animationPhase === "holdCode"
                          ? "Python"
                          : "Plain English"}
                    </p>
                    <pre
                      className={[
                        "max-h-[min(70vh,40rem)] bg-[var(--code-bg)] p-5 text-[15px] leading-[1.75] sm:p-6 sm:text-base",
                        animationShowingEnglish ? "overflow-y-auto overflow-x-hidden" : "overflow-auto",
                      ].join(" ")}
                      style={{ fontSize: `${animationPanelFontPx}px` }}
                    >
                      <code
                        className={[
                          "font-mono text-[var(--code-fg)] [tab-size:2]",
                          animationShowingEnglish ? "whitespace-pre-wrap break-words" : "",
                        ].join(" ")}
                      >
                        {animationCard
                          ? (() => {
                              if (animationPlaybackMode === "manual") {
                                return manualAnimationPanel === "code"
                                  ? animationCard.code
                                  : animationEnglishText;
                              }
                              const activeText =
                                animationPhase === "typingCode" || animationPhase === "holdCode"
                                  ? animationCard.code
                                  : animationEnglishText;
                              return activeText.slice(0, animationChars);
                            })()
                          : ""}
                        <span className="animate-pulse text-[var(--accent)]">|</span>
                      </code>
                    </pre>
                  </article>
                </div>
              </div>

              <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-md sm:px-6">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5">
                  <div className="relative flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-2 sm:flex-nowrap sm:px-3">
                    <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAnimationPlaybackMode("auto");
                          setAnimationPaused(false);
                        }}
                        className={[
                          "rounded-full px-3 py-1.5 text-xs font-bold transition",
                          animationPlaybackMode === "auto"
                            ? "bg-[var(--text)] text-[var(--bg)]"
                            : "text-[var(--muted)] hover:text-[var(--text)]",
                        ].join(" ")}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAnimationPlaybackMode("manual");
                          setAnimationPaused(true);
                          setAnimationChars(0);
                          setAnimationPhase("typingCode");
                        }}
                        className={[
                          "rounded-full px-3 py-1.5 text-xs font-bold transition",
                          animationPlaybackMode === "manual"
                            ? "bg-[var(--text)] text-[var(--bg)]"
                            : "text-[var(--muted)] hover:text-[var(--text)]",
                        ].join(" ")}
                      >
                        Manual
                      </button>
                    </div>

                    <label className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] sm:text-sm">
                      Speed
                      <input
                        type="range"
                        min={2}
                        max={120}
                        step={1}
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                        className="w-20 accent-[var(--accent)]"
                        aria-label="Animation typing speed where higher is faster"
                      />
                      <span className="font-mono text-[var(--text)]">{animationSpeed}</span>
                    </label>

                    {animationPlaybackMode === "auto" ? (
                      <button
                        type="button"
                        onClick={() => setAnimationPaused((p) => !p)}
                        className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)] sm:text-sm"
                      >
                        {animationPaused ? "Play" : "Pause"}
                      </button>
                    ) : (
                      <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5">
                        <button
                          type="button"
                          onClick={() => setManualAnimationPanel("code")}
                          className={[
                            "rounded-full px-3 py-1.5 text-xs font-bold transition",
                            manualAnimationPanel === "code"
                              ? "bg-[var(--text)] text-[var(--bg)]"
                              : "text-[var(--muted)] hover:text-[var(--text)]",
                          ].join(" ")}
                        >
                          Python
                        </button>
                        <button
                          type="button"
                          onClick={() => setManualAnimationPanel("english")}
                          className={[
                            "rounded-full px-3 py-1.5 text-xs font-bold transition",
                            manualAnimationPanel === "english"
                              ? "bg-[var(--text)] text-[var(--bg)]"
                              : "text-[var(--muted)] hover:text-[var(--text)]",
                          ].join(" ")}
                        >
                          English
                        </button>
                      </div>
                    )}

                    {animationPlaybackMode === "auto" ? (
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-2)] sm:text-sm"
                        onClick={() => {
                          if (!animationCard) return;
                          if (animationPhase === "typingCode" || animationPhase === "holdCode") {
                            setAnimationPhase("typingEnglish");
                            setAnimationChars(0);
                            return;
                          }
                          setAnimationChars(animationEnglishText.length);
                          setAnimationPhase("holdEnglish");
                        }}
                        aria-label="Skip current typing phase"
                      >
                        Skip typing
                      </button>
                    ) : null}
                    <label
                      htmlFor="animation-jump-input"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] sm:text-sm"
                    >
                      <span>Slide</span>
                      <input
                        id="animation-jump-input"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={flatItems.length}
                        value={animationJumpInput}
                        onChange={(e) => setAnimationJumpInput(e.target.value)}
                        onBlur={applyAnimationJumpToSlide}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyAnimationJumpToSlide();
                          }
                        }}
                        className="h-7 w-14 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 text-center text-xs text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 sm:h-8 sm:w-16 sm:text-sm"
                        aria-label={`Animation slide number from 1 to ${flatItems.length}`}
                      />
                      <span className="font-mono text-[11px] text-[var(--text)] sm:text-xs">/ {flatItems.length}</span>
                    </label>
                    <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5">
                      <button
                        type="button"
                        onClick={() => setAnimationZoom((z) => Math.max(80, z - 10))}
                        className="rounded-full px-2.5 py-1.5 text-xs font-bold text-[var(--muted)] transition hover:text-[var(--text)]"
                        aria-label="Zoom out animation panel"
                      >
                        A-
                      </button>
                      <span className="px-1 text-[11px] font-mono text-[var(--text)]">{animationZoom}%</span>
                      <button
                        type="button"
                        onClick={() => setAnimationZoom((z) => Math.min(140, z + 10))}
                        className="rounded-full px-2.5 py-1.5 text-xs font-bold text-[var(--muted)] transition hover:text-[var(--text)]"
                        aria-label="Zoom in animation panel"
                      >
                        A+
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAnimationHelp((v) => !v)}
                      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--muted)] transition hover:text-[var(--text)]"
                      aria-label="Show animation controls help"
                      aria-expanded={showAnimationHelp}
                    >
                      i
                    </button>
                    {showAnimationHelp ? (
                      <div className="absolute -top-2 right-2 z-20 w-72 -translate-y-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--muted)] shadow-xl">
                        <p className="font-semibold text-[var(--text)]">Animation controls</p>
                        <ul className="mt-2 space-y-1.5 leading-relaxed">
                          <li>
                            <span className="font-semibold text-[var(--text)]">Auto/Manual:</span> autoplay
                            typing or static view.
                          </li>
                          <li>
                            <span className="font-semibold text-[var(--text)]">Speed:</span> higher means faster
                            typing in Auto.
                          </li>
                          <li>
                            <span className="font-semibold text-[var(--text)]">Pause:</span> pause and resume
                            autoplay.
                          </li>
                          <li>
                            <span className="font-semibold text-[var(--text)]">Skip typing:</span> jump to next
                            phase on current card.
                          </li>
                          <li>
                            <span className="font-semibold text-[var(--text)]">Slide:</span> type number and
                            press Enter.
                          </li>
                        </ul>
                        <p className="mt-3 font-semibold text-[var(--text)]">Keyboard shortcuts</p>
                        <ul className="mt-2 space-y-1.5 leading-relaxed">
                          <li>
                            <span className="font-semibold text-[var(--text)]">← / →</span>: previous / next card
                          </li>
                          <li>
                            <span className="font-semibold text-[var(--text)]">↑ / ↓</span>: toggle Python and
                            English (switches to Manual)
                          </li>
                          <li>
                            <span className="font-semibold text-[var(--text)]">Esc</span>: exit animation mode
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex w-full max-w-3xl gap-2">
                    <button
                      type="button"
                      className="min-h-11 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface)]"
                      onClick={() =>
                        setAnimationIndex((i) => {
                          if (i === null) return 0;
                          return (i - 1 + flatItems.length) % flatItems.length;
                        })
                      }
                      aria-label="Previous animation card"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      className="min-h-11 flex-1 rounded-full bg-[var(--text)] py-3 text-sm font-bold text-[var(--bg)] transition hover:opacity-95"
                      onClick={() =>
                        setAnimationIndex((i) => {
                          if (i === null) return 0;
                          return (i + 1) % flatItems.length;
                        })
                      }
                      aria-label="Next animation card"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </footer>
            </div>,
            document.body,
          )
        : null}

      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
        You can TYPE any card on this page from the Python column. For lesson-sized examples, use
        retype practice under each code block in lessons, or drill terms on{" "}
        <Link className="font-semibold text-[var(--accent)] no-underline hover:underline" to="/learn/flashcards">
          flashcards
        </Link>
        .
      </p>
    </div>
  );
}
