'use client';

import { motion } from 'framer-motion';
import { StudioPulseChart } from '@/components/StudioPulseChart';
import { type Locale, type Studio } from '@/lib/ayvon-data';
import { getMetricLabels, type LocaleCopy } from '@/lib/ayvon-copy';

export function SignalsSection({
  chartMode,
  copy,
  locale,
  selectedStudio,
  onChartModeChange
}: {
  chartMode: 'occupancy' | 'revenue';
  copy: LocaleCopy['signals'];
  locale: Locale;
  selectedStudio: Studio;
  onChartModeChange: (value: 'occupancy' | 'revenue') => void;
}) {
  const metricLabels = getMetricLabels(locale);

  return (
    <motion.article
      id="signals"
      className="surface-panel rounded-[34px] p-5 sm:p-7"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.title}</h2>
          <p className="copy-safe mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{copy.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onChartModeChange('occupancy')}
            className={`rounded-full px-4 py-2 text-sm ${chartMode === 'occupancy' ? 'bg-[#111827] text-[var(--paper)]' : 'border border-[var(--line)] bg-white/72'}`}
          >
            {copy.occupancy}
          </button>
          <button
            onClick={() => onChartModeChange('revenue')}
            className={`rounded-full px-4 py-2 text-sm ${chartMode === 'revenue' ? 'bg-[#111827] text-[var(--paper)]' : 'border border-[var(--line)] bg-white/72'}`}
          >
            {copy.revenue}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[24px] border border-[var(--line)] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{copy.selected}</p>
          <p className="mt-3 text-xl font-semibold">{selectedStudio.name}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{selectedStudio.city}</p>
        </div>
        <div className="rounded-[24px] border border-[var(--line)] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{copy.satisfaction}</p>
          <p className="mt-3 text-xl font-semibold">
            {Math.round(selectedStudio.trend.reduce((sum, point) => sum + point.satisfaction, 0) / selectedStudio.trend.length)}/100
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.satisfactionCaption}</p>
        </div>
        <div className="rounded-[24px] border border-[var(--line)] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{copy.peakWaitlist}</p>
          <p className="mt-3 text-xl font-semibold">{Math.max(...selectedStudio.trend.map((point) => point.waitlist))}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.peakWaitlistCaption}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[30px] border border-[var(--line)] bg-white/72 p-4 sm:p-6">
        <StudioPulseChart data={selectedStudio.trend} accent={selectedStudio.accent} locale={locale} mode={chartMode} copy={copy} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[26px] border border-[var(--line)] bg-white/72 p-5">
          <p className="field-label">{copy.strengths}</p>
          <div className="mt-4 space-y-3">
            {Object.entries(selectedStudio.metrics).map(([metric, value]) => (
              <div key={metric}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">{metricLabels[metric as keyof typeof metricLabels]}</span>
                  <span className="font-medium text-[var(--ink)]">{value}/100</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#e8ddd1]">
                  <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: selectedStudio.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] bg-[#111827] p-5 text-[var(--paper)]">
          <p className="field-label !text-[rgba(248,243,234,0.55)]">{copy.whyProduct}</p>
          <div className="mt-4 space-y-4 text-sm leading-6 text-[rgba(248,243,234,0.74)]">
            {copy.reasons.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
