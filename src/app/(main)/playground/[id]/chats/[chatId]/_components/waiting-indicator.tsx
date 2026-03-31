"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Loader } from "@/components/ui/loader";

const SHIMMER_PHRASES = [
  "Analyzing scores...",
  "Loading leadership framework...",
  "Developing deeper insights...",
];

const CYCLE_MS = 3000;

export function WaitingIndicator({
  isFirstMessage,
}: {
  isFirstMessage: boolean;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!isFirstMessage) return;
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % SHIMMER_PHRASES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [isFirstMessage]);

  if (!isFirstMessage) {
    return (
      <div className="py-1">
        <Loader variant="typing" size="sm" />
      </div>
    );
  }

  return (
    <div className="py-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={phraseIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <Shimmer as="span" className="text-sm" duration={2}>
            {SHIMMER_PHRASES[phraseIndex]}
          </Shimmer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
