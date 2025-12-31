"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appConfig } from "@/config/appConfig";

interface MessageSequenceProps {
  onComplete: () => void;
}

const messages = appConfig.messages;
const READING_TIME_MS = appConfig.messageReadingTimeMs;

export default function MessageSequence({ onComplete }: MessageSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const advanceGuardRef = useRef(false);

  useEffect(() => {
    // If we've gone past the last message, we're done
    if (currentIndex >= messages.length) {
      onComplete();
      return;
    }

    advanceGuardRef.current = false;

    const advance = () => {
      if (advanceGuardRef.current) return;
      advanceGuardRef.current = true;

      // Fade out text first
      setShowText(false);
      window.setTimeout(() => setCurrentIndex((prev) => prev + 1), 1500);
    };

    // Try to play audio if available; this stage now waits for the audio to end.
    const audioPath =
      appConfig.audio.parts[currentIndex] ?? `/audio/part${currentIndex + 1}.mp3`;
    const hasAudio = typeof audioPath === "string" && audioPath.trim().length > 0;
    let audio: HTMLAudioElement | null = null;
    let fallbackTimer: number | null = null;
    let startedPlaying = false;
    let alive = true;

    // Show text
    setShowText(true);

    // Fallback: if audio is missing or can't play, we still progress (keeps the experience unblocked).
    const scheduleFallback = () => {
      if (!alive) return;
      // Important: never advance via fallback if the voice actually started playing.
      // (This prevents long clips from being cut off by the generic reading timer.)
      if (startedPlaying) return;
      if (fallbackTimer != null) return;
      fallbackTimer = window.setTimeout(advance, READING_TIME_MS);
    };

    let onEnded: (() => void) | null = null;
    let onError: (() => void) | null = null;
    let onPlaying: (() => void) | null = null;

    if (hasAudio) {
      audio = new Audio(audioPath);
      audioRef.current = audio;
      audio.preload = "auto";
      audio.volume = appConfig.audio.voiceVolume;

      onEnded = () => {
        advance();
      };
      onError = () => {
        scheduleFallback();
      };
      onPlaying = () => {
        startedPlaying = true;
        if (fallbackTimer != null) {
          window.clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
      };

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);
      audio.addEventListener("playing", onPlaying);

      audio.play().catch(() => {
        // Autoplay policies / decode errors: fall back to timer.
        if (!alive) {
          return;
        }
        scheduleFallback();
      });
    } else {
      scheduleFallback();
    }

    return () => {
      alive = false;
      if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
      if (audio) {
        if (onEnded) audio.removeEventListener("ended", onEnded);
        if (onError) audio.removeEventListener("error", onError);
        if (onPlaying) audio.removeEventListener("playing", onPlaying);
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
    };
  }, [currentIndex, onComplete]);

  // Split text into words for staggered animation
  const currentMessageWords = messages[currentIndex]?.split(" ") || [];

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative overflow-hidden z-20">
      {/* Content Container */}
      <div className="max-w-4xl px-8 text-center">
        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Glowing effect behind text */}
              <div className="absolute -inset-16 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="flex flex-wrap justify-center gap-[0.25em]">
                {currentMessageWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.05, // Stagger effect per word
                      ease: [0.2, 0.65, 0.3, 0.9],
                    }}
                    className="text-lg md:text-2xl lg:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-amber-50 via-white to-amber-100 leading-relaxed drop-shadow-2xl inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
