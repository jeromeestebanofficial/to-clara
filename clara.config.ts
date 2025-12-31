// Edit this file to customize the whole experience without touching component code.
// After changing it, restart `npm run dev`.

export const claraConfig = {
  targetDate: "2025-12-31T23:30:00",

  countdown: {
    title: "Will open today at 11:30 PM",
    subtitle: "This is for Clara…",
  },

  prep: {
    kicker: "Before we start…",
    title: "Make it cozy",
    subtitle:
      "Use earbuds, volume up, sit comfortable and listen. When you’re ready, we’ll begin.",
    items: [
      {
        key: "earbuds",
        title: "Use earbuds",
        subtitle: "Put your earbuds in so it feels close and cinematic.",
      },
      {
        key: "volume",
        title: "Volume up",
        subtitle: "Turn it up a bit (not too loud).",
      },
      {
        key: "comfort",
        title: "Sit comfortable",
        subtitle: "Get comfy and listen…",
      },
    ],
    startLabel: "Let’s start",
    loadingLabel: "Loading…",
    countdownLabel: "Starting",
    initialLoadingMs: 900,
    countdownSeconds: 5,
  },

  // Messages shown in the sequence (and optionally matched to audio parts).
  messages: [
    "Clara, as this year comes to an end...",
    "I just want to say thank you. I’m genuinely glad I met you, and I appreciate the moments we shared and the conversations we had...",
    "Being around you reminded me that connection can feel light and honest. I value how you made space for me to be myself, without needing to explain or pretend...",
    "In your presence, I felt more whole again, and it reminded me that who I am can still be accepted and cared for...",
    "I still remember the small moments, simple talks, quiet time, shared laughs. They mattered to me, and I’m thankful I got to experience them with you.",
    "I don’t need to define or label anything. I just want you to know that I appreciate you, and I respect what we had for what it was...",
    "Whatever comes next, I’m grateful for this chapter. Thank you for being part of my year."
  ],

  messageReadingTimeMs: 8000,

  audio: {
    background: "/audio/[ 샤이니 (SHINee) - Stand By Me ] 피아노 커버.mp3",
    parts: [
      "/audio/audio 1.mp3",
      "/audio/audio 2.mp3",
      "/audio/audio 3.mp3",
      "/audio/audio 4.mp3",
      "/audio/audio 5.mp3",
      "/audio/audio 6.mp3",
      "/audio/audio 7.mp3",
    ],
    backgroundVolume: 0.3,
    // Voice volume for the message sequence (0..1). Keep it softer so it blends with the background music.
    voiceVolume: 0.4,
  },

  fireworks: {
    durationMs: 20000,
    heartsOverlay: true,
  },

  finale: {
    title: "Happy New Year, Clara",
    body: "I genuinely wish you all the happiness, love, and good things in 2026, always.",
    lastPageText: "",
  },
} as const;


