"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type Props = {
  durationMs: number;
};

export default function HeartConfettiOverlay({ durationMs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const instance = confetti.create(canvas, { resize: true, useWorker: true });

    // Heart shape using emoji text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heartShape = (confetti as any).shapeFromText
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (confetti as any).shapeFromText({ text: "❤", scalar: 2.2 })
      : undefined;

    const colors = ["#ff5a9a", "#ff9ab4", "#ffd1dc", "#ffffff"];
    const endAt = Date.now() + durationMs;

    const fire = () => {
      const timeLeft = endAt - Date.now();
      if (timeLeft <= 0) return false;

      const originX = 0.2 + Math.random() * 0.6;
      instance({
        particleCount: 18,
        spread: 32,
        startVelocity: 48,
        ticks: 220,
        gravity: 1.05,
        scalar: 1.0,
        drift: (Math.random() - 0.5) * 0.8,
        origin: { x: originX, y: 1.05 }, // from bottom
        colors,
        // Only set shapes if the API exists; otherwise default confetti
        ...(heartShape ? { shapes: [heartShape] } : {}),
      });

      // smaller secondary burst
      instance({
        particleCount: 10,
        spread: 24,
        startVelocity: 42,
        ticks: 200,
        gravity: 1.08,
        scalar: 0.9,
        drift: (Math.random() - 0.5) * 0.6,
        origin: { x: originX + (Math.random() - 0.5) * 0.12, y: 1.05 },
        colors,
        ...(heartShape ? { shapes: [heartShape] } : {}),
      });

      return true;
    };

    // A burst immediately on mount
    fire();

    const interval = setInterval(() => {
      const ok = fire();
      if (!ok) clearInterval(interval);
    }, 900);

    return () => {
      clearInterval(interval);
      // no explicit dispose required
    };
  }, [durationMs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 pointer-events-none"
      aria-hidden="true"
    />
  );
}


