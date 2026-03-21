import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import CalendarHeatmap from '@/components/stats/CalendarHeatmap';
import StatCard from '@/components/stats/StatCard';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullIndicator from '@/components/ui/PullIndicator';

export default function Stats() {
  const queryClient = useQueryClient();

  const { data: checkIns = [], isLoading } = useQuery({
    queryKey: ['checkins'],
    queryFn: () => base44.entities.CheckIn.list('-date', 500),
  });

  const stats = useMemo(() => {
    const total = checkIns.length;
    const clean = checkIns.filter(ci => ci.status === 'clean').length;
    const relapses = checkIns.filter(ci => ci.status === 'relapse').length;
    const rate = total > 0 ? Math.round((clean / total) * 100) : 0;
    return { total, clean, relapses, rate };
  }, [checkIns]);

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['checkins'] });
  };

  const { indicatorRef, scrollProps } = usePullToRefresh(handleRefresh);

  if (isLoading) {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">
            Progress
          </h1>
          <p className="text-lg font-bold text-foreground">Your Statistics</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Total Days" value={stats.total} icon={Calendar} delay={0.1} />
          <StatCard label="Success Rate" value={`${stats.rate}%`} icon={Target} color="text-primary" delay={0.15} />
          <StatCard label="Clean Days" value={stats.clean} icon={TrendingUp} color="text-primary" delay={0.2} />
          <StatCard label="Relapses" value={stats.relapses} icon={AlertTriangle} color="text-destructive" delay={0.25} />
        </div>

        {stats.rate > 0 && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Success Rate</span>
              <span>{stats.rate}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.rate}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <CalendarHeatmap checkIns={checkIns} />
        </motion.div>
      </div>
    </div>
  );
}