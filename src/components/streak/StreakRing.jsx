import React from 'react';
import { motion } from 'framer-motion';

export default function StreakRing({ days, longestStreak }) {
  const maxDays = Math.max(longestStreak, 90, days);
  const progress = Math.min(days / maxDays, 1);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="6"
        />
        {/* Progress ring */}
        <motion.circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {/* Glow effect */}
        <motion.circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          opacity="0.3"
          filter="blur(4px)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-7xl font-black text-foreground tracking-tighter"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {days}
        </motion.span>
        <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mt-1">
          {days === 1 ? 'Day' : 'Days'}
        </span>
      </div>
    </div>
  );
}