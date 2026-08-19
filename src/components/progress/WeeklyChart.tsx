import React from 'react';
import { Card } from '../ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const WeeklyChart: React.FC = () => {
  // Weekly sample data
  const data = [
    { day: 'Mon', mins: 12 },
    { day: 'Tue', mins: 20 },
    { day: 'Wed', mins: 8 },
    { day: 'Thu', mins: 25 },
    { day: 'Fri', mins: 15 },
    { day: 'Sat', mins: 18 },
    { day: 'Sun', mins: 10 },
  ];

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg text-zen-900 dark:text-zen-100">
            Weekly Practice Volume
          </h3>
          <p className="text-xs text-zen-500">Minutes practiced per day this week</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zen-100 dark:bg-zen-900 text-zen-700 dark:text-zen-300">
          Total: 108 Mins
        </span>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#788c87' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#788c87' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(18, 33, 31, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="mins" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.mins > 18 ? '#52887e' : '#70a49a'}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
