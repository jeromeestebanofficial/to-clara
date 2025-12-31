"use client";

let audioEl: HTMLAudioElement | null = null;
let endedHandler: (() => void) | null = null;

export function startBackgroundMusic(opts: { src: string; volume: number }) {
  if (!opts.src) return;

  if (!audioEl || audioEl.src !== new URL(opts.src, window.location.href).href) {
    // (Re)create if missing or src changed.
    if (audioEl) {
      try {
        audioEl.pause();
      } catch {}
    }

    audioEl = new Audio(opts.src);
    audioEl.loop = true;
    audioEl.preload = "auto";

    endedHandler = () => {
      if (!audioEl) return;
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    };
    audioEl.addEventListener("ended", endedHandler);
  }

  audioEl.volume = Math.max(0, Math.min(1, opts.volume));
  audioEl.play().catch(() => {});
}

export function stopBackgroundMusic() {
  if (!audioEl) return;
  try {
    audioEl.pause();
  } catch {}
}


