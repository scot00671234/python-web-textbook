import { useCallback, useEffect, useId, useState } from "react";
import type { FlashcardDeck } from "../content/types";

type Props = {
  deck: FlashcardDeck;
};

export function FlashcardStudy({ deck }: Props) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const total = deck.cards.length;
  const cardIndex = total > 0 ? Math.min(Math.max(0, index), total - 1) : 0;
  const card = total > 0 ? deck.cards[cardIndex] : null;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [deck.id]);

  useEffect(() => {
    if (total <= 0) return;
    setIndex((i) => Math.min(i, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (total <= 0 ? 0 : (i - 1 + total) % total));
  }, [total]);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (total <= 0 ? 0 : (i + 1) % total));
  }, [total]);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleFlip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, toggleFlip]);

  if (!card || total === 0) {
    return (
      <p className="rounded-card border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
        This deck has no cards yet.
      </p>
    );
  }

  const pos = cardIndex + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--text)]" id={labelId}>
          Card {pos} of {total}
        </p>
        <p className="sr-only" aria-live="polite">
          {flipped ? "Answer side" : "Question side"} · card {pos} of {total}
        </p>
        <div
          className="h-2 flex-1 basis-full sm:basis-48 sm:min-w-[12rem] overflow-hidden rounded-full bg-[var(--surface-2)]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={pos}
          aria-labelledby={labelId}
        >
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
            style={{ width: `${(pos / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-xl [perspective:1200px]">
        {reduceMotion ? (
          <button
            type="button"
            onClick={toggleFlip}
            className="w-full rounded-card border border-[var(--border)] bg-[var(--surface)] p-8 text-left shadow-md ring-1 ring-black/5 transition hover:bg-[var(--surface-2)] dark:ring-white/10 min-h-[280px] flex flex-col justify-center"
            aria-pressed={flipped}
          >
            <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              {flipped ? "Answer" : "Question"}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--text)]">
              {flipped ? card.back : card.front}
            </p>
            <p className="mt-6 text-xs text-[var(--muted)]">Click or press Space to flip</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleFlip}
            className="group relative w-full cursor-pointer border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-card"
            aria-pressed={flipped}
          >
            <div
              className={[
                "relative min-h-[280px] w-full transition-transform duration-500 [transform-style:preserve-3d]",
                flipped ? "[transform:rotateY(180deg)]" : "",
              ].join(" ")}
            >
              <div className="absolute inset-0 flex flex-col justify-center rounded-card border border-[var(--border)] bg-[var(--surface)] p-8 shadow-md [backface-visibility:hidden] ring-1 ring-black/5 dark:ring-white/10">
                <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                  Question
                </p>
                <p className="mt-4 text-lg leading-relaxed text-[var(--text)]">{card.front}</p>
                <p className="mt-6 text-xs text-[var(--muted)]">Tap to reveal answer</p>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center rounded-card border border-[var(--border)] bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))] p-8 shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] ring-1 ring-black/5 dark:bg-[color-mix(in_oklab,var(--accent)_14%,var(--surface))] dark:ring-white/10">
                <p className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                  Answer
                </p>
                <p className="mt-4 text-lg leading-relaxed text-[var(--text)]">{card.back}</p>
                <p className="mt-6 text-xs text-[var(--muted)]">Tap to see question again</p>
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--surface-2)]"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={toggleFlip}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--text)] px-6 text-sm font-semibold text-[var(--bg)] shadow-md transition hover:opacity-95"
        >
          {flipped ? "Show question" : "Show answer"}
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--surface-2)]"
        >
          Next →
        </button>
      </div>

      <p className="text-center text-xs text-[var(--muted)]">
        Shortcuts: <kbd className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono">Space</kbd> flip ·{" "}
        <kbd className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono">←</kbd>{" "}
        <kbd className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono">→</kbd> cards
      </p>
    </div>
  );
}
