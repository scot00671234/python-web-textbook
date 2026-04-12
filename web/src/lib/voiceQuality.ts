/** Prefer newer neural or cloud-style voices when the browser exposes them. */
export function scoreVoiceForSpeech(v: SpeechSynthesisVoice): number {
  const blob = `${v.name} ${v.lang}`.toLowerCase();
  let score = 0;
  if (/\b(natural|neural|premium)\b/i.test(blob)) score += 14;
  if (/\bonline\b/i.test(blob)) score += 8;
  if (/\bgoogle\b/i.test(blob)) score += 6;
  if (/\bapple\b/i.test(blob)) score += 5;
  if (v.default) score += 4;
  if (v.lang.toLowerCase() === "en-us") score += 2;
  if (v.lang.toLowerCase().startsWith("en-gb")) score += 1;
  return score;
}

export function sortVoicesForQuality(
  list: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
  return [...list].sort((a, b) => {
    const d = scoreVoiceForSpeech(b) - scoreVoiceForSpeech(a);
    if (d !== 0) return d;
    return a.name.localeCompare(b.name);
  });
}
