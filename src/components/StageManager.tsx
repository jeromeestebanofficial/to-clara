"use client";

import { useState, useEffect } from "react";
import Countdown from "./Countdown";
import TriggerButton from "./TriggerButton";
import PrepChecklist from "./PrepChecklist";
import MessageSequence from "./MessageSequence";
import Fireworks from "./Fireworks";
import FinalGreeting from "./FinalGreeting";
import BackgroundMusic from "./BackgroundMusic";
import SceneBackground from "./SceneBackground";
import { appConfig } from "@/config/appConfig";

export type Stage =
  | "COUNTDOWN"
  | "TRIGGER"
  | "PREP"
  | "SEQUENCE"
  | "FIREWORKS"
  | "FINALE";

export default function StageManager() {
  const [stage, setStage] = useState<Stage>("COUNTDOWN");
  const [isClient, setIsClient] = useState(false);
  const [prepCountdownStarted, setPrepCountdownStarted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const targetDate = new Date(appConfig.targetDate);
    const now = new Date();
    
    // If current date is after target, skip countdown
    if (now >= targetDate) {
      setStage("TRIGGER");
    }
  }, []);

  useEffect(() => {
    if (stage !== "PREP") setPrepCountdownStarted(false);
  }, [stage]);

  if (!isClient) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        {/* Loading state or initial render matching server */}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white overflow-hidden relative">
      {/* One shared background for all stages */}
      <SceneBackground />

      {(stage === "SEQUENCE" ||
        stage === "FIREWORKS" ||
        stage === "FINALE" ||
        (stage === "PREP" && prepCountdownStarted)) && (
        <BackgroundMusic />
      )}
      
      {stage === "COUNTDOWN" && (
        <Countdown onComplete={() => setStage("TRIGGER")} />
      )}
      
      {stage === "TRIGGER" && (
        <TriggerButton onComplete={() => setStage("PREP")} />
      )}

      {stage === "PREP" && (
        <PrepChecklist
          onCountdownStart={() => setPrepCountdownStarted(true)}
          onComplete={() => setStage("SEQUENCE")}
        />
      )}
      
      {stage === "SEQUENCE" && (
        <MessageSequence onComplete={() => setStage("FIREWORKS")} />
      )}
      
      {stage === "FIREWORKS" && (
        <>
          <Fireworks onComplete={() => setStage("FINALE")} />
        </>
      )}
      
      {stage === "FINALE" && (
        <FinalGreeting />
      )}
    </div>
  );
}

