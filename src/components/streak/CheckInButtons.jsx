// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CheckInButtons({ onCheckIn, todayCheckedIn }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [showRelapseDialog, setShowRelapseDialog] = useState(false);

  const handleClean = () => {
    onCheckIn('clean', note);
    setNote('');
    setShowNote(false);
  };

  const handleRelapse = () => {
    setShowRelapseDialog(true);
  };

  const confirmRelapse = () => {
    onCheckIn('relapse', note);
    setNote('');
    setShowNote(false);
    setShowRelapseDialog(false);
  };

  if (todayCheckedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Checked in today</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleClean}
          className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-xl"
        >
          <Shield className="w-4 h-4 mr-2" />
          I Stayed Clean
        </Button>
        <Button
          onClick={handleRelapse}
          variant="outline"
          className="h-14 border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-sm rounded-xl"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          I Relapsed
        </Button>
      </div>

      <button
        onClick={() => setShowNote(!showNote)}
        className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full py-1"
      >
        Add a note
        {showNote ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {showNote && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Textarea
              placeholder="How are you feeling today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-secondary border-border resize-none h-20 text-sm rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showRelapseDialog} onOpenChange={setShowRelapseDialog}>
        <AlertDialogContent className="bg-card border-border max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Log a Relapse?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will reset your current streak. Remember, every setback is a setup for a comeback. You've got this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRelapse}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
