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

const CATEGORY_ORDER = ["Warm-up", "Logic", "Data"] as const;

export function PythonPlaygroundPage() {
  const editorId = useId();
  const [challengeId, setChallengeId] = useState(readActiveChallengeId);
  const challenge = useMemo(() => getPlaygroundChallenge(challengeId), [challengeId]);

  const [code, setCode] = useState(() =>
    readCodeDraft(readActiveChallengeId(), getPlaygroundChallenge(readActiveChallengeId()).starterCode),
  );
  const [hintsOpen, setHintsOpen] = useState(0);
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(260px,300px)_1fr] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Mini-missions</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              One small goal at a time. A check runs after each successful Run (no errors).
            </p>
            <div className="mt-4 space-y-4">
              {groupedChallenges.map(({ category, items }) => (
                <div key={category}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text)]">{category}</p>
                  <ul className="mt-2 space-y-1">
                    {items.map((c) => {
                      const active = c.id === challengeId;
                      const done = doneIds.has(c.id);
                      return (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => pickChallenge(c.id)}
                            className={[
                              "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                              active
                                ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] font-semibold text-[var(--text)]"
                                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]",
                            ].join(" ")}
                          >
                            <span className="min-w-0 flex-1 leading-snug">{c.title}</span>
                            {done ? (
                              <span className="shrink-0 text-base text-[var(--callout-tip-border)]" title="Passed check">
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
            </div>
          </div>

          <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-[var(--text)]">{challenge.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{challenge.blurb}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--text)]">
              {challenge.objectives.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {challenge.successCheck.kind !== "manual" ? (
              <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                Tip: we only auto-check Standard output when there is nothing in Errors / stderr.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={revealNextHint}
                disabled={hintsOpen >= challenge.hints.length}
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {hintsOpen >= challenge.hints.length
                  ? "All hints open"
                  : hintsOpen === 0
                    ? "Show first hint"
                    : `Next hint (${hintsOpen}/${challenge.hints.length})`}
              </button>
              <button
                type="button"
                onClick={() => setShowSolution((s) => !s)}
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                {showSolution ? "Hide sample answer" : "Peek sample answer"}
              </button>
              <button
                type="button"
                onClick={loadStarter}
                className="inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--text)] hover:underline"
              >
                Reset to starter code
              </button>
            </div>

            {hintsOpen > 0 ? (
              <ul className="mt-3 space-y-2 rounded-xl border border-[var(--callout-note-border)] bg-[var(--callout-note-bg)] p-3 text-sm leading-relaxed text-[var(--text)]">
                {challenge.hints.slice(0, hintsOpen).map((h, i) => (
                  <li key={i}>
                    <span className="font-semibold text-[var(--accent)]">Hint {i + 1}. </span>
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}

            {showSolution ? (
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3">
                <p className="text-xs font-semibold text-[var(--code-fg)]/80">Sample answer (many solutions are valid)</p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--code-fg)]">
                  {challenge.solutionCode}
                </pre>
              </div>
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

          <p className="text-xs leading-relaxed text-[var(--muted)]">
            Want the full story?{" "}
            <Link to="/learn/first-program" className="font-medium text-[var(--text)]">
              First program
            </Link>{" "}
            and the rest of the course explain every idea step by step.
          </p>
        </aside>

        <div className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void run()}
              disabled={busy}
              className="inline-flex items-center justify-center rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {runState === "running" ? "Running…" : loadState === "loading" ? "Loading…" : "Run"}
            </button>
            <button
              type="button"
              onClick={() => void preload()}
              disabled={loadState === "loading" || loadState === "ready"}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadState === "ready" ? "Ready" : "Preload Pyodide"}
            </button>
          </div>

          {loadState === "idle" ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Click <span className="font-medium text-[var(--text)]">Run</span> to load Pyodide the first time, or preload
              first if you prefer.
            </p>
          ) : null}

          {loadError ? (
            <p className="mt-3 rounded-lg border border-[var(--callout-warn-border)] bg-[var(--callout-warn-bg)] px-3 py-2 text-sm text-[var(--text)]">
              Could not load Pyodide: {loadError}
            </p>
          ) : null}

          <label htmlFor={editorId} className="mt-5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Your code
          </label>
          <textarea
            id={editorId}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="mt-2 min-h-[260px] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm leading-relaxed text-[var(--code-fg)] shadow-inner outline-none ring-[var(--accent)] focus:ring-2"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Standard output</h2>
              <pre
                className="mt-2 min-h-[120px] overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-sm text-[var(--text)]"
                aria-live="polite"
              >
                {stdout || (runState === "running" ? "…" : "—")}
              </pre>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Errors / stderr</h2>
              <pre
                className="mt-2 min-h-[120px] overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--callout-warn-border)] bg-[var(--callout-warn-bg)] p-3 font-mono text-sm text-[var(--text)]"
                aria-live="assertive"
              >
                {stderr || "—"}
              </pre>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
            Standard library only (no <code className="inline-code">pip install</code> on this page). Avoid{" "}
            <code className="inline-code">input()</code>
            : the browser runtime does not provide an interactive terminal. Long loops can freeze the tab.
          </p>
        </div>
      </div>
    </div>
  );
}
