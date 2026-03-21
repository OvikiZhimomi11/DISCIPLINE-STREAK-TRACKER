// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, RotateCcw, UserX } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const queryClient = useQueryClient();
  const checkInEntity = /** @type {any} */ (base44.entities.CheckIn);
  const userSettingsEntity = /** @type {any} */ (base44.entities.UserSettings);

  const { data: settingsList = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => userSettingsEntity.list(),
  });

  const settings = settingsList[0];

  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (settings) {
      setPinEnabled(settings.pin_enabled || false);
      setPin(settings.pin || '');
    }
  }, [settings]);

  const createSettings = useMutation({
    mutationFn: (data) => userSettingsEntity.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const updateSettings = useMutation({
    mutationFn: ({ id, data }) => userSettingsEntity.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const savePin = async () => {
    if (pinEnabled && pin.length !== 4) {
      toast.error('PIN must be exactly 4 digits');
      return;
    }
    const data = { pin_enabled: pinEnabled, pin: pinEnabled ? pin : '' };
    if (settings) {
      await updateSettings.mutateAsync({ id: settings.id, data });
    } else {
      await createSettings.mutateAsync({ ...data, streak_start_date: new Date().toISOString().split('T')[0], longest_streak: 0 });
    }
    toast.success('Settings saved');
  };

  const resetAllData = async () => {
    const checkIns = await checkInEntity.list();
    for (const ci of checkIns) {
      await checkInEntity.delete(ci.id);
    }
    if (settings) {
      await updateSettings.mutateAsync({
        id: settings.id,
        data: { streak_start_date: new Date().toISOString().split('T')[0], longest_streak: 0 },
      });
    }
    queryClient.invalidateQueries({ queryKey: ['checkins'] });
    toast.success('All data has been reset');
  };

  const deleteAccount = async () => {
    // Delete all check-ins
    const checkIns = await checkInEntity.list();
    for (const ci of checkIns) {
      await checkInEntity.delete(ci.id);
    }
    // Delete settings
    const allSettings = await userSettingsEntity.list();
    for (const s of allSettings) {
      await userSettingsEntity.delete(s.id);
    }
    queryClient.clear();
    toast.success('Account data deleted');
    // Sign out after a short delay
    setTimeout(() => {
      base44.auth.logout();
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 pt-12 pb-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">
          Preferences
        </h1>
        <p className="text-lg font-bold text-foreground">Settings</p>
      </motion.div>

      <div className="space-y-4">
        {/* PIN Lock */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">PIN Lock</h3>
              <p className="text-xs text-muted-foreground">Protect your data with a PIN</p>
            </div>
            <Switch checked={pinEnabled} onCheckedChange={setPinEnabled} />
          </div>

          {pinEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2"
            >
              <Label className="text-xs text-muted-foreground">4-Digit PIN</Label>
              <Input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4-digit PIN"
                className="bg-secondary border-border text-foreground"
              />
            </motion.div>
          )}

          <Button
            onClick={savePin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl"
          >
            Save PIN Settings
          </Button>
        </motion.div>

        {/* Reset Data */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Reset All Data</h3>
              <p className="text-xs text-muted-foreground">Delete all check-ins and reset streaks</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Everything
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This will permanently delete all your check-in history and reset your streak. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetAllData} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* Delete Account */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <UserX className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Delete Account</h3>
              <p className="text-xs text-muted-foreground">Permanently erase all your data and sign out</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 rounded-xl">
                <UserX className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Delete your account?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  All your data - streaks, check-ins, and settings - will be permanently deleted. You will be signed out immediately. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Delete Everything & Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-6"
        >
          <p className="text-xs text-muted-foreground">NoFap Streak Tracker</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Your data stays private</p>
        </motion.div>
      </div>
    </div>
  );
}
