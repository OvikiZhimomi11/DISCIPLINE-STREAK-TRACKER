import React from 'react';
import { motion } from 'framer-motion';

export default function QuoteCard({ quote, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <p className="text-sm text-foreground font-medium leading-relaxed italic">
        "{quote.text}"
      </p>
      <p className="text-xs text-muted-foreground mt-2 capitalize">— {quote.category}</p>
    </motion.div>
  );
}