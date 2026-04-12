import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "../content/types";
import { lessonToSpeechChunks } from "../lib/lessonSpeechText";
import { sortVoicesForQuality } from "../lib/voiceQuality";

export type SpeechStatus = "idle" | "playing";

export function useLessonSpeech(lesson: Lesson | undefined) {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceKey, setVoiceKey] = useState("");
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const cancelledRef = useRef(false);
  const rateRef = useRef(rate);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const chunks = useMemo(
    () => (lesson ? lessonToSpeechChunks(lesson) : []),
    [lesson],
  );

  useEffect(() => {
    if (!supported) return;

    const load = () => {
      const dedupeEn = () => {
        const seen = new Set<string>();
        return window.speechSynthesis.getVoices().filter((v) => {
          if (!v.lang.toLowerCase().startsWith("en")) return false;
          const key = `${v.name}\t${v.lang}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      };
      let list = dedupeEn();
      if (list.length === 0) {
        const seen = new Set<string>();
        list = window.speechSynthesis.getVoices().filter((v) => {
          const key = `${v.name}\t${v.lang}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
      setVoices(sortVoicesForQuality(list));
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported]);

  useEffect(() => {
    if (!supported || voices.length === 0 || voiceKey) return;
    const first = voices[0];
    if (first) {
      setVoiceKey(`${first.name}\t${first.lang}`);
    }
  }, [supported, voices, voiceKey]);

  useEffect(() => {
    if (!voiceKey || voices.length === 0) return;
    const [name, lang] = voiceKey.split("\t");
    const ok = voices.some((v) => v.name === name && v.lang === lang);
    if (!ok) {
      setVoiceKey("");
    }
  }, [voices, voiceKey]);

  const selectedVoice = useMemo(() => {
    if (!voiceKey) return null;
    const [name, lang] = voiceKey.split("\t");
    return (
      voices.find((v) => v.name === name && v.lang === lang) ?? null
    );
  }, [voices, voiceKey]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    voiceRef.current = selectedVoice;
  }, [selectedVoice]);

  const stop = useCallback(() => {
    if (!supported) return;
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    stop();
  }, [lesson?.slug, supported, stop]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!supported || chunks.length === 0) return;

    window.speechSynthesis.cancel();
    cancelledRef.current = false;

    let index = 0;
    const runNext = () => {
      if (cancelledRef.current) {
        setStatus("idle");
        return;
      }
      while (index < chunks.length && !chunks[index]?.trim()) {
        index += 1;
      }
      if (index >= chunks.length) {
        setStatus("idle");
        return;
      }

      const text = chunks[index]!.trim();
      index += 1;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.min(1.35, Math.max(0.75, rateRef.current));
      utterance.pitch = 1;
      const v = voiceRef.current;
      if (v) {
        utterance.voice = v;
      }
      utterance.onend = () => {
        if (cancelledRef.current) {
          setStatus("idle");
          return;
        }
        runNext();
      };
      utterance.onerror = () => {
        if (!cancelledRef.current) {
          setStatus("idle");
        }
      };

      window.speechSynthesis.speak(utterance);
      setStatus("playing");
    };

    runNext();
  }, [chunks, supported]);

  return {
    supported,
    voices,
    voiceKey,
    setVoiceKey,
    rate,
    setRate,
    status,
    speak,
    stop,
    chunkCount: chunks.length,
  };
}
