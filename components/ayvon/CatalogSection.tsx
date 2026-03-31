'use client';

import { motion } from 'framer-motion';
import { type Locale, type SpaceMood, type Studio } from '@/lib/ayvon-data';
import { formatCurrency, type LocaleCopy } from '@/lib/ayvon-copy';

const demandTone = {
  calm: {
    className: 'bg-[#0f9d8a]/10 text-[#0f9d8a]'
  },
  hot: {
    className: 'bg-[#f59e0b]/12 text-[#c67a00]'
  },
  rush: {
    className: 'bg-[#111827] text-[var(--paper)]'
  }
} as const;

export function CatalogSection({
  budgetLimit,
  cityOptions,
  copy,
  locale,
  moodOptions,
  search,
  selectedCity,
  selectedMood,
  selectedStudioId,
  visibleStudios,
  onBudgetChange,
  onResetFilters,
  onSearchChange,
  onSelectCity,
  onSelectMood,
  onSelectStudio
}: {
  budgetLimit: number;
  cityOptions: string[];
  copy: LocaleCopy['catalog'];
  locale: Locale;
  moodOptions: Array<{ id: SpaceMood | 'all'; label: string; blurb: string }>;
  search: string;
  selectedCity: string;
  selectedMood: SpaceMood | 'all';
  selectedStudioId: string;
  visibleStudios: Studio[];
  onBudgetChange: (value: number) => void;
  onResetFilters: () => void;
  onSearchChange: (value: string) => void;
  onSelectCity: (value: string) => void;
  onSelectMood: (value: SpaceMood | 'all') => void;
  onSelectStudio: (value: string) => void;
}) {
  return (
    <motion.div
      className="surface-panel rounded-[34px] p-5 sm:p-7"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.title}</h2>
        </div>
        <div className="text-sm text-[var(--muted)]">
          {visibleStudios.length > 0 ? copy.cardsFound(visibleStudios.length) : copy.noCards}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr_0.8fr]">
        <label className="field-shell">
          <span className="field-label">{copy.searchLabel}</span>
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={copy.searchPlaceholder} className="field-input" />
        </label>

        <label className="field-shell">
          <span className="field-label">{copy.cityLabel}</span>
          <select value={selectedCity} onChange={(event) => onSelectCity(event.target.value)} className="field-input">
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="field-shell">
          <div className="flex items-center justify-between gap-3">
            <span className="field-label">{copy.budgetLabel}</span>
            <span className="text-sm font-medium text-[var(--ink)]">{formatCurrency(budgetLimit, locale)}</span>
          </div>
          <input
            type="range"
            min={90000}
            max={230000}
            step={10000}
            value={budgetLimit}
            onChange={(event) => onBudgetChange(Number(event.target.value))}
            className="mt-4 w-full accent-[#0f9d8a]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {moodOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectMood(option.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedMood === option.id
                ? 'bg-[#111827] text-[var(--paper)]'
                : 'border border-[var(--line)] bg-white/60 text-[var(--ink)] hover:bg-white'
            }`}
          >
            {option.label}
          </button>
        ))}
        <button onClick={onResetFilters} className="rounded-full border border-dashed border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
          {copy.reset}
        </button>
      </div>

      {visibleStudios.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-[var(--line)] bg-white/50 p-8 text-center">
          <p className="text-2xl font-semibold tracking-[-0.03em]">{copy.emptyTitle}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{copy.emptyDescription}</p>
          <button onClick={onResetFilters} className="cta-primary mt-5">
            {copy.emptyCta}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {visibleStudios.map((studio, index) => {
            const availableNow = studio.availability.reduce((sum, slot) => sum + slot.left, 0);
            const selected = studio.id === selectedStudioId;

            return (
              <motion.button
                key={studio.id}
                onClick={() => onSelectStudio(studio.id)}
                className={`group overflow-hidden rounded-[28px] border p-5 text-left transition ${
                  selected
                    ? 'border-transparent bg-[#111827] text-[var(--paper)] shadow-[0_20px_70px_rgba(17,24,39,0.18)]'
                    : 'border-[var(--line)] bg-white/68 hover:-translate-y-[2px] hover:bg-white'
                }`}
                style={
                  selected
                    ? { backgroundImage: `linear-gradient(135deg, #111827 0%, ${studio.accent} 180%)` }
                    : { backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.72) 0%, ${studio.accentSoft} 180%)` }
                }
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.36, delay: index * 0.04 }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${selected ? 'bg-white/14 text-white' : 'bg-[#111827] text-[var(--paper)]'}`}>
                        {studio.city}
                      </span>
                      <span className={`text-xs ${selected ? 'text-white/72' : 'text-[var(--muted)]'}`}>{studio.district}</span>
                    </div>
                    <h3 className="title-balance mt-4 text-2xl font-semibold tracking-[-0.04em]">{studio.name}</h3>
                    <p className={`copy-safe mt-2 text-sm leading-6 ${selected ? 'text-white/78' : 'text-[var(--muted)]'}`}>{studio.tagline}</p>
                    <p className={`copy-safe mt-3 text-sm leading-6 ${selected ? 'text-white/64' : 'text-[var(--muted)]'}`}>{studio.story}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {studio.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className={`rounded-full px-3 py-1 text-xs ${
                            selected ? 'bg-white/10 text-white/82' : 'border border-[var(--line)] bg-white/70 text-[var(--ink)]'
                          }`}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-4 lg:w-[272px] lg:max-w-[272px]">
                    <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(92px,0.65fr)] gap-3">
                      <div className={`min-w-0 rounded-[20px] p-4 ${selected ? 'bg-white/10' : 'border border-[var(--line)] bg-white/72'}`}>
                        <p className={`text-xs uppercase tracking-[0.25em] ${selected ? 'text-white/55' : 'text-[var(--muted)]'}`}>{copy.priceFrom}</p>
                        <p className="mt-3 whitespace-nowrap text-xl font-semibold leading-6">{formatCurrency(studio.pricePerHour, locale)}</p>
                      </div>
                      <div className={`min-w-0 rounded-[20px] p-4 ${selected ? 'bg-white/10' : 'border border-[var(--line)] bg-white/72'}`}>
                        <p className={`text-xs uppercase tracking-[0.25em] ${selected ? 'text-white/55' : 'text-[var(--muted)]'}`}>{copy.rating}</p>
                        <p className="mt-3 text-xl font-semibold">{studio.rating.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className={`rounded-[22px] p-4 ${selected ? 'bg-white/10' : 'border border-[var(--line)] bg-white/72'}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={selected ? 'text-white/68' : 'text-[var(--muted)]'}>{copy.available}</span>
                        <span className="font-medium">{availableNow}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {studio.availability.slice(0, 4).map((slot) => (
                          <span
                            key={slot.label}
                            className={`rounded-full px-3 py-1 text-xs ${selected ? 'bg-white/12 text-white' : demandTone[slot.demand].className}`}
                          >
                            {slot.label} · {slot.left}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
