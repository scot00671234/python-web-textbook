import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import {
  DEFAULT_PLAYGROUND_CHALLENGE_ID,
  getPlaygroundChallenge,
  PLAYGROUND_CHALLENGES,
  type PlaygroundChallenge,
} from "../content/playgroundChallenges";
import { ensurePyodide, PYODIDE_VERSION } from "../lib/pyodideSingleton";
import { evaluatePlaygroundRun, type CheckOutcome } from "../lib/playgroundCheck";
import { friendlyPlaygroundError } from "../lib/playgroundFriendlyError";
import { getCanonicalBase } from "../lib/site";
import { breadcrumbJsonLd } from "../lib/structuredData";

const STORAGE_ACTIVE = "pylearn-playground-active-challenge";
const STORAGE_DONE = "pylearn-playground-done";

function readActiveChallengeId(): string {
  if (typeof window === "undefined") return DEFAULT_PLAYGROUND_CHALLENGE_ID;
  try {
    const id = window.localStorage.getItem(STORAGE_ACTIVE);
    if (id && PLAYGROUND_CHALLENGES.some((c) => c.id === id)) {
      return id;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PLAYGROUND_CHALLENGE_ID;
}

function readCodeDraft(challengeId: string, starter: string): string {
  if (typeof window === "undefined") return starter;
  try {
    const saved = window.localStorage.getItem(`pylearn-playground-code-${challengeId}`);
    if (saved != null && saved.trim() !== "") {
      return saved;
    }
  } catch {
    /* ignore */
  }
  return starter;
}

function readDoneIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_DONE);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function persistDoneIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_DONE, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

type LoadState = "idle" | "loading" | "ready" | "error";

const CATEGORY_ORDER = ["Warm-up", "Logic", "Data", "Stdlib"] as const;

export function PythonPlaygroundPage() {
  const editorId = useId();
  const [challengeId, setChallengeId] = useState(readActiveChallengeId);
  const challenge = useMemo(() => getPlaygroundChallenge(challengeId), [challengeId]);

  const [code, setCode] = useState(() =>
    readCodeDraft(readActiveChallengeId(), getPlaygroundChallenge(readActiveChallengeId()).starterCode),
  );
  const [hintsOpen, setHintsOpen] = useState(0);
  /** Whether the hint list is expanded (hints stay “unlocked” when collapsed). */
  const [hintsVisible, setHintsVisible] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [lastCheck, setLastCheck] = useState<CheckOutcome | null>(null);

  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [runState, setRunState] = useState<"idle" | "running">("idle");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [doneIds, setDoneIds] = useState(readDoneIds);

  const pyodideRef = useRef<Awaited<ReturnType<typeof ensurePyodide>> | null>(null);

  const groupedChallenges = useMemo(() => {
    const map = new Map<string, PlaygroundChallenge[]>();
    for (const c of PLAYGROUND_CHALLENGES) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return CATEGORY_ORDER.map((cat) => {
      const items = [...(map.get(cat) ?? [])];
      items.sort((a, b) => {
        if (a.id === "free-canvas") return 1;
        if (b.id === "free-canvas") return -1;
        return 0;
      });
      return { category: cat, items };
    }).filter((g) => g.items.length > 0);
  }, []);

  const scoredMissions = useMemo(
    () => PLAYGROUND_CHALLENGES.filter((c) => c.successCheck.kind !== "manual"),
    [],
  );
  const passedScoredCount = useMemo(
    () => scoredMissions.filter((c) => doneIds.has(c.id)).length,
    [scoredMissions, doneIds],
  );

  const stderrFriendly = useMemo(() => friendlyPlaygroundError(stderr), [stderr]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_ACTIVE, challengeId);
    } catch {
      /* ignore */
    }
  }, [challengeId]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(`pylearn-playground-code-${challengeId}`, code);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [code, challengeId]);

  const pickChallenge = useCallback(
    (id: string) => {
      if (id === challengeId) return;
      try {
        window.localStorage.setItem(`pylearn-playground-code-${challengeId}`, code);
        window.localStorage.setItem(STORAGE_ACTIVE, id);
      } catch {
        /* ignore */
      }
      const next = getPlaygroundChallenge(id);
      setChallengeId(id);
      setCode(readCodeDraft(id, next.starterCode));
      setHintsOpen(0);
      setHintsVisible(true);
      setShowSolution(false);
      setLastCheck(null);
      setStdout("");
      setStderr("");
    },
    [challengeId, code],
  );

  const loadStarter = useCallback(() => {
    setCode(challenge.starterCode);
    setLastCheck(null);
    setStdout("");
    setStderr("");
  }, [challenge.starterCode]);

  const preload = useCallback(async () => {
    if (loadState === "ready" || loadState === "loading") return;
    setLoadState("loading");
    setLoadError(null);
    try {
      const py = await ensurePyodide();
      pyodideRef.current = py;
      setLoadState("ready");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLoadError(msg);
      setLoadState("error");
    }
  }, [loadState]);

  const run = useCallback(async () => {
    setStdout("");
    setStderr("");
    setLastCheck(null);

    if (loadState !== "ready") {
      setLoadState("loading");
      setLoadError(null);
    }

    setRunState("running");
    try {
      let py = pyodideRef.current;
      if (!py) {
        py = await ensurePyodide();
        pyodideRef.current = py;
        setLoadState("ready");
      }

      const outChunks: string[] = [];
      const errChunks: string[] = [];

      py.setStdout({
        batched: (s: string) => {
          outChunks.push(s);
        },
      });
      py.setStderr({
        batched: (s: string) => {
          errChunks.push(s);
        },
      });

      try {
        await py.runPythonAsync(code);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errChunks.push(msg);
        if (!(e instanceof Error) || !msg.endsWith("\n")) {
          errChunks.push("\n");
        }
      }

      const out = outChunks.join("");
      const err = errChunks.join("");
      setStdout(out);
      setStderr(err);

      const outcome = evaluatePlaygroundRun(out, err, challenge.successCheck);
      setLastCheck(outcome);

      if (outcome === "pass" && challenge.id !== "free-canvas") {
        setDoneIds((prev) => {
          if (prev.has(challenge.id)) return prev;
          const next = new Set(prev);
          next.add(challenge.id);
          persistDoneIds(next);
          return next;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLoadError(msg);
      setLoadState("error");
      setStderr(msg);
      setLastCheck("fail");
    } finally {
      setRunState("idle");
    }
  }, [code, loadState, challenge]);

  const revealNextHint = useCallback(() => {
    setHintsOpen((n) => Math.min(n + 1, challenge.hints.length));
    setHintsVisible(true);
  }, [challenge.hints.length]);

  const base = getCanonicalBase();
  const jsonLd = base
    ? [
        breadcrumbJsonLd(base, [
          { name: "Home", path: "/" },
          { name: "All lessons", path: "/learn" },
          { name: "Python playground", path: "/learn/playground" },
        ]),
      ]
    : undefined;

  const busy = loadState === "loading" || runState === "running";

  return (
    <div className="py-8 lg:py-10">
      <Seo
        title="Python playground"
        description="Run real Python in the browser with guided mini-missions, hints, and gentle checks. Practice next to pylearn lessons."
        jsonLd={jsonLd}
      />

      <div className="max-w-6xl">
        <p className="text-sm font-semibold text-[var(--accent)]">
          <Link to="/learn" className="no-underline hover:underline">
            All lessons
          </Link>
          <span className="text-[var(--muted)]"> / </span>
          <span className="text-[var(--text)]">Playground</span>
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Python playground
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--muted)]">
          This page runs{" "}
          <span className="font-semibold text-[var(--text)]">real Python</span> through{" "}
          <a href="https://pyodide.org/" target="_blank" rel="noreferrer">
            Pyodide
          </a>{" "}
          {PYODIDE_VERSION} (CPython built for WebAssembly) in your browser. Choose a{" "}
          <span className="font-medium text-[var(--text)]">mini-mission</span> for a clear goal, or open{" "}
          <span className="font-medium text-[var(--text)]">Free canvas</span> to experiment. Lessons still use
          type-along mode; this is where you run full programs.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-6xl xl:grid xl:max-w-[1180px] xl:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] xl:items-start xl:gap-8">
        <aside className="mb-6 xl:sticky xl:top-24 xl:mb-0 xl:self-start">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 sm:px-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Missions</p>
              <p className="tabular-nums text-xs font-medium text-[var(--text)]" aria-live="polite">
                <span className="text-[var(--muted)]">Passed </span>
                {passedScoredCount}/{scoredMissions.length}
              </p>
            </div>
            <p className="border-b border-[var(--border)] px-3 py-2 text-xs leading-snug text-[var(--muted)] sm:px-4">
              Choose a goal, then scroll down to the editor on smaller screens.
            </p>
            <nav
              className="max-h-[min(40vh,300px)] space-y-3 overflow-y-auto overscroll-y-contain p-2 sm:p-3 xl:max-h-[min(70vh,600px)]"
              aria-label="Playground missions"
            >
              {groupedChallenges.map(({ category, items }) => (
                <div key={category}>
                  <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{category}</p>
                  <ul className="mt-1.5 space-y-1">
                    {items.map((c) => {
                      const active = c.id === challengeId;
                      const done = doneIds.has(c.id);
                      return (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => pickChallenge(c.id)}
                            className={[
                              "flex w-full items-center gap-1.5 rounded-lg border px-2.5 py-2 text-left text-xs transition sm:text-[13px]",
                              active
                                ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_14%,var(--surface))] font-semibold text-[var(--text)] shadow-sm"
                                : "border-transparent bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--text)]",
                            ].join(" ")}
                          >
                            <span className="min-w-0 flex-1 leading-snug">{c.title}</span>
                            {done ? (
                              <span className="shrink-0 text-sm text-[var(--callout-tip-border)]" title="Passed check">
                                ✓
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <p className="mt-4 hidden text-xs leading-relaxed text-[var(--muted)] xl:block">
            New to Python? Start with{" "}
            <Link to="/learn/first-program" className="font-medium text-[var(--text)]">
              First program
            </Link>{" "}
            in the main lessons.
          </p>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <section
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10"
            aria-labelledby="playground-mission-title"
          >
            <header className="border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{challenge.category}</p>
              <h2
                id="playground-mission-title"
                className="mt-1 font-serif text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl"
              >
                {challenge.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{challenge.blurb}</p>
            </header>
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Your goal</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--text)]">
                  {challenge.objectives.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border-2 border-[color-mix(in_oklab,var(--accent)_28%,var(--border))] bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--accent)_8%)] p-4 shadow-sm dark:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))]">
                <p className="text-sm font-semibold text-[var(--text)]">Need help?</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                  Same mission, same place every time: hints and a sample answer are in this box. The code editor is directly
                  below.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    type="button"
                    onClick={() => setShowSolution((s) => !s)}
                    className={
                      showSolution
                        ? "inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                        : "inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] shadow-sm transition hover:opacity-90"
                    }
                  >
                    {showSolution ? "Hide sample answer" : "Peek sample answer"}
                  </button>
                  <button
                    type="button"
                    onClick={revealNextHint}
                    disabled={hintsOpen >= challenge.hints.length}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {hintsOpen >= challenge.hints.length
                      ? "All hints open"
                      : hintsOpen === 0
                        ? "Show first hint"
                        : `Next hint (${hintsOpen}/${challenge.hints.length})`}
                  </button>
                  {hintsOpen > 0 ? (
                    <button
                      type="button"
                      onClick={() => setHintsVisible((v) => !v)}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                    >
                      {hintsVisible ? "Hide hints" : `Show hints (${hintsOpen})`}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={loadStarter}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-[var(--muted)] underline decoration-dotted underline-offset-4 transition hover:text-[var(--text)]"
                  >
                    Reset to starter code
                  </button>
                </div>
                {challenge.successCheck.kind !== "manual" ? (
                  <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--muted)]">
                    Auto-check runs on <span className="font-medium text-[var(--text)]">Standard output</span> only when{" "}
                    <span className="font-medium text-[var(--text)]">Errors / stderr</span> is empty.
                  </p>
                ) : null}
              </div>

            {showSolution ? (
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 shadow-inner">
                <p className="text-xs font-semibold text-[var(--code-fg)]/80">Sample answer (many solutions are valid)</p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--code-fg)]">
                  {challenge.solutionCode}
                </pre>
              </div>
            ) : null}

            {hintsOpen > 0 && hintsVisible ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--callout-note-border)] bg-[var(--callout-note-bg)]">
                <div className="flex items-center justify-between gap-2 border-b border-[var(--callout-note-border)] px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Hints</span>
                  <button
                    type="button"
                    onClick={() => setHintsVisible(false)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--accent)] transition hover:bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
                    aria-label="Hide hints"
                  >
                    Hide
                  </button>
                </div>
                <ul className="space-y-2 p-3 text-sm leading-relaxed text-[var(--text)]">
                  {challenge.hints.slice(0, hintsOpen).map((h, i) => (
                    <li key={i}>
                      <span className="font-semibold text-[var(--accent)]">Hint {i + 1}. </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {hintsOpen > 0 && !hintsVisible ? (
              <p className="mt-3 text-sm text-[var(--muted)]">
                {hintsOpen} hint{hintsOpen === 1 ? "" : "s"} hidden.{" "}
                <button
                  type="button"
                  onClick={() => setHintsVisible(true)}
                  className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                >
                  Show hints
                </button>
              </p>
            ) : null}

            {lastCheck === "pass" ? (
              <p className="mt-3 rounded-lg border border-[var(--callout-tip-border)] bg-[var(--callout-tip-bg)] px-3 py-2 text-sm font-medium text-[var(--text)]">
                Nice work: output matches this mission’s goal. Try the next mini-mission when you are ready.
              </p>
            ) : null}
            {lastCheck === "fail" ? (
              <p className="mt-3 rounded-lg border border-[var(--callout-warn-border)] bg-[var(--callout-warn-bg)] px-3 py-2 text-sm text-[var(--text)]">
                Not quite yet: fix any error first, then compare your output to the objectives. Use another hint or the
                sample answer if you are stuck.
              </p>
            ) : null}
            {lastCheck === "skip" &&
            runState === "idle" &&
            challenge.id === "free-canvas" &&
            !stderr.trim() &&
            stdout.trim() ? (
              <p className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--muted)]">
                Free canvas: no auto-check here. Experiment freely or pick a mini-mission for a concrete target.
              </p>
            ) : null}
            </div>
          </section>

          <section
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md ring-1 ring-black/5 dark:ring-white/10"
            aria-labelledby="playground-editor-heading"
          >
            <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
              <div className="min-w-0">
                <h2 id="playground-editor-heading" className="text-base font-semibold text-[var(--text)]">
                  Code editor
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                  Type below, then <span className="font-medium text-[var(--text)]">Run</span>. Output appears under the
                  editor.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void run()}
                  disabled={busy}
                  className="inline-flex min-h-[44px] min-w-[5.5rem] items-center justify-center rounded-full bg-[var(--text)] px-6 py-2.5 text-sm font-semibold text-[var(--bg)] shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {runState === "running" ? "Running…" : loadState === "loading" ? "Loading…" : "Run"}
                </button>
                <button
                  type="button"
                  onClick={() => void preload()}
                  disabled={loadState === "loading" || loadState === "ready"}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadState === "ready" ? "Ready" : "Preload Pyodide"}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {loadState === "idle" ? (
                <p className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--muted)]">
                  First visit: <span className="font-medium text-[var(--text)]">Run</span> downloads Pyodide once, then your
                  browser caches it.
                </p>
              ) : null}

              {loadError ? (
                <p className="mb-4 rounded-lg border border-[var(--callout-warn-border)] bg-[var(--callout-warn-bg)] px-3 py-2 text-sm text-[var(--text)]">
                  Could not load Pyodide: {loadError}
                </p>
              ) : null}

              <label htmlFor={editorId} className="sr-only">
                Python code
              </label>
              <textarea
                id={editorId}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="min-h-[280px] w-full resize-y rounded-xl border-2 border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm leading-relaxed text-[var(--code-fg)] shadow-inner outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Standard output</h3>
                  <pre
                    className="mt-2 min-h-[140px] overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-sm text-[var(--text)]"
                    aria-live="polite"
                  >
                    {stdout || (runState === "running" ? "…" : "—")}
                  </pre>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Problems</h3>
                  {stderr.trim() ? (
                    <div className="mt-2 min-h-[140px] overflow-hidden rounded-xl border border-[var(--callout-warn-border)] bg-[var(--callout-warn-bg)]">
                      {stderrFriendly ? (
                        <div className="border-b border-[var(--callout-warn-border)] p-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text)]">
                            Plain-language summary
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">{stderrFriendly}</p>
                          <details className="group mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                            <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold text-[var(--accent)] marker:content-none [&::-webkit-details-marker]:hidden">
                              <span className="underline decoration-dotted underline-offset-2">
                                Show technical details
                              </span>
                            </summary>
                            <pre className="max-h-52 overflow-auto border-t border-[var(--border)] p-3 font-mono text-[11px] leading-relaxed text-[var(--muted)]">
                              {stderr}
                            </pre>
                          </details>
                        </div>
                      ) : (
                        <pre
                          className="max-h-60 overflow-auto whitespace-pre-wrap p-3 font-mono text-xs text-[var(--text)]"
                          aria-live="assertive"
                        >
                          {stderr}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <pre
                      className="mt-2 min-h-[140px] overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-sm text-[var(--muted)]"
                      aria-live="assertive"
                    >
                      —
                    </pre>
                  )}
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
                This is real Python: functions, loops, <code className="inline-code">import math</code>,{" "}
                <code className="inline-code">json</code>, and in-memory files with{" "}
                <code className="inline-code">open()</code> all work. Missions check your answer from Standard output, so
                use <code className="inline-code">print</code> where the prompt asks. Standard library only (no{" "}
                <code className="inline-code">pip install</code>). <code className="inline-code">input()</code> does not
                work in this browser runtime. Long loops can freeze the tab.
              </p>
            </div>
          </section>

          <p className="text-xs leading-relaxed text-[var(--muted)] xl:hidden">
            <Link to="/learn/first-program" className="font-medium text-[var(--text)]">
              First program
            </Link>{" "}
            in the main course walks through every idea step by step.
          </p>
        </div>
      </div>
    </div>
  );
}
