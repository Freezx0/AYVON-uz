'use client';

import { motion } from 'framer-motion';
import { type Locale, type SpaceSlot, type Studio } from '@/lib/ayvon-data';
import {
  formatCurrency,
  getDemandLabels,
  getMetricLabels,
  getMoodLabels,
  type LocaleCopy
} from '@/lib/ayvon-copy';

export function BookingCockpit({
  bookingTotal,
  brief,
  canReserve,
  copy,
  duration,
  guest,
  isSubmitting,
  locale,
  membership,
  perHour,
  savings,
  seats,
  selectedSlot,
  selectedSlotInfo,
  selectedStudio,
  onBriefChange,
  onDurationChange,
  onGuestChange,
  onMembershipToggle,
  onReserve,
  onSeatsChange,
  onSlotSelect
}: {
  bookingTotal: number;
  brief: string;
  canReserve: boolean;
  copy: LocaleCopy['booking'];
  duration: number;
  guest: string;
  isSubmitting: boolean;
  locale: Locale;
  membership: boolean;
  perHour: number;
  savings: number;
  seats: number;
  selectedSlot: string;
  selectedSlotInfo: SpaceSlot;
  selectedStudio: Studio;
  onBriefChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onGuestChange: (value: string) => void;
  onMembershipToggle: () => void;
  onReserve: () => void;
  onSeatsChange: (value: number) => void;
  onSlotSelect: (value: string) => void;
}) {
  const moodLabels = getMoodLabels(locale);
  const metricLabels = getMetricLabels(locale);
  const demandLabels = getDemandLabels(locale);

  return (
    <motion.aside
      id="booking"
      className="surface-panel h-fit rounded-[34px] p-5 sm:sticky sm:top-4 sm:p-7"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 pr-3">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em]">{selectedStudio.name}</h2>
        </div>
        <span className="shrink-0 rounded-full bg-[#111827] px-3 py-1 text-xs font-medium text-[var(--paper)]">{selectedStudio.city}</span>
      </div>

      <p className="copy-safe mt-3 text-sm leading-6 text-[var(--muted)]">{selectedStudio.story}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] border border-[var(--line)] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.scenario}</p>
          <p className="mt-3 text-xl font-semibold">{moodLabels[selectedStudio.mood]}</p>
        </div>
        <div className="rounded-[24px] border border-[var(--line)] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.intensity}</p>
          <p className="mt-3 text-xl font-semibold">{selectedStudio.intensity}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(15,157,138,0.08))] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">{copy.roomParamsEyebrow}</p>
            <h3 className="title-balance mt-3 text-2xl font-semibold tracking-[-0.04em]">{copy.roomParamsTitle}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-[var(--ink)]">{copy.upToGuests(selectedStudio.seats)}</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.hostFormat}</p>
            <p className="copy-safe mt-3 text-lg font-semibold text-[var(--ink)]">{selectedStudio.host}</p>
          </div>
          <div className="rounded-[22px] bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.response}</p>
            <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
              {selectedStudio.responseMinutes} {locale === 'uz' ? 'daqiqa' : 'мин'}
            </p>
          </div>
          <div className="rounded-[22px] bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.roomMood}</p>
            <p className="copy-safe mt-3 text-lg font-semibold text-[var(--ink)]">{selectedStudio.intensity}</p>
          </div>
          <div className="rounded-[22px] bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.amenities}</p>
            <p className="copy-safe mt-3 text-lg font-semibold text-[var(--ink)]">{selectedStudio.amenities.slice(0, 2).join(' · ')}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {Object.entries(selectedStudio.metrics).map(([metric, value]) => (
            <div key={metric} className="rounded-[20px] bg-white/70 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">{metricLabels[metric as keyof typeof metricLabels]}</span>
                <span className="font-medium text-[var(--ink)]">{value}/100</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#e7ddcf]">
                <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: selectedStudio.accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="field-label">{copy.slots}</p>
          <p className="text-sm text-[var(--muted)]">{copy.seatsNeeded(seats)}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {selectedStudio.availability.map((slot) => {
            const isDisabled = slot.left < seats;
            const isActive = slot.label === selectedSlot;

            return (
              <button
                key={slot.label}
                onClick={() => onSlotSelect(slot.label)}
                disabled={isDisabled}
                className={`rounded-[18px] border px-3 py-3 text-left transition ${
                  isActive
                    ? 'border-transparent bg-[#111827] text-[var(--paper)]'
                    : isDisabled
                      ? 'cursor-not-allowed border-[var(--line)] bg-white/40 text-[rgba(17,24,39,0.35)]'
                      : 'border-[var(--line)] bg-white/72 hover:bg-white'
                }`}
              >
                <div className="text-sm font-medium">{slot.label}</div>
                <div className={`mt-1 text-xs ${isActive ? 'text-white/66' : 'text-[var(--muted)]'}`}>
                  {slot.left} {locale === 'uz' ? 'joy' : 'мест'} · {demandLabels[slot.demand]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="field-shell">
          <span className="field-label">{copy.duration}</span>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={duration}
            onChange={(event) => onDurationChange(Number(event.target.value))}
            className="mt-4 w-full accent-[#111827]"
          />
          <span className="mt-3 block text-sm text-[var(--muted)]">{copy.durationValue(duration)}</span>
        </label>

        <label className="field-shell">
          <span className="field-label">{copy.team}</span>
          <input
            type="range"
            min={1}
            max={Math.min(selectedStudio.seats, 8)}
            step={1}
            value={Math.min(seats, selectedStudio.seats)}
            onChange={(event) => onSeatsChange(Number(event.target.value))}
            className="mt-4 w-full accent-[#111827]"
          />
          <span className="mt-3 block text-sm text-[var(--muted)]">{copy.teamValue(seats)}</span>
        </label>
      </div>

      <div className="mt-6 rounded-[26px] bg-[#111827] p-5 text-[var(--paper)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(248,243,234,0.5)]">{copy.membership}</p>
            <p className="mt-2 text-sm leading-6 text-[rgba(248,243,234,0.74)]">{copy.membershipDescription}</p>
          </div>
          <button
            onClick={onMembershipToggle}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${membership ? 'bg-[var(--paper)] text-[#111827]' : 'bg-white/10 text-white'}`}
          >
            {membership ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.perHour}</p>
            <p className="mt-3 text-xl font-semibold">{formatCurrency(perHour, locale)}</p>
          </div>
          <div className="rounded-[20px] bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.saving}</p>
            <p className="mt-3 text-xl font-semibold">{formatCurrency(savings, locale)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="field-shell">
          <span className="field-label">{copy.guestLabel}</span>
          <input value={guest} onChange={(event) => onGuestChange(event.target.value)} placeholder={copy.guestPlaceholder} className="field-input" />
        </label>

        <label className="field-shell">
          <span className="field-label">{copy.briefLabel}</span>
          <textarea
            value={brief}
            onChange={(event) => onBriefChange(event.target.value)}
            rows={4}
            placeholder={copy.briefPlaceholder}
            className="field-input min-h-[120px] resize-none"
          />
        </label>
      </div>

      <div className="mt-6 rounded-[26px] border border-[var(--line)] bg-white/72 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{copy.total}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{formatCurrency(bookingTotal, locale)}</p>
          </div>
          <div className="text-right text-sm text-[var(--muted)]">
            <p>{copy.durationValue(duration)}</p>
            <p>{copy.teamValue(seats)}</p>
          </div>
        </div>
        <button
          onClick={onReserve}
          disabled={!canReserve || isSubmitting}
          className={`cta-primary mt-5 w-full ${!canReserve || isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          {isSubmitting ? copy.reserveBusy : copy.reserve}
        </button>
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{copy.backendNote(selectedSlotInfo.label)}</p>
      </div>
    </motion.aside>
  );
}
