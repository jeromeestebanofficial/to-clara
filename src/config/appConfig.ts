import { claraConfig } from "../../clara.config";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const appConfig = {
  targetDate: claraConfig.targetDate,

  countdown: {
    title: (claraConfig as any).countdown?.title ?? "Counting Down",
    subtitle: (claraConfig as any).countdown?.subtitle ?? "",
  },

  prep: {
    kicker: claraConfig.prep.kicker,
    title: claraConfig.prep.title,
    subtitle: claraConfig.prep.subtitle,
    items: claraConfig.prep.items,
    startLabel: claraConfig.prep.startLabel,
    loadingLabel: claraConfig.prep.loadingLabel,
    countdownLabel: claraConfig.prep.countdownLabel,
    initialLoadingMs: clamp((claraConfig.prep as any).initialLoadingMs ?? 900, 0, 10000),
    countdownSeconds: clamp((claraConfig.prep as any).countdownSeconds ?? 5, 1, 10),
  },

  messages: claraConfig.messages,
  messageReadingTimeMs: claraConfig.messageReadingTimeMs,

  audio: {
    background: claraConfig.audio.background,
    parts: claraConfig.audio.parts,
    backgroundVolume: clamp(claraConfig.audio.backgroundVolume, 0, 1),
    voiceVolume: clamp((claraConfig.audio as any).voiceVolume ?? 0.55, 0, 1),
  },

  fireworks: {
    durationMs: claraConfig.fireworks.durationMs,
    heartsOverlay: Boolean((claraConfig.fireworks as any).heartsOverlay),
  },

  finale: claraConfig.finale,
} as const;


