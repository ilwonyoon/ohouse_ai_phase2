import { motion } from "motion/react";

interface RenderingQueueIndicatorProps {
  count: number;
  progress: number; // 0-100
  completedCount?: number;
  onClick?: () => void;
}

export function RenderingQueueIndicator({ count, progress, completedCount = 0, onClick }: RenderingQueueIndicatorProps) {
  const totalCount = count + completedCount;
  if (totalCount === 0) return null;

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Show green if all complete, otherwise show default
  const isAllComplete = count === 0 && completedCount > 0;
  const strokeColor = isAllComplete ? "#16a34a" : "#030213";
  const displayCount = count > 0 ? count : completedCount;

  return (
    <button 
      onClick={onClick}
      className="relative size-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full active:scale-95 transition-transform"
      aria-label={`${count} rendering requests in progress`}
    >
      {/* Background circle */}
      <svg className="absolute size-full -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke={isAllComplete ? "rgba(22, 163, 74, 0.2)" : "rgba(0, 0, 0, 0.1)"}
          strokeWidth="2"
        />
      </svg>

      {/* Progress circle */}
      {count > 0 && (
        <svg className="absolute size-full -rotate-90" viewBox="0 0 32 32">
          <motion.circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </svg>
      )}

      {/* Complete circle */}
      {isAllComplete && (
        <svg className="absolute size-full -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
          />
        </svg>
      )}

      {/* Count number */}
      <span className={`text-xs font-semibold ${isAllComplete ? 'text-green-600' : ''}`}>
        {displayCount}
      </span>
    </button>
  );
}
