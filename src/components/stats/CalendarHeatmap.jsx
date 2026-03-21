import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarHeatmap({ checkIns }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const checkInMap = React.useMemo(() => {
    const map = {};
    checkIns.forEach(ci => {
      map[ci.date] = ci.status;
    });
    return map;
  }, [checkIns]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-sm font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-[10px] font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const status = checkInMap[dateStr];
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

          let bgClass = 'bg-secondary';
          if (status === 'clean') bgClass = 'bg-primary/70';
          if (status === 'relapse') bgClass = 'bg-destructive/70';

          return (
            <motion.div
              key={dateStr}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01 }}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium relative ${bgClass} ${
                isToday ? 'ring-1 ring-primary ring-offset-1 ring-offset-background' : ''
              }`}
            >
              <span className={status ? 'text-foreground' : 'text-muted-foreground'}>
                {format(day, 'd')}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/70" />
          <span>Clean</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-destructive/70" />
          <span>Relapse</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-secondary" />
          <span>No data</span>
        </div>
      </div>
    </div>
  );
}