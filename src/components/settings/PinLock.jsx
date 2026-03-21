import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete } from 'lucide-react';

export default function PinLock({ correctPin, onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, correctPin, onUnlock]);

  const handlePress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Enter PIN</h2>
        <p className="text-sm text-muted-foreground mb-8">Enter your 4-digit PIN to unlock</p>

        <motion.div
          className="flex gap-4 mb-10"
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? error ? 'bg-destructive scale-110' : 'bg-primary scale-110'
                  : 'bg-secondary'
              }`}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((item, i) => {
            if (item === null) return <div key={i} />;
            if (item === 'del') {
              return (
                <button
                  key={i}
                  onClick={handleDelete}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => handlePress(String(item))}
                className="w-16 h-16 rounded-2xl bg-secondary hover:bg-secondary/80 flex items-center justify-center text-xl font-semibold text-foreground transition-colors active:scale-95"
              >
                {item}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}