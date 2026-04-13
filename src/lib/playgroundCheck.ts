import type { PlaygroundSuccessCheck } from "../content/playgroundChallenges";

export type CheckOutcome = "pass" | "fail" | "skip";

/**
 * Soft check for beginner missions: substring match on stdout, no stderr.
 * Not a grading system; just friendly feedback.
 */
export function evaluatePlaygroundRun(
  stdout: string,
  stderr: string,
  check: PlaygroundSuccessCheck,
): CheckOutcome {
  if (check.kind === "manual") {
    return "skip";
  }

  const err = stderr.trim();
  if (err.length > 0) {
    return "fail";
  }

  if (check.kind === "stdout_includes_all") {
    const lower = stdout.toLowerCase();
    const ok = check.parts.every((p) => lower.includes(p.trim().toLowerCase()));
    return ok ? "pass" : "fail";
  }

  const lineSet = new Set(
    stdout
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0),
  );
  const ok = check.lines.every((l) => lineSet.has(l.trim()));
  return ok ? "pass" : "fail";
}
