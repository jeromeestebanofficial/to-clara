"use client";
import { useEffect, useRef } from "react";
import { appConfig } from "@/config/appConfig";
import { startBackgroundMusic, stopBackgroundMusic } from "@/lib/backgroundMusicController";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Keep ref for legacy cleanup semantics (not used for playback anymore).
    audioRef.current = null;

    startBackgroundMusic({
      src: appConfig.audio.background,
      volume: appConfig.audio.backgroundVolume,
    });
    
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  return null;
}

