import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllLessons, getLessonBySlug, getLessonContext } from "../content/curriculum";
import type { Lesson } from "../content/types";
import { lessonToSpeechChunks } from "../lib/lessonSpeechText";
import { sortVoicesForQuality } from "../lib/voiceQuality";

type Mode = "lesson" | "module" | "all";
type Status = "idle" | "playing";

function formatRateLabel(rate: number): string {
  return `${rate.toFixed(2).replace(/\.?0+$/, "")}x`;
}

function lessonSlugFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/learn\/([^/?#]+)/);
  if (!m) return null;
  const slug = decodeURIComponent(m[1] ?? "");
  if (!slug || slug === "flashcards" || slug === "python-in-plain-english" || slug === "python-dictionary") {
    return null;
  }
  return slug;
}

export function GlobalAudioPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("all");
  const [status, setStatus] = useState<Status>("idle");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceKey, setVoiceKey] = useState("");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [pinnedLessonSlug, setPinnedLessonSlug] = useState<string | null>(null);

  const rateRef = useRef(rate);
  const lessonIndexRef = useRef(lessonIndex);
  const chunkIndexRef = useRef(chunkIndex);
  const cancelledRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const currentLesson = useMemo(() => {
    const slug = lessonSlugFromPath(location.pathname);
    if (!slug) return undefined;
    return getLessonBySlug(slug);
  }, [location.pathname]);
  const contextLesson = useMemo(() => {
    if (currentLesson) return currentLesson;
    if (!pinnedLessonSlug) return undefined;
    return getLessonBySlug(pinnedLessonSlug);
  }, [currentLesson, pinnedLessonSlug]);

  useEffect(() => {
    if (!currentLesson?.slug) return;
    setPinnedLessonSlug((prev) => (prev === currentLesson.slug ? prev : currentLesson.slug));
  }, [currentLesson?.slug]);

  const queueLessons = useMemo(() => {
    if (mode === "all") {
      return getAllLessons().map((x) => x.lesson);
    }
    if (!contextLesson) return [] as Lesson[];
    if (mode === "lesson") return [contextLesson];
    return getLessonContext(contextLesson.slug)?.module.lessons ?? [contextLesson];
  }, [contextLesson, mode]);

  const queueChunks = useMemo(
    () =>
      queueLessons.map((l) =>
        lessonToSpeechChunks(l).map((x) => x.trim()).filter((x) => x.length > 0),
      ),
    [queueLessons],
  );
  const totalChunks = useMemo(
    () => queueChunks.reduce((sum, arr) => sum + arr.filter((x) => x.trim().length > 0).length, 0),
    [queueChunks],
  );

  const voiceSelectId = `${id}-voice`;
  const rateId = `${id}-rate`;

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    lessonIndexRef.current = lessonIndex;
  }, [lessonIndex]);
  useEffect(() => {
    chunkIndexRef.current = chunkIndex;
  }, [chunkIndex]);

  useEffect(() => {
    if (!voiceKey || voices.length === 0) {
      voiceRef.current = null;
      return;
    }
    const [name, lang] = voiceKey.split("\t");
    voiceRef.current = voices.find((v) => v.name === name && v.lang === lang) ?? null;
  }, [voiceKey, voices]);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const seen = new Set<string>();
      const list = window.speechSynthesis
        .getVoices()
        .filter((v) => {
          const key = `${v.name}\t${v.lang}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .filter((v) => v.lang.toLowerCase().startsWith("en"));
      const fallback = list.length
        ? list
        : window.speechSynthesis.getVoices().filter((v) => {
            const key = `${v.name}\t${v.lang}`;
            if (seen.has(`fallback:${key}`)) return false;
            seen.add(`fallback:${key}`);
            return true;
          });
      setVoices(sortVoicesForQuality(fallback));
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported]);

  useEffect(() => {
    if (!voices.length || voiceKey) return;
    const first = voices[0];
    if (first) setVoiceKey(`${first.name}\t${first.lang}`);
  }, [voiceKey, voices]);

  const stop = useCallback(() => {
    if (!supported) return;
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, [supported]);

  const speakFrom = useCallback(
    (startLessonIndex: number, startChunkIndex: number) => {
      if (!supported || queueChunks.length === 0) return;
      cancelledRef.current = false;
      window.speechSynthesis.cancel();

      let li = Math.max(0, Math.min(queueChunks.length - 1, startLessonIndex));
      let ci = Math.max(0, startChunkIndex);

      const runNext = () => {
        if (cancelledRef.current) {
          setStatus("idle");
          return;
        }

        while (li < queueChunks.length) {
          const chunks = queueChunks[li] ?? [];
          while (ci < chunks.length && !(chunks[ci] ?? "").trim()) ci += 1;
          if (ci < chunks.length) break;
          li += 1;
          ci = 0;
        }

        if (li >= queueChunks.length) {
          setStatus("idle");
          return;
        }

        const text = (queueChunks[li]?.[ci] ?? "").trim();
        if (!text) {
          ci += 1;
          runNext();
          return;
        }

        setLessonIndex(li);
        setChunkIndex(ci);
        ci += 1;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = Math.min(2, Math.max(0.75, rateRef.current));
        utterance.pitch = 1;
        if (voiceRef.current) utterance.voice = voiceRef.current;
        utterance.onend = runNext;
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          // Some browsers can emit interrupted/canceled events between chunks.
          // Treat those as transition noise unless we explicitly canceled playback.
          if (cancelledRef.current) {
            setStatus("idle");
            return;
          }
          if (event.error === "interrupted" || event.error === "canceled") {
            runNext();
            return;
          }
          setStatus("idle");
        };
        window.speechSynthesis.speak(utterance);
        setStatus("playing");
      };

      runNext();
    },
    [queueChunks, supported],
  );

  useEffect(() => {
    const startLessonIndex =
      mode === "all"
        ? Math.max(
            0,
            contextLesson ? getAllLessons().findIndex((x) => x.lesson.slug === contextLesson.slug) : 0,
          )
        : mode === "module"
          ? Math.max(
              0,
              contextLesson
                ? (getLessonContext(contextLesson.slug)?.lessonInModule1 ?? 1) - 1
                : 0,
            )
          : 0;
    setLessonIndex(startLessonIndex >= 0 ? startLessonIndex : 0);
    setChunkIndex(0);
    stop();
  }, [contextLesson, contextLesson?.slug, mode, stop]);

  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [panelOpen]);

  const speak = useCallback(() => {
    speakFrom(lessonIndex, chunkIndex);
  }, [chunkIndex, lessonIndex, speakFrom]);

  useEffect(() => {
    if (!supported || status !== "playing") return;
    const t = window.setTimeout(() => {
      // Restart from the current passage so speed changes are felt immediately.
      stop();
      speakFrom(lessonIndexRef.current, chunkIndexRef.current);
    }, 120);
    return () => window.clearTimeout(t);
  }, [rate, speakFrom, status, stop, supported]);

  const jumpLesson = useCallback(
    (delta: number) => {
      if (!queueLessons.length) return;
      const nextLesson = (lessonIndex + delta + queueLessons.length) % queueLessons.length;
      setLessonIndex(nextLesson);
      setChunkIndex(0);
      if (status === "playing") {
        stop();
        setTimeout(() => speakFrom(nextLesson, 0), 0);
      }
    },
    [lessonIndex, queueLessons.length, speakFrom, status, stop],
  );

  const jumpPassage = useCallback(
    (delta: number) => {
      const chunks = queueChunks[lessonIndex] ?? [];
      if (!chunks.length) return;
      const nextChunk = (chunkIndex + delta + chunks.length) % chunks.length;
      setChunkIndex(nextChunk);
      if (status === "playing") {
        stop();
        setTimeout(() => speakFrom(lessonIndex, nextChunk), 0);
      }
    },
    [chunkIndex, lessonIndex, queueChunks, speakFrom, status, stop],
  );

  const setPassage = useCallback(
    (nextChunk: number) => {
      const chunks = queueChunks[lessonIndex] ?? [];
      if (!chunks.length) return;
      const clamped = Math.max(0, Math.min(chunks.length - 1, nextChunk));
      setChunkIndex(clamped);
      if (status === "playing") {
        stop();
        setTimeout(() => speakFrom(lessonIndex, clamped), 0);
      }
    },
    [lessonIndex, queueChunks, speakFrom, status, stop],
  );

  if (!supported) return null;

  const activeLesson = queueLessons[lessonIndex];
  const activeChunks = queueChunks[lessonIndex] ?? [];
  const activeChunkCount = activeChunks.length;
  const totalLessonCount = queueLessons.length;
  const completedChunksBefore = queueChunks
    .slice(0, lessonIndex)
    .reduce((sum, arr) => sum + arr.length, 0);
  const overallChunkPosition =
    totalChunks > 0 ? Math.min(totalChunks, completedChunksBefore + chunkIndex + 1) : 0;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {panelOpen ? (
        <div
          id={`${id}-panel`}
          ref={panelRef}
          className="pointer-events-auto w-[min(23rem,calc(100vw-2rem))] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <p className="text-[11px] font-semibold text-[var(--text)]">Lesson audio</p>
          <p className="mt-1 text-[10px] leading-snug text-[var(--muted)]">
            Scope, voices, pacing, lesson jumps, and passage jumps in one place.
          </p>
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Scope</p>
            <div className="mt-2 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5">
              {([
                ["all", "All"],
                ["module", "Module"],
                ["lesson", "Lesson"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs font-bold transition",
                    mode === value ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--muted)] hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2 text-[11px] text-[var(--muted)]">
            {activeLesson ? (
              <button
                type="button"
                onClick={() => {
                  navigate(`/learn/${activeLesson.slug}`);
                }}
                className="font-semibold text-[var(--text)] underline-offset-2 transition hover:underline"
                title="Open this lesson page"
              >
                {lessonIndex + 1}/{totalLessonCount}: {activeLesson.title}
              </button>
            ) : (
              <p className="font-semibold text-[var(--text)]">
                {lessonIndex + 1}/{totalLessonCount}: No lesson
              </p>
            )}
            <p className="mt-0.5">
              {mode === "lesson" ? "This lesson" : mode === "module" ? "This module" : "All lessons"}
              {" · "}
              Passage {Math.min(chunkIndex + 1, Math.max(activeChunkCount, 1))}/{Math.max(activeChunkCount, 1)}
              {totalChunks ? ` · Overall ${overallChunkPosition}/${totalChunks}` : ""}
            </p>
          </div>
          <div className="mt-3">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]" htmlFor={rateId}>
              Speed {formatRateLabel(rate)}
            </label>
            <input
              id={rateId}
              type="range"
              min={0.8}
              max={2}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full accent-[var(--accent)]"
            />
          </div>
          <div className="mt-3 space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]" htmlFor={voiceSelectId}>
              Voice
            </label>
            <select
              id={voiceSelectId}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-xs text-[var(--text)]"
              value={voiceKey}
              onChange={(e) => setVoiceKey(e.target.value)}
            >
              {voices.map((v) => {
                const key = `${v.name}\t${v.lang}`;
                return (
                  <option key={key} value={key}>
                    {v.name.length > 48 ? `${v.name.slice(0, 46)}...` : v.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Passage</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => jumpPassage(-1)}
                className="inline-flex h-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
              >
                ←
              </button>
              <input
                type="range"
                min={1}
                max={Math.max(activeChunkCount, 1)}
                step={1}
                value={Math.min(chunkIndex + 1, Math.max(activeChunkCount, 1))}
                onChange={(e) => setPassage(Number(e.target.value) - 1)}
                className="w-full accent-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => jumpPassage(1)}
                className="inline-flex h-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Lesson</p>
            <div className="mt-2 grid grid-cols-3 items-center gap-2">
              <button
                type="button"
                onClick={() => jumpLesson(-1)}
                className="inline-flex h-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
              >
                ← Prev
              </button>
              {status === "playing" ? (
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center rounded-full bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700"
                  onClick={stop}
                >
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--text)] px-4 text-xs font-semibold text-[var(--bg)] transition hover:opacity-90 disabled:opacity-50"
                  onClick={speak}
                  disabled={!queueLessons.length}
                >
                  Play
                </button>
              )}
              <button
                type="button"
                onClick={() => jumpLesson(1)}
                className="inline-flex h-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
          aria-controls={panelOpen ? `${id}-panel` : undefined}
          className={[
            "relative grid h-12 w-12 place-items-center rounded-full border bg-[var(--surface)] text-[var(--text)] shadow-lg backdrop-blur-sm transition",
            panelOpen
              ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
              : "border-[var(--border)] hover:bg-[var(--surface-2)]",
          ].join(" ")}
          title="Open lesson audio controls"
        >
          <SpeakerIcon />
          {status === "playing" ? (
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[var(--accent)] ring-2 ring-[var(--surface)]" />
          ) : null}
          <span className="sr-only">Open lesson audio controls</span>
        </button>
      </div>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

