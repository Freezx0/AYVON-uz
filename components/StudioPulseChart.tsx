'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { type Locale, type TrendPoint } from '@/lib/ayvon-data';
import { type LocaleCopy } from '@/lib/ayvon-copy';

export function StudioPulseChart({
  accent,
  data,
  locale,
  mode,
  copy
}: {
  accent: string;
  data: TrendPoint[];
  locale: Locale;
  mode: 'occupancy' | 'revenue';
  copy: LocaleCopy['signals'];
}) {
  const waitlistLabel = locale === 'uz' ? 'Navbat' : 'Очередь';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {mode === 'occupancy' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="8%" stopColor={accent} stopOpacity={0.38} />
                <stop offset="92%" stopColor={accent} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(17,24,39,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#6b7280" tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ stroke: accent, strokeDasharray: '4 4' }}
              formatter={(value: number, name: string) => [name === 'occupancy' ? `${value}%` : value, name === 'occupancy' ? copy.occupancy : waitlistLabel]}
              contentStyle={{
                borderRadius: 18,
                border: '1px solid rgba(17,24,39,0.08)',
                backgroundColor: 'rgba(248, 243, 234, 0.96)'
              }}
            />
            <Area type="monotone" dataKey="occupancy" stroke={accent} strokeWidth={2.5} fill="url(#occupancyFill)" />
            <Line type="monotone" dataKey="waitlist" stroke="#111827" strokeWidth={1.7} dot={{ r: 2.5 }} />
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(17,24,39,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#6b7280" tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => [copy.revenueTooltipValue(value), copy.revenueTooltipLabel]}
              contentStyle={{
                borderRadius: 18,
                border: '1px solid rgba(17,24,39,0.08)',
                backgroundColor: 'rgba(248, 243, 234, 0.96)'
              }}
            />
            <Bar dataKey="revenue" fill={accent} radius={[10, 10, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
