'use client';

import { motion } from 'framer-motion';
import {
  type ConciergeGoal,
  type ConciergePriority,
  type Studio
} from '@/lib/ayvon-data';
import { type LocaleCopy } from '@/lib/ayvon-copy';

export function ConciergeSection({
  copy,
  goalOptions,
  plannerGoal,
  plannerPriority,
  plannerTeamSize,
  priorityOptions,
  recommendation,
  onOpenStudio,
  onSelectGoal,
  onSelectPriority,
  onTeamSizeChange
}: {
  copy: LocaleCopy['concierge'];
  goalOptions: Array<{ id: ConciergeGoal; label: string }>;
  plannerGoal: ConciergeGoal;
  plannerPriority: ConciergePriority;
  plannerTeamSize: number;
  priorityOptions: Array<{ id: ConciergePriority; label: string }>;
  recommendation: {
    studio: Studio;
    score: number;
    reason: string;
  };
  onOpenStudio: () => void;
  onSelectGoal: (value: ConciergeGoal) => void;
  onSelectPriority: (value: ConciergePriority) => void;
  onTeamSizeChange: (value: number) => void;
}) {
  return (
    <motion.article
      id="concierge"
      className="surface-panel rounded-[34px] p-5 sm:p-7"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
    >
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.title}</h2>

      <div className="mt-6 grid gap-5">
        <div>
          <p className="field-label">{copy.whatMatters}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {goalOptions.map((goal) => (
              <button
                key={goal.id}
                onClick={() => onSelectGoal(goal.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  plannerGoal === goal.id ? 'bg-[#111827] text-[var(--paper)]' : 'border border-[var(--line)] bg-white/68 text-[var(--ink)]'
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="field-label">{copy.priority}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {priorityOptions.map((priority) => (
              <button
                key={priority.id}
                onClick={() => onSelectPriority(priority.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  plannerPriority === priority.id
                    ? 'bg-[#111827] text-[var(--paper)]'
                    : 'border border-[var(--line)] bg-white/68 text-[var(--ink)]'
                }`}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        <label className="field-shell">
          <div className="flex items-center justify-between">
            <span className="field-label">{copy.teamSize}</span>
            <span className="text-sm font-medium text-[var(--ink)]">{plannerTeamSize}</span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={plannerTeamSize}
            onChange={(event) => onTeamSizeChange(Number(event.target.value))}
            className="mt-4 w-full accent-[#0f9d8a]"
          />
        </label>
      </div>

      <div className="mt-6 rounded-[30px] bg-[#111827] p-6 text-[var(--paper)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(248,243,234,0.5)]">{copy.topRecommendation}</p>
            <h3 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em]">{recommendation.studio.name}</h3>
            <p className="mt-2 text-sm text-[rgba(248,243,234,0.74)]">
              {recommendation.studio.city}, {recommendation.studio.district}
            </p>
          </div>
          <div className="rounded-[20px] bg-white/8 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.matchScore}</p>
            <p className="mt-2 text-2xl font-semibold">{recommendation.score}</p>
          </div>
        </div>

        <p className="copy-safe mt-5 max-w-xl text-sm leading-6 text-[rgba(248,243,234,0.74)]">{recommendation.reason}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.bestFor}</p>
            <p className="mt-3 text-lg font-semibold">{recommendation.studio.tagline}</p>
          </div>
          <div className="rounded-[22px] bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.atmosphere}</p>
            <p className="mt-3 text-lg font-semibold">{recommendation.studio.host}</p>
          </div>
        </div>

        <button onClick={onOpenStudio} className="mt-5 rounded-full bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[#111827]">
          {copy.openStudio}
        </button>
      </div>
    </motion.article>
  );
}
