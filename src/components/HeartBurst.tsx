"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  /** Change this value to retrigger the burst */
  burstKey: number;
};

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 21s-7.5-4.35-10-9.2C.2 8.4 2.1 5.5 5.3 5.1c1.7-.2 3.3.6 4.2 2 0 0 .9 1.3 2.5 1.3S14.5 7 14.5 7c.9-1.4 2.5-2.2 4.2-2 3.2.4 5.1 3.3 3.3 6.7C19.5 16.6 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HeartBurst({ burstKey }: Props) {
  const particles = useMemo(() => {
    const n = 18;
    return Array.from({ length: n }).map((_, i) => {
      const angle = (i / n) * Math.PI * 2;
      const radius = 120 + (i % 3) * 22;
      return {
        id: i,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius - 40,
        delay: i * 0.015,
        size: 10 + (i % 4) * 3,
      };
    });
  }, [burstKey]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={`${burstKey}-${p.id}`}
          className="absolute left-1/2 top-[70%]"
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.7,
            rotate: 0,
            filter: "blur(0px)",
          }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: [0, 1, 0],
            scale: [0.7, 1.15, 0.9],
            rotate: [0, 18, -12],
            filter: ["blur(0px)", "blur(0px)", "blur(2px)"],
          }}
          transition={{
            delay: p.delay,
            duration: 1.25,
            ease: "easeOut",
          }}
          style={{ willChange: "transform" }}
        >
          <div
            className="text-[#ff9ab4] drop-shadow-[0_0_18px_rgba(255,154,180,0.45)]"
            style={{ fontSize: p.size }}
          >
            <HeartIcon />
          </div>
        </motion.div>
      ))}
    </div>
  );
}


