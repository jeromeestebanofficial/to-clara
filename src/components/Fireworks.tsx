"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { appConfig } from "@/config/appConfig";
import HeartConfettiOverlay from "./HeartConfettiOverlay";

interface FireworksProps {
  onComplete: () => void;
}

export default function Fireworks({ onComplete }: FireworksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    Math.ceil(appConfig.fireworks.durationMs / 1000)
  );
  const [ending, setEnding] = useState(false);

  const totalSeconds = useMemo(
    () => Math.max(1, Math.ceil(appConfig.fireworks.durationMs / 1000)),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let stopped = false;
    let stopFn: null | (() => void) = null;
    const startAt = Date.now();
    setEnding(false);
    setRemainingSeconds(totalSeconds);
    
    // Dynamic import fixes "not working" cases where the lib touches window at import-time.
    (async () => {
      const mod = await import("fireworks-js");
      if (stopped) return;

      const FireworksJS = mod.Fireworks;
      const fireworks = new FireworksJS(container, {
        autoresize: true,
        opacity: 0.6,
        acceleration: 1.04,
        friction: 0.98,
        gravity: 1.3,
        particles: 70,
        traceLength: 4,
        traceSpeed: 10,
        explosion: 6,
        intensity: 35,
        flickering: 60,
        lineStyle: "round",
        hue: { min: 0, max: 360 },
        delay: { min: 25, max: 50 },
        // Launch from bottom, narrow-ish center band like real fireworks.
        rocketsPoint: { min: 40, max: 60 },
        lineWidth: {
          explosion: { min: 1, max: 3 },
          trace: { min: 1, max: 2 },
        },
        brightness: { min: 55, max: 85 },
        decay: { min: 0.015, max: 0.03 },
        // Optional interactivity (click adds bursts).
        mouse: { click: true, move: false, max: 2 },
      });

      fireworks.start();
      stopFn = () => fireworks.stop();
    })().catch(() => {
      // If something goes wrong, still progress instead of getting stuck.
      onComplete();
    });

    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startAt;
      const remainingMs = Math.max(0, appConfig.fireworks.durationMs - elapsed);
      const nextSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setRemainingSeconds(nextSec);
    }, 200);

    // End after configured duration (with a tiny cinematic fade)
    const timeout = setTimeout(() => {
      stopFn?.();
      setEnding(true);
      // let the overlay fade before we switch to the envelope
      window.setTimeout(() => onComplete(), 700);
    }, appConfig.fireworks.durationMs);

    return () => {
      stopped = true;
      clearInterval(tick);
      clearTimeout(timeout);
      stopFn?.();
    };
  }, [onComplete]);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-10 bg-transparent" // Above background, below foreground content
        style={{ width: "100%", height: "100%" }}
      />
      {appConfig.fireworks.heartsOverlay && (
        <HeartConfettiOverlay durationMs={appConfig.fireworks.durationMs} />
      )}

      {/* UI overlay */}
      <div
        className={`fixed inset-0 z-20 pointer-events-none transition-opacity duration-700 ${
          ending ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* countdown */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <div className="rounded-full border border-white/14 bg-white/8 backdrop-blur-xl px-5 py-2 shadow-[0_16px_70px_rgba(0,0,0,0.45)]">
            <div className="text-xs tracking-[0.38em] uppercase text-white/65 text-center">
              Fireworks ending in
            </div>
            <div className="mt-1 text-center font-serif text-4xl leading-none text-white">
              {remainingSeconds}
            </div>
          </div>
        </div>

        {/* bottom frosted hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(560px,calc(100vw-24px))]">
          <div className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-2xl px-5 py-4 shadow-[0_18px_90px_rgba(0,0,0,0.45)]">
            <div className="text-sm md:text-base text-white/80 text-center">
              Wait a moment… something special is coming.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
