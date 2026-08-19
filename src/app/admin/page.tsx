'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Users, Wind, Activity, Database, CheckCircle } from 'lucide-react';
import { PRESET_EXERCISES } from '@/lib/data/exercises';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zen-500">
            System Administration
          </span>
          <h1 className="text-3xl font-display font-extrabold text-zen-900 dark:text-zen-100">
            Admin Management & Telemetry
          </h1>
          <p className="text-xs text-zen-600 dark:text-zen-400 mt-1">
            Manage exercises, audio tracks, user roles, and platform health.
          </p>
        </div>

        <Badge variant="purple">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Role: ADMIN</span>
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zen-500/10 text-zen-500 flex items-center justify-center shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-zen-500">Active Exercises</span>
            <div className="text-xl font-bold text-zen-900 dark:text-zen-100">{PRESET_EXERCISES.length} Presets</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-zen-500">Registered Users</span>
            <div className="text-xl font-bold text-zen-900 dark:text-zen-100">1,420 Active</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-zen-500">System Status</span>
            <div className="text-xl font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Healthy
            </div>
          </div>
        </Card>
      </div>

      {/* Content Management Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
            Content Catalog Management
          </h3>
          <Button size="sm" variant="primary">
            + New Exercise
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zen-200 dark:border-zen-800 text-zen-500 uppercase font-semibold">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Difficulty</th>
                <th className="py-3 px-2">Safety Lock</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zen-200/50 dark:divide-zen-800/50">
              {PRESET_EXERCISES.map((ex) => (
                <tr key={ex.id} className="hover:bg-zen-100/50 dark:hover:bg-zen-900/50">
                  <td className="py-3 px-2 font-semibold text-zen-900 dark:text-zen-100">{ex.title}</td>
                  <td className="py-3 px-2 capitalize text-zen-600 dark:text-zen-400">{ex.category}</td>
                  <td className="py-3 px-2 text-zen-600 dark:text-zen-400">{ex.difficulty}</td>
                  <td className="py-3 px-2">
                    {ex.requiresSafetyWarning ? (
                      <span className="text-amber-500 font-bold">Yes (Locked)</span>
                    ) : (
                      <span className="text-zen-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="text-zen-500 hover:text-zen-900 dark:hover:text-zen-100 font-semibold px-2">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
