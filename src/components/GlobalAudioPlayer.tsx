import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("lesson");
  const [status, setStatus] = useState<Status>("idle");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceKey, setVoiceKey] = useState("");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [chunkIndex, setChunkIndex] = useState(0);

  const rateRef = useRef(rate);
  const cancelledRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const currentLesson = useMemo(() => {
    const slug = lessonSlugFromPath(location.pathname);
    if (!slug) return undefined;
    return getLessonBySlug(slug);
  }, [location.pathname]);

  const queueLessons = useMemo(() => {
    if (mode === "all") {
      return getAllLessons().map((x) => x.lesson);
    }
    if (!currentLesson) return [] as Lesson[];
    if (mode === "lesson") return [currentLesson];
    return getLessonContext(currentLesson.slug)?.module.lessons ?? [currentLesson];
  }, [currentLesson, mode]);

  const queueChunks = useMemo(() => queueLessons.map((l) => lessonToSpeechChunks(l)), [queueLessons]);
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

  useEffect(() => {
    const startLessonIndex =
      mode === "all"
        ? Math.max(
            0,
            currentLesson ? getAllLessons().findIndex((x) => x.lesson.slug === currentLesson.slug) : 0,
          )
        : mode === "module"
          ? Math.max(
              0,
              currentLesson
                ? (getLessonContext(currentLesson.slug)?.lessonInModule1 ?? 1) - 1
                : 0,
            )
          : 0;
    setLessonIndex(startLessonIndex >= 0 ? startLessonIndex : 0);
    setChunkIndex(0);
    stop();
  }, [currentLesson, currentLesson?.slug, mode, stop]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [settingsOpen]);

  const speak = useCallback(() => {
    if (!supported || queueChunks.length === 0) return;
    cancelledRef.current = false;
    window.speechSynthesis.cancel();

    let li = Math.max(0, Math.min(queueChunks.length - 1, lessonIndex));
    let ci = Math.max(0, chunkIndex);

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
      setLessonIndex(li);
      setChunkIndex(ci);
      ci += 1;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.min(2, Math.max(0.75, rateRef.current));
      utterance.pitch = 1;
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.onend = runNext;
      utterance.onerror = () => setStatus("idle");
      window.speechSynthesis.speak(utterance);
      setStatus("playing");
    };

    runNext();
  }, [chunkIndex, lessonIndex, queueChunks, supported]);

  const jumpLesson = useCallback(
    (delta: number) => {
      if (!queueLessons.length) return;
      setLessonIndex((i) => {
        const next = (i + delta + queueLessons.length) % queueLessons.length;
        return next;
      });
      setChunkIndex(0);
      if (status === "playing") {
        stop();
        setTimeout(() => speak(), 0);
      }
    },
    [queueLessons.length, speak, status, stop],
  );

  if (!supported) return null;

  const activeLesson = queueLessons[lessonIndex];
  const activeChunks = queueChunks[lessonIndex] ?? [];
  const activeChunkCount = activeChunks.filter((x) => x.trim().length > 0).length;
  const modeLabel =
    mode === "lesson" ? "This lesson" : mode === "module" ? "This module" : "All lessons";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {settingsOpen ? (
        <div
          id={`${id}-panel`}
          ref={panelRef}
          className="pointer-events-auto w-[min(21rem,calc(100vw-2rem))] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <p className="text-[10px] leading-snug text-[var(--muted)]">
            Audiobook mode reads currently loaded lessons. If you edit lesson content, playback uses the new text on the next run.
          </p>
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Scope</p>
            <div className="mt-2 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5">
              {([
                ["lesson", "Lesson"],
                ["module", "Module"],
                ["all", "All"],
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
        </div>
      ) : null}

      <div className="pointer-events-auto rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-1 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            onClick={() => setSettingsOpen((o) => !o)}
            aria-expanded={settingsOpen}
            title="Audio settings"
          >
            <GearIcon />
            <span className="sr-only">Audio settings</span>
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            onClick={() => jumpLesson(-1)}
            title="Previous lesson in queue"
          >
            ←
          </button>
          {status === "playing" ? (
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded-full bg-red-600 px-2.5 pr-3 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
              onClick={stop}
              title="Stop audio"
            >
              <StopIcon className="h-3.5 w-3.5 shrink-0" />
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--text)] px-2.5 pr-3 text-xs font-semibold text-[var(--bg)] shadow-sm hover:opacity-90 disabled:opacity-50"
              onClick={speak}
              disabled={!queueLessons.length}
              title={queueLessons.length ? "Play queue audio" : "Open a lesson to listen"}
            >
              <PlayIcon className="h-3.5 w-3.5 shrink-0" />
              Listen
            </button>
          )}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            onClick={() => jumpLesson(1)}
            title="Next lesson in queue"
          >
            →
          </button>
        </div>
        <div className="px-2 pb-1 pt-0.5 text-[10px] leading-snug text-[var(--muted)]">
          <span className="font-semibold text-[var(--text)]">{modeLabel}</span>
          {activeLesson ? (
            <>
              {" · "}
              {lessonIndex + 1}/{queueLessons.length}: {activeLesson.title}
              {" · "}
              chunk {Math.min(chunkIndex + 1, Math.max(activeChunkCount, 1))}/{Math.max(activeChunkCount, 1)}
              {totalChunks ? ` · total ${totalChunks}` : ""}
            </>
          ) : (
            <> · open a lesson page to start</>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h12v12H6V6z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

