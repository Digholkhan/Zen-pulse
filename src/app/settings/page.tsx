'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/lib/store/useUserStore';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { User, Bell, Target, ShieldAlert, Moon, Sun, Trash2, Check } from 'lucide-react';

export default function SettingsPage() {
  const { profile, updateDailyGoal, toggleReminder, addReminderTime, removeReminderTime } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();

  const [newTime, setNewTime] = useState('08:00');
  const [goal, setGoal] = useState(profile.dailyGoalMins);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGoalSave = () => {
    updateDailyGoal(goal);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
          User Account & Preferences
        </span>
        <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
          Profile & Settings
        </h1>
        <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
          Configure daily targets, practice reminders, themes, and review safety guidance.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950 flex items-center justify-center font-bold text-xl font-display">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-zen-900 dark:text-zen-100">{profile.name}</h3>
            <span className="text-xs text-zen-500">{profile.email}</span>
          </div>
        </div>
      </Card>

      {/* Daily Goal Target Settings */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-zen-500" />
          <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
            Daily Practice Target Goal
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max="120"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value) || 1)}
            className="w-24 px-4 py-2 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200 dark:border-zen-800 text-sm font-bold text-center"
          />
          <span className="text-xs text-zen-600 dark:text-zen-400">minutes per day</span>

          <Button variant="primary" size="sm" onClick={handleGoalSave} className="gap-1.5 ml-auto">
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Saved' : 'Save Goal'}</span>
          </Button>
        </div>
      </Card>

      {/* Practice Reminders */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-zen-500" />
            <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
              Practice Reminders
            </h3>
          </div>

          <button
            onClick={toggleReminder}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              profile.remindersEnabled
                ? 'bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950'
                : 'bg-zen-200 text-zen-600 dark:bg-zen-800 dark:text-zen-400'
            }`}
          >
            {profile.remindersEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {profile.remindersEnabled && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zen-900 border border-zen-200 dark:border-zen-800 text-xs font-semibold"
              />
              <Button size="sm" variant="secondary" onClick={() => addReminderTime(newTime)}>
                Add Schedule
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.reminderTimes.map((time) => (
                <div
                  key={time}
                  className="px-3 py-1.5 rounded-xl bg-zen-100 dark:bg-zen-900 text-xs font-semibold text-zen-800 dark:text-zen-200 border border-zen-200 dark:border-zen-800 flex items-center gap-2"
                >
                  <span>⏰ {time}</span>
                  <button
                    onClick={() => removeReminderTime(time)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Safety & Legal Guidance Disclaimer */}
      <Card className="p-6 space-y-3 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-display font-semibold text-base">Safety & Health Disclaimer</h3>
        </div>
        <p className="text-xs text-zen-600 dark:text-zen-400 leading-relaxed">
          ZenPulse provides educational breathwork, relaxation timers, and guided mindfulness tools. It is not a medical device, nor does it diagnose, prevent, or treat medical conditions. Always practice breath-holding or hyperventilation in a safe, seated environment and never while operating vehicles or swimming.
        </p>
      </Card>
    </div>
  );
}
