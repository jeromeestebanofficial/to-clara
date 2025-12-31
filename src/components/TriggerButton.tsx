"use client";
import { motion } from "framer-motion";

interface TriggerButtonProps {
  onComplete: () => void;
}

export default function TriggerButton({ onComplete }: TriggerButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen z-20 relative"
    >
      <motion.button
        type="button"
        aria-label="Play"
        onClick={onComplete}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex items-center justify-center"
      >
        {/* pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255,214,140,0.0)",
              "0 0 0 18px rgba(255,214,140,0.0)",
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />

        {/* glass disc */}
        <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full border border-white/20 bg-white/8 backdrop-blur-xl shadow-[0_18px_80px_rgba(0,0,0,0.45)]">
          {/* soft inner glow */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,_rgba(255,214,140,0.20),_transparent_55%)]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_75%,_rgba(56,189,248,0.12),_transparent_55%)]" />

          {/* play icon */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_18px_rgba(255,214,140,0.35)]"
              aria-hidden="true"
            >
              <path
                d="M9.5 7.5V16.5L17 12L9.5 7.5Z"
                fill="rgba(255, 255, 255, 0.92)"
              />
            </svg>
          </motion.div>

          {/* subtle sheen */}
          <motion.div
            className="absolute -inset-2 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.14) 35%, transparent 60%)",
              maskImage: "radial-gradient(circle, black 55%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 72%)",
            }}
            animate={{ x: ["-30%", "40%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-full mt-6 text-xs md:text-sm tracking-[0.35em] uppercase text-white/70"
        >
          Play
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
