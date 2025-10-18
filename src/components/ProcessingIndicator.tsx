import { motion, AnimatePresence } from "motion/react";
import { ANALYSIS_TIMING } from "../constants";

interface ProcessingIndicatorProps {
  elapsedSeconds: number;
}

const steps = [
  "Analyzing the room",
  "Finding recommendations",
  "Finalizing",
];

export function ProcessingIndicator({ elapsedSeconds }: ProcessingIndicatorProps) {
  // Determine which step to show
  const currentStepIndex = Math.min(Math.floor(elapsedSeconds / ANALYSIS_TIMING.STEP_DURATION_SECONDS), steps.length - 1);
  const currentStep = steps[currentStepIndex];
  const showThought = elapsedSeconds >= ANALYSIS_TIMING.COMPLETION_THRESHOLD_SECONDS;

  return (
    <div className="px-4 py-6">
      <AnimatePresence mode="wait">
        {!showThought ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Animated dots */}
              <div className="flex gap-1.5 pt-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="size-2.5 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent font-medium"
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                  >
                    {currentStep}
                  </motion.p>
                </AnimatePresence>
                <p className="text-sm text-gray-500 mt-1.5">{elapsedSeconds}s</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="thought"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <p className="text-gray-900 font-medium">
              Thought for 3s
            </p>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-gray-900"
            >
              <path
                d="M7 10L12 10M12 10L9.5 7.5M12 10L9.5 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
