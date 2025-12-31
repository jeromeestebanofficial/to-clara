"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { appConfig } from "@/config/appConfig";
import { startBackgroundMusic } from "@/lib/backgroundMusicController";

type Props = {
  onComplete: () => void;
  onCountdownStart?: () => void;
};

type ItemKey = "earbuds" | "volume" | "comfort";

const icons: Record<ItemKey, React.ReactNode> = {
  earbuds: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.5 9.2c-1.4 0-2.5 1.2-2.5 2.6v3.3c0 1.4 1.1 2.6 2.5 2.6H9V9.2H7.5Z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.7"
      />
      <path
        d="M16.5 9.2H15v10.5h1.5c1.4 0 2.5-1.2 2.5-2.6v-3.3c0-1.4-1.1-2.6-2.5-2.6Z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.7"
      />
      <path
        d="M12 4.2c-3.9 0-7 3.2-7 7.2"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 4.2c3.9 0 7 3.2 7 7.2"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
  volume: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 10v4h3l4 3V7L7 10H4Z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M16 9c1.3 1.3 1.3 4.7 0 6"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M18.5 6.5c2.4 2.4 2.4 8.6 0 11"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
  comfort: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 10.5h10c1.1 0 2 .9 2 2v2.5H5v-2.5c0-1.1.9-2 2-2Z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10.5V7.8c0-1 .8-1.8 1.8-1.8h5.4c1 0 1.8.8 1.8 1.8v2.7"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 18v-3"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M17 18v-3"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function PrepChecklist({ onComplete, onCountdownStart }: Props) {
  const cfg = appConfig.prep;

  const [checked, setChecked] = useState<Record<ItemKey, boolean>>({
    earbuds: false,
    volume: false,
    comfort: false,
  });
  const allChecked = checked.earbuds && checked.volume && checked.comfort;

  const [phase, setPhase] = useState<"loading" | "checklist" | "countdown">(
    cfg.initialLoadingMs > 0 ? "loading" : "checklist"
  );
  const [count, setCount] = useState(cfg.countdownSeconds);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = window.setTimeout(() => setPhase("checklist"), cfg.initialLoadingMs);
    return () => window.clearTimeout(t);
  }, [cfg.initialLoadingMs, phase]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      onComplete();
      return;
    }
    const t = window.setTimeout(() => setCount((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [count, onComplete, phase]);

  const items = useMemo(
    () =>
      cfg.items as ReadonlyArray<{
        key: ItemKey;
        title: string;
        subtitle?: string;
      }>,
    [cfg.items]
  );

  const toggle = (key: ItemKey) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const start = () => {
    if (!allChecked) return;
    // Start background music exactly on the user gesture (best chance to pass autoplay rules).
    startBackgroundMusic({
      src: appConfig.audio.background,
      volume: appConfig.audio.backgroundVolume,
    });
    onCountdownStart?.();
    setCount(cfg.countdownSeconds);
    setPhase("countdown");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6 z-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="rounded-3xl border border-white/12 bg-white/6 backdrop-blur-xl shadow-[0_24px_120px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="p-6 md:p-7">
            <div className="text-xs tracking-[0.42em] uppercase text-white/60">
              {cfg.kicker}
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-serif text-white">
              {cfg.title}
            </div>
            <div className="mt-2 text-sm md:text-base text-white/70">
              {cfg.subtitle}
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                {phase === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="py-10 grid place-items-center"
                  >
                    <div className="h-10 w-10 rounded-full border-2 border-white/25 border-t-white/80 animate-spin" />
                    <div className="mt-4 text-sm tracking-[0.3em] uppercase text-white/60">
                      {cfg.loadingLabel}
                    </div>
                  </motion.div>
                )}

                {phase === "checklist" && (
                  <motion.div
                    key="checklist"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="grid gap-3"
                  >
                    {items.map((it) => {
                      const isOn = checked[it.key];
                      return (
                        <button
                          key={it.key}
                          type="button"
                          onClick={() => toggle(it.key)}
                          className={`w-full text-left rounded-2xl border px-4 py-4 flex gap-3 items-start transition ${
                            isOn
                              ? "border-emerald-300/35 bg-emerald-300/10"
                              : "border-white/12 bg-white/4 hover:bg-white/6"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 h-10 w-10 rounded-2xl bg-white/6 border border-white/10 grid place-items-center">
                            {icons[it.key]}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-base md:text-[1.05rem] text-white/90">
                                {it.title}
                              </div>
                              <div
                                className={`shrink-0 h-6 w-6 rounded-full border grid place-items-center ${
                                  isOn
                                    ? "border-emerald-300/60 bg-emerald-300/20"
                                    : "border-white/18 bg-white/6"
                                }`}
                                aria-hidden="true"
                              >
                                {isOn && (
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M20 6L9 17l-5-5"
                                      stroke="rgba(255,255,255,0.95)"
                                      strokeWidth="2.4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            {it.subtitle && (
                              <div className="mt-1 text-sm text-white/60">
                                {it.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={start}
                      disabled={!allChecked}
                      className={`mt-3 w-full rounded-2xl py-3.5 font-medium tracking-[0.22em] uppercase transition ${
                        allChecked
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-white/12 text-white/45 cursor-not-allowed"
                      }`}
                    >
                      {cfg.startLabel}
                    </button>
                  </motion.div>
                )}

                {phase === "countdown" && (
                  <motion.div
                    key="countdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="py-10 grid place-items-center"
                  >
                    <div className="h-10 w-10 rounded-full border-2 border-white/25 border-t-white/80 animate-spin" />
                    <div className="mt-5 text-5xl md:text-6xl font-serif text-white">
                      {Math.max(0, count)}
                    </div>
                    <div className="mt-2 text-xs tracking-[0.35em] uppercase text-white/60">
                      {cfg.countdownLabel}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


