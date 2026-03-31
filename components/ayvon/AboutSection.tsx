'use client';

import { motion } from 'framer-motion';
import { type LocaleCopy } from '@/lib/ayvon-copy';

export function AboutSection({
  cityCount,
  copy,
  liveSeats,
  averageOccupancy,
  onOpenBooking
}: {
  cityCount: number;
  copy: LocaleCopy['about'];
  liveSeats: number;
  averageOccupancy: number;
  onOpenBooking: () => void;
}) {
  return (
    <motion.section
      id="about"
      className="surface-panel rounded-[34px] p-5 sm:p-7"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] bg-[#111827] p-6 text-[var(--paper)] sm:p-8">
          <p className="eyebrow eyebrow-dark">{copy.eyebrow}</p>
          <h2 className="title-balance mt-4 max-w-[15ch] text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">{copy.title}</h2>
          <p className="copy-safe mt-5 max-w-2xl text-sm leading-7 text-[rgba(248,243,234,0.78)] sm:text-base">{copy.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="metric-card metric-card--dark">
              <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.5)]">{copy.metrics.cities}</p>
              <p className="mt-3 text-3xl font-semibold">{cityCount}</p>
            </div>
            <div className="metric-card metric-card--dark">
              <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.5)]">{copy.metrics.liveSeats}</p>
              <p className="mt-3 text-3xl font-semibold">{liveSeats}</p>
            </div>
            <div className="metric-card metric-card--dark">
              <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.5)]">{copy.metrics.occupancy}</p>
              <p className="mt-3 text-3xl font-semibold">{averageOccupancy}%</p>
            </div>
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded-[30px] border border-[var(--line)] bg-white/72 p-6">
            <p className="eyebrow">{copy.howItWorks}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {copy.steps.map((step, index) => (
                <div key={step.title} className={`rounded-[22px] p-4 ${index === 0 ? 'bg-[#f7efe5]' : index === 1 ? 'bg-[#eef7f4]' : 'bg-[#f6efe6]'}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{index + 1}</p>
                  <p className="title-balance mt-3 text-lg font-semibold">{step.title}</p>
                  <p className="copy-safe mt-2 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(15,157,138,0.08))] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="eyebrow">{copy.insideEyebrow}</p>
                <h3 className="title-balance mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{copy.insideTitle}</h3>
              </div>
              <button onClick={onOpenBooking} className="cta-primary shrink-0">
                {copy.cta}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {copy.chips.map((item) => (
                <span key={item} className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-[var(--ink)]">
                  {item}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </motion.section>
  );
}
