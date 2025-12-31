"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import FloatingParticles from "./FloatingParticles";

export default function SceneBackground() {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(35);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 25, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 25, mass: 0.6 });

  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${smoothX}% ${smoothY}%, rgba(255, 214, 140, 0.12), rgba(56, 189, 248, 0.06), transparent 55%)`;

  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      mouseX.set(x);
      mouseY.set(y);
    };
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onPointer = (e: PointerEvent) => onMove(e.clientX, e.clientY);

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base midnight gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060914] via-[#03040a] to-black" />

      {/* Soft interactive spotlight following mouse */}
      <motion.div
        className="absolute inset-0"
        style={{ background: spotlight }}
      />

      {/* Slow drifting aurora blobs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-[90px] bg-cyan-500/10"
        animate={{ x: [0, 120, 0], y: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[620px] w-[620px] rounded-full blur-[110px] bg-amber-400/10"
        animate={{ x: [0, -120, 0], y: [0, -80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stars/particles */}
      <FloatingParticles />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.45)_70%,_rgba(0,0,0,0.75)_100%)]" />
    </div>
  );
}


