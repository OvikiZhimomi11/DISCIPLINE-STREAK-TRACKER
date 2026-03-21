import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PinLock from '@/components/settings/PinLock';

export default function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);

  const { data: settingsList = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.UserSettings.list(),
  });

  const settings = settingsList[0];
  const pinEnabled = settings?.pin_enabled && settings?.pin;

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (pinEnabled && !unlocked) {
    return <PinLock correctPin={settings.pin} onUnlock={handleUnlock} />;
  }

  return children;
}