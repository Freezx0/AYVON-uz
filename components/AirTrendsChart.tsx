'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const trendData = [
  { hour: '06:00', aqi: 58 },
  { hour: '09:00', aqi: 76 },
  { hour: '12:00', aqi: 95 },
  { hour: '15:00', aqi: 89 },
  { hour: '18:00', aqi: 101 },
  { hour: '21:00', aqi: 82 }
];

export function AirTrendsChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00c8ff" stopOpacity={0.75} />
              <stop offset="95%" stopColor="#00ff9c" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff24" />
          <XAxis dataKey="hour" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#051020', border: '1px solid #0ea5e9' }} />
          <Area type="monotone" dataKey="aqi" stroke="#00c8ff" fill="url(#aqiGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
