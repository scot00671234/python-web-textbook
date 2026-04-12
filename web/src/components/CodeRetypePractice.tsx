import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { codesMatchAfterNormalize, diffLines, normalizeCode } from "../lib/codeRetype";

type Props = {
  expectedCode: string;
  title?: string;
  /** Unique per lesson, plain-English card, or other block for draft persistence. */
  storageKey: string;
  /** "plainEnglish" uses TYPE labels and snippet wording instead of lesson wording. */
  source?: "lesson" | "plainEnglish";
};

const storagePrefix = "code-retype:";

export function CodeRetypePractice({ expectedCode, title, storageKey, source = "lesson" }: Props) {
  const isPlainEnglish = source === "plainEnglish";
  const panelId = useId();
  const resultId = useId();
  const [open, setOpen] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [checked, setChecked] = useState(false);
  const [match, setMatch] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fullKey = `${storagePrefix}${storageKey}`;

  useLayoutEffect(() => {
    if (!open) return;
    try {
      const saved = sessionStorage.getItem(fullKey);
      setUserCode(saved ?? "");
    } catch {
      setUserCode("");
    }
  }, [fullKey, open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => textareaRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    try {
      if (userCode.length > 0) {
        sessionStorage.setItem(fullKey, userCode);
      } else {
        sessionStorage.removeItem(fullKey);
      }
    } catch {
      /* ignore */
    }
  }, [fullKey, open, userCode]);

  const runCheck = useCallback(() => {
    const ok = codesMatchAfterNormalize(userCode, expectedCode);
    setMatch(ok);
    setChecked(true);
  }, [userCode, expectedCode]);

  const resetDraft = useCallback(() => {
    setUserCode("");
    setChecked(false);
    setMatch(null);
    try {
      sessionStorage.removeItem(fullKey);
    } catch {
      /* ignore */
    }
    textareaRef.current?.focus();
  }, [fullKey]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const next = `${val.slice(0, start)}  ${val.slice(end)}`;
      setUserCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }, []);

  const userNorm = normalizeCode(userCode);
  const expectedNorm = normalizeCode(expectedCode);
  const diff =
    checked && match === false
      ? diffLines(userNorm.split("\n"), expectedNorm.split("\n"))
      : null;

  const collapsedLabel = isPlainEnglish
    ? "TYPE: retype the Python above from memory. Opens a blank editor; checks match after normalizing spaces."
    : "Practice: retype this example from memory. Opens a blank editor; checks match after normalizing spaces.";

  return (
    <div
      className={[
        "border-t border-dashed border-[var(--border)]",
        isPlainEnglish ? "mt-2 pt-2" : "mt-3 pt-3",
      ].join(" ")}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls={panelId}
          aria-label={collapsedLabel}
          title={
            isPlainEnglish
              ? "Blank editor, then check against the snippet (spacing normalized)."
              : "Blank editor, then check against the lesson (spacing normalized)."
          }
          className={[
            "group/type inline-flex w-full min-w-0 items-center gap-2 rounded-lg border text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30",
            isPlainEnglish
              ? "border-[var(--border)]/70 bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] px-2 py-1.5 hover:border-[var(--accent)]/35 hover:bg-[color-mix(in_oklab,var(--surface-2)_70%,transparent)] sm:gap-2.5 sm:px-2.5 sm:py-2"
              : "border-[var(--border)] bg-[var(--surface-2)]/90 px-3 py-2 shadow-sm hover:border-[var(--accent)]/40 hover:bg-[color-mix(in_oklab,var(--accent)_6%,var(--surface-2))] sm:py-2.5",
          ].join(" ")}
        >
          <span
            className={[
              "grid shrink-0 place-items-center rounded-md bg-[var(--accent)] font-bold uppercase tracking-wide text-[var(--accent-fg)]",
              isPlainEnglish
                ? "h-6 w-6 text-[7px] leading-none sm:h-7 sm:w-7 sm:text-[8px]"
                : "h-7 w-7 text-[8px] sm:h-8 sm:w-8 sm:text-[9px]",
            ].join(" ")}
            aria-hidden
          >
            {isPlainEnglish ? "TYPE" : "Type"}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={[
                "block font-medium leading-snug text-[var(--text)]",
                isPlainEnglish ? "text-xs sm:text-[13px]" : "text-sm",
              ].join(" ")}
            >
              {isPlainEnglish ? "Retype from memory" : "Retype this example from memory"}
            </span>
            {!isPlainEnglish ? (
              <span className="mt-0.5 block truncate text-[11px] font-normal text-[var(--muted)] sm:text-xs">
                Blank editor · normalized spacing when you check
              </span>
            ) : (
              <span className="mt-0.5 hidden text-[11px] text-[var(--muted)] sm:block sm:truncate">
                Opens editor below · same check as lessons
              </span>
            )}
          </span>
          <span
            className="shrink-0 pr-0.5 text-[11px] font-semibold text-[var(--muted)] transition group-hover/type:text-[var(--accent)]"
            aria-hidden
          >
            {isPlainEnglish ? "▸" : "Open →"}
          </span>
        </button>
      ) : (
        <div
          id={panelId}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-inner sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-[var(--text)]">
                {isPlainEnglish ? "TYPE practice" : "Retype practice"}
                {title ? (
                  <span className="font-normal text-[var(--muted)]"> · {title}</span>
                ) : null}
              </h3>
              <p className="mt-1 max-w-prose text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                {isPlainEnglish
                  ? "The snippet stays in the Python panel above. Type what you remember here. Tab inserts two spaces. We trim trailing spaces per line before comparing."
                  : "The example stays in the code block above. Type what you remember here. Tab inserts two spaces. We trim trailing spaces per line before comparing."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setChecked(false);
                setMatch(null);
              }}
              className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              Collapse
            </button>
          </div>

          <label className="mt-4 block">
            <span className="sr-only">Your code</span>
            <textarea
              ref={textareaRef}
              value={userCode}
              onChange={(e) => {
                setUserCode(e.target.value);
                setChecked(false);
                setMatch(null);
              }}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              rows={Math.min(14, Math.max(6, expectedCode.split("\n").length + 2))}
              className="mt-2 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-3 py-3 font-mono text-[13px] leading-[1.65] text-[var(--code-fg)] shadow-sm [tab-size:2] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 sm:text-sm"
              placeholder="Start typing here..."
            />
          </label>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runCheck}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--text)] px-5 text-sm font-semibold text-[var(--bg)] shadow-md transition hover:opacity-95"
            >
              Check my code
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex h-10 items-center justify-center rounded-full border border-transparent px-3 text-sm font-semibold text-[var(--muted)] underline-offset-2 hover:text-[var(--text)] hover:underline"
            >
              Clear editor
            </button>
          </div>

          {checked && match !== null ? (
            <div
              id={resultId}
              role="status"
              aria-live="polite"
              className={[
                "mt-4 rounded-xl border p-4 text-sm leading-relaxed sm:p-5",
                match
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-100",
              ].join(" ")}
            >
              {match ? (
                <>
                  <p className="font-bold">Nice. It matches after normalization.</p>
                  <p className="mt-1 text-xs opacity-90 sm:text-sm">
                    Trailing spaces on each line and extra blank lines at the end are ignored. Run the
                    code in your own environment when you want to verify behavior, not only spelling.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold">Not quite yet.</p>
                  <p className="mt-1 text-xs opacity-90 sm:text-sm">
                    Below is a line diff: lines only in yours, only in the{" "}
                    {isPlainEnglish ? "snippet above" : "lesson"}, and matching lines. Adjust your
                    editor and check again.
                  </p>
                </>
              )}
            </div>
          ) : null}

          {diff && diff.length > 0 ? (
            <div className="mt-3 max-h-80 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-2 font-mono text-[11px] leading-snug sm:text-xs">
              {diff.map((op, i) => {
                if (op.type === "equal") {
                  return (
                    <div key={i} className="px-2 py-0.5 text-[var(--code-fg)]/85">
                      <span className="select-none text-[var(--muted)]"> </span>
                      {op.line || " "}
                    </div>
                  );
                }
                if (op.type === "del") {
                  return (
                    <div
                      key={i}
                      className="bg-rose-500/15 px-2 py-0.5 text-rose-900 dark:bg-rose-500/20 dark:text-rose-100"
                    >
                      <span className="select-none font-bold text-rose-600 dark:text-rose-400">
                        −{" "}
                      </span>
                      {op.line || " "}
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="bg-emerald-500/15 px-2 py-0.5 text-emerald-950 dark:bg-emerald-500/20 dark:text-emerald-100"
                  >
                    <span className="select-none font-bold text-emerald-700 dark:text-emerald-400">
                      +{" "}
                    </span>
                    {op.line || " "}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
