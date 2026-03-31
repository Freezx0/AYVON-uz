'use client';

import { motion } from 'framer-motion';
import { type Booking, type Locale, type WaitlistEntry } from '@/lib/ayvon-data';
import {
  formatCurrency,
  formatDateLabel,
  getGoalBadgeLabels,
  type LocaleCopy
} from '@/lib/ayvon-copy';

export function LaunchSection({
  backendLabel,
  bookings,
  copy,
  isSubmitting,
  locale,
  recommendationCity,
  statusMessage,
  statusTone,
  waitlist,
  waitlistEmail,
  waitlistName,
  onJoinWaitlist,
  onWaitlistEmailChange,
  onWaitlistNameChange
}: {
  backendLabel: string;
  bookings: Booking[];
  copy: LocaleCopy['launch'];
  isSubmitting: boolean;
  locale: Locale;
  recommendationCity: string;
  statusMessage: string;
  statusTone: 'success' | 'error' | 'info';
  waitlist: WaitlistEntry[];
  waitlistEmail: string;
  waitlistName: string;
  onJoinWaitlist: () => void;
  onWaitlistEmailChange: (value: string) => void;
  onWaitlistNameChange: (value: string) => void;
}) {
  const recentBookings = bookings.slice(0, 4);
  const goalLabels = getGoalBadgeLabels(locale);
  const statusClass =
    statusTone === 'error'
      ? 'bg-[#ef4444]/10 text-[#b42318]'
      : statusTone === 'success'
        ? 'bg-[#0f9d8a]/10 text-[#0f9d8a]'
        : 'bg-[#111827]/8 text-[var(--ink)]';

  return (
    <section id="launch" className="grid gap-6 xl:grid-cols-[0.78fr_0.62fr]">
      <motion.article
        className="surface-panel rounded-[34px] p-5 sm:p-7"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{copy.liveFeedEyebrow}</p>
            <h2 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.liveFeedTitle}</h2>
          </div>
          {statusMessage ? <p className={`max-w-md rounded-full px-4 py-2 text-sm ${statusClass}`}>{statusMessage}</p> : null}
        </div>

        <div className="mt-6 grid gap-4">
          {recentBookings.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/55 p-7">
              <p className="text-2xl font-semibold tracking-[-0.03em]">{copy.emptyTitle}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{copy.emptyDescription}</p>
            </div>
          ) : (
            recentBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="rounded-[28px] border border-[var(--line)] bg-white/72 p-5"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#111827] px-3 py-1 text-xs font-medium text-[var(--paper)]">{booking.id}</span>
                      <span className="text-sm text-[var(--muted)]">{formatDateLabel(booking.createdAt, locale)}</span>
                    </div>
                    <h3 className="title-balance mt-4 text-2xl font-semibold tracking-[-0.04em]">{booking.studioName}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {booking.city} · {booking.slot} · {booking.duration} {locale === 'uz' ? 'soat' : 'ч.'} · {booking.seats} {locale === 'uz' ? 'kishi' : 'чел.'}
                    </p>
                    <p className="copy-safe mt-3 text-sm leading-6 text-[var(--ink)]">{booking.brief}</p>
                  </div>
                  <div className="rounded-[22px] bg-[#f6efe6] p-4 sm:min-w-[170px]">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{copy.bookedBy}</p>
                    <p className="mt-3 text-lg font-semibold">{booking.guest}</p>
                    <p className="mt-3 text-xl font-semibold">{formatCurrency(booking.total, locale)}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.article>

      <motion.aside
        className="surface-panel rounded-[34px] p-5 sm:p-7"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45 }}
      >
        <p className="eyebrow">{copy.prelaunchEyebrow}</p>
        <h2 className="title-balance mt-3 text-3xl font-semibold tracking-[-0.04em]">{copy.prelaunchTitle}</h2>
        <p className="copy-safe mt-3 text-sm leading-6 text-[var(--muted)]">{copy.prelaunchDescription}</p>
        <p className="mt-2 text-sm font-medium text-[#0f9d8a]">{copy.backendMode}: {backendLabel}</p>

        <div className="mt-6 grid gap-4">
          <label className="field-shell">
            <span className="field-label">{copy.nameLabel}</span>
            <input value={waitlistName} onChange={(event) => onWaitlistNameChange(event.target.value)} placeholder={copy.namePlaceholder} className="field-input" />
          </label>

          <label className="field-shell">
            <span className="field-label">{copy.emailLabel}</span>
            <input value={waitlistEmail} onChange={(event) => onWaitlistEmailChange(event.target.value)} placeholder="name@email.com" className="field-input" />
          </label>
        </div>

        <button onClick={onJoinWaitlist} disabled={isSubmitting} className={`cta-primary mt-5 w-full ${isSubmitting ? 'opacity-70' : ''}`}>
          {isSubmitting ? copy.joinWaitlistBusy : copy.joinWaitlist}
        </button>

        <div className="mt-6 rounded-[28px] bg-[#111827] p-5 text-[var(--paper)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.currentQueue}</p>
              <p className="mt-3 text-2xl font-semibold">{waitlist.length}</p>
            </div>
            <div className="rounded-[20px] bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[rgba(248,243,234,0.45)]">{copy.bestCity}</p>
              <p className="mt-3 text-2xl font-semibold">{recommendationCity}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-6 text-[rgba(248,243,234,0.72)]">
            {copy.bullets.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        {waitlist.length > 0 ? (
          <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/72 p-5">
            <p className="field-label">{copy.recentWaitlist}</p>
            <div className="mt-4 space-y-3">
              {waitlist.slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex flex-col gap-3 rounded-[20px] bg-[#f6efe6] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--ink)]">{entry.name}</p>
                    <p className="copy-safe text-[var(--muted)]">
                      {entry.city} · {formatDateLabel(entry.createdAt, locale)}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs text-[var(--ink)]">{goalLabels[entry.goal]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </motion.aside>
    </section>
  );
}
