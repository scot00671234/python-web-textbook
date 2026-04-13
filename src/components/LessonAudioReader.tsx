import { useEffect, useId, useRef, useState } from "react";
import type { Lesson } from "../content/types";
import { useLessonSpeech } from "../hooks/useLessonSpeech";

type Props = {
  lesson: Lesson;
};

function formatRateLabel(rate: number): string {
  return `${rate.toFixed(2).replace(/\.?0+$/, "")}x`;
}

export function LessonAudioReader({ lesson }: Props) {
  const id = useId();
  const voiceSelectId = `${id}-voice`;
  const rateId = `${id}-rate`;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    supported,
    voices,
    voiceKey,
    setVoiceKey,
    rate,
    setRate,
    status,
    speak,
    stop,
    chunkCount,
  } = useLessonSpeech(lesson);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [settingsOpen]);

  if (!supported) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      aria-label="Listen to lesson"
    >
      {settingsOpen ? (
        <div
          id={`${id}-panel`}
          ref={panelRef}
          className="pointer-events-auto w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <p className="text-[10px] leading-snug text-[var(--muted)]">
            Voice comes from your device. Pick one with &quot;Natural&quot; or
            &quot;Neural&quot; in the name if you see it. You can change speed while
            it plays: each new phrase uses the slider value (the current phrase
            keeps its speed until it ends).
          </p>
          <div className="mt-3 space-y-2">
            <label
              className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]"
              htmlFor={voiceSelectId}
            >
              Voice
            </label>
            <select
              id={voiceSelectId}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-xs text-[var(--text)]"
              value={voiceKey}
              onChange={(e) => setVoiceKey(e.target.value)}
            >
              {voices.length === 0 ? (
                <option value="">Loading...</option>
              ) : (
                voices.map((v) => {
                  const key = `${v.name}\t${v.lang}`;
                  return (
                    <option key={key} value={key}>
                      {v.name.length > 42 ? `${v.name.slice(0, 40)}...` : v.name}
                    </option>
                  );
                })
              )}
            </select>
          </div>
          <div className="mt-3">
            <label
              className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]"
              htmlFor={rateId}
            >
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

      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          onClick={() => setSettingsOpen((o) => !o)}
          aria-expanded={settingsOpen}
          aria-controls={settingsOpen ? `${id}-panel` : undefined}
          id={`${id}-settings`}
          title="Voice and speed"
        >
          <GearIcon />
          <span className="sr-only">Voice and speed</span>
        </button>

        {status === "playing" ? (
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full bg-red-600 px-2.5 pr-3 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
            onClick={() => {
              setSettingsOpen(false);
              stop();
            }}
            title="Stop"
          >
            <StopIcon className="h-3.5 w-3.5 shrink-0" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--text)] px-2.5 pr-3 text-xs font-semibold text-[var(--bg)] shadow-sm hover:opacity-90"
            onClick={() => {
              setSettingsOpen(false);
              speak();
            }}
            title={`Listen (${chunkCount} parts)`}
          >
            <PlayIcon className="h-3.5 w-3.5 shrink-0" />
            Listen
          </button>
        )}
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
