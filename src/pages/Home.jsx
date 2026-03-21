// @ts-nocheck
import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import StreakRing from '@/components/streak/StreakRing';
import CheckInButtons from '@/components/streak/CheckInButtons';
import { getDailyQuote } from '@/lib/quote';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullIndicator from '@/components/ui/PullIndicator';

export default function Home() {
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dailyQuote = useMemo(() => getDailyQuote(), []);
  const checkInEntity = /** @type {any} */ (base44.entities.CheckIn);
  const userSettingsEntity = /** @type {any} */ (base44.entities.UserSettings);

  const { data: checkIns = [], isLoading: loadingCheckIns } = useQuery({
    queryKey: ['checkins'],
    queryFn: () => checkInEntity.list('-date', 500),
  });

  const { data: settingsList = [], isLoading: loadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => userSettingsEntity.list(),
  });

  const settings = settingsList[0];
  const todayStatus = checkIns.find(ci => ci.date === today)?.status;

  const createCheckIn = useMutation({
    mutationFn: (data) => checkInEntity.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['checkins'] }),
  });

  const createSettings = useMutation({
    mutationFn: (data) => userSettingsEntity.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const updateSettings = useMutation({
    mutationFn: ({ id, data }) => userSettingsEntity.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const todayCheckedIn = checkIns.some(ci => ci.date === today);

  const currentStreak = useMemo(() => {
    if (!settings?.streak_start_date) return 0;
    if (todayStatus === 'relapse') return 0;

    const streakDays = differenceInDays(new Date(), new Date(settings.streak_start_date));
    return todayStatus === 'clean' ? streakDays + 1 : streakDays;
  }, [settings, todayStatus]);

  const longestStreak = settings?.longest_streak || 0;

  const handleCheckIn = async (status, note) => {
    await createCheckIn.mutateAsync({ date: today, status, note: note || undefined });
    if (status === 'relapse') {
      const newLongest = Math.max(longestStreak, currentStreak);
      if (settings) {
        await updateSettings.mutateAsync({ id: settings.id, data: { streak_start_date: today, longest_streak: newLongest } });
      } else {
        await createSettings.mutateAsync({ streak_start_date: today, longest_streak: newLongest });
      }
    } else {
      if (!settings) {
        await createSettings.mutateAsync({ streak_start_date: today, longest_streak: 0 });
      }
      const newStreak = currentStreak + 1;
      if (newStreak > longestStreak && settings) {
        await updateSettings.mutateAsync({ id: settings.id, data: { longest_streak: newStreak } });
      }
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['checkins'] }),
      queryClient.invalidateQueries({ queryKey: ['settings'] }),
    ]);
  };

  const { indicatorRef, scrollProps } = usePullToRefresh(handleRefresh);

  if (loadingCheckIns || loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-auto overscroll-none" {...scrollProps}>
      <PullIndicator ref={indicatorRef} />
      <div className="max-w-lg mx-auto px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <h1 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">
            Your Journey
          </h1>
          <p className="text-lg font-bold text-foreground">Stay Strong</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <StreakRing days={currentStreak} longestStreak={longestStreak} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <Trophy className="w-4 h-4 text-chart-4" />
          <span className="text-sm text-muted-foreground">
            Longest streak: <span className="font-semibold text-foreground">{longestStreak} days</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <CheckInButtons onCheckIn={handleCheckIn} todayCheckedIn={todayCheckedIn} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <p className="text-sm text-foreground font-medium leading-relaxed italic">
            "{dailyQuote.text}"
          </p>
          <p className="text-xs text-muted-foreground mt-2 capitalize">- {dailyQuote.category}</p>
        </motion.div>
      </div>
    </div>
  );
}
