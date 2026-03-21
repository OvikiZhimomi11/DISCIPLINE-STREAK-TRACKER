import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuoteCard from '@/components/motivation/QuoteCard';
import quotes from '@/lib/quotes';

const categories = ['all', 'discipline', 'focus', 'self-control'];

export default function Motivation() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredQuotes = useMemo(() => {
    if (activeCategory === 'all') return quotes;
    return quotes.filter(q => q.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="max-w-lg mx-auto px-5 pt-12 pb-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">
          Inspiration
        </h1>
        <p className="text-lg font-bold text-foreground">Daily Motivation</p>
      </motion.div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="bg-secondary w-full grid grid-cols-4">
          {categories.map(cat => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="text-xs capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {cat === 'self-control' ? 'Control' : cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredQuotes.map((quote, i) => (
          <QuoteCard key={i} quote={quote} index={i} />
        ))}
      </div>
    </div>
  );
}