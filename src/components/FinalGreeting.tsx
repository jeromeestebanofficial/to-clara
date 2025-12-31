"use client";
import { motion } from "framer-motion";
import EnvelopeLetter from "./EnvelopeLetter";
import { appConfig } from "@/config/appConfig";

export default function FinalGreeting() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-screen text-center px-6 z-20 relative"
    >
      <EnvelopeLetter
        title={appConfig.finale.title}
        body={appConfig.finale.body}
        lastPageText={appConfig.finale.lastPageText}
      />
    </motion.div>
  );
}
