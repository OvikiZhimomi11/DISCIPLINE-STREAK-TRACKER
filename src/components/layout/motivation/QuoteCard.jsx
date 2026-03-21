import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const categoryIcons = {
  discipline: '🔥',
  focus: '🎯',
  'self-control': '🛡️',
};

export default function QuoteCard({ quote, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <p className="text-foreground text-base font-medium leading-relaxed mb-3">
        "{quote.text}"
      </p>
      <Badge variant="secondary" className="text-xs font-medium bg-secondary text-muted-foreground border-0">
        {categoryIcons[quote.category]} {quote.category}
      </Badge>
    </motion.div>
  );
}