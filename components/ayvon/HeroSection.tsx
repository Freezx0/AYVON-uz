'use client';

import { motion } from 'framer-motion';
import { type Locale } from '@/lib/ayvon-data';
import { type LocaleCopy } from '@/lib/ayvon-copy';

export function HeroSection({
  averageOccupancy,
  averageRating,
  backendLabel,
  bookingsCount,
  cityCount,
  copy,
  liveSeats,
  locale,
  minResponseTime,
  recommendationName,
  recommendationReason,
  waitlistCount,
  onLocaleChange,
  onOpenAbout,
  onOpenCatalog,
  onOpenBooking,
  onOpenLaunch,
  showHeader = true
}: {
  averageOccupancy: number;
  averageRating: number;
  backendLabel: string;
  bookingsCount: number;
  cityCount: number;
  copy: LocaleCopy['hero'] & LocaleCopy['common'];
  liveSeats: number;
  locale: Locale;
  minResponseTime: number;
  recommendationName: string;
  recommendationReason: string;
  waitlistCount: number;
  onLocaleChange: (value: Locale) => void;
  onOpenAbout: () => void;
  onOpenCatalog: () => void;
  onOpenBooking: () => void;
  onOpenLaunch: () => void;
  showHeader?: boolean;
}) {
  return (
    <>
      {showHeader ? (
        <header className="surface-panel flex flex-col gap-3 rounded-[28px] px-5 py-4 sm:px-7 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="brand-mark">A</div>
            <div className="min-w-0">
              <p className="eyebrow">AYVON</p>
              <p className="copy-safe text-[13px] text-[var(--muted)] sm:text-sm">{copy.brandSubtitle}</p>
            </div>
          </div>

          <nav className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-[var(--muted)] lg:flex-nowrap lg:justify-center">
            <button onClick={onOpenAbout} className="nav-chip">
              {copy.navAbout}
            </button>
            <button onClick={onOpenCatalog} className="nav-chip">
              {copy.navCatalog}
            </button>
            <button onClick={onOpenBooking} className="nav-chip">
              {copy.navBooking}
            </button>
            <button onClick={onOpenLaunch} className="nav-chip nav-chip--active">
              {copy.navLaunch}
            </button>
          </nav>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)] lg:justify-end">
            <span className="text-xs uppercase tracking-[0.22em]">{copy.languageLabel}</span>
            <div className="flex rounded-full border border-[var(--line)] bg-white/70 p-1">
              <button
                onClick={() => onLocaleChange('ru')}
                className={`rounded-full px-2.5 py-1 text-[13px] transition ${locale === 'ru' ? 'bg-[#111827] text-[var(--paper)]' : 'text-[var(--ink)]'}`}
              >
                {copy.ru}
              </button>
              <button
                onClick={() => onLocaleChange('uz')}
                className={`rounded-full px-2.5 py-1 text-[13px] transition ${locale === 'uz' ? 'bg-[#111827] text-[var(--paper)]' : 'text-[var(--ink)]'}`}
              >
                {copy.uz}
              </button>
            </div>
          </div>
        </header>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.article
          className="hero-panel relative overflow-hidden rounded-[36px] p-7 sm:p-10"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-orb hero-orb--amber" />
          <div className="hero-orb hero-orb--teal" />

          <div className="relative z-10 max-w-3xl">
            <p className="eyebrow eyebrow-dark">{copy.eyebrow}</p>
            <h1 className="title-balance mt-4 max-w-2xl text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--paper)] sm:text-6xl">
              {copy.title}
            </h1>
            <p className="copy-safe mt-5 max-w-2xl text-base leading-7 text-[rgba(248,243,234,0.78)] sm:text-lg">{copy.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onOpenCatalog} className="cta-primary">
                {copy.primaryCta}
              </button>
              <button onClick={onOpenBooking} className="cta-secondary">
                {copy.secondaryCta}
              </button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="metric-card metric-card--dark">
                <p className="text-xs uppercase tracking-[0.3em] text-[rgba(248,243,234,0.5)]">{copy.metrics.liveSeats}</p>
                <p className="mt-3 text-3xl font-semibold text-[var(--paper)]">{liveSeats}</p>
                <p className="mt-1 text-sm text-[rgba(248,243,234,0.62)]">{copy.metrics.liveSeatsCaption}</p>
              </div>
              <div className="metric-card metric-card--dark">
                <p className="text-xs uppercase tracking-[0.3em] text-[rgba(248,243,234,0.5)]">{copy.metrics.occupancy}</p>
                <p className="mt-3 text-3xl font-semibold text-[var(--paper)]">{averageOccupancy}%</p>
                <p className="mt-1 text-sm text-[rgba(248,243,234,0.62)]">{copy.metrics.occupancyCaption}</p>
              </div>
              <div className="metric-card metric-card--dark">
                <p className="text-xs uppercase tracking-[0.3em] text-[rgba(248,243,234,0.5)]">{copy.metrics.proof}</p>
                <p className="mt-3 text-3xl font-semibold text-[var(--paper)]">{averageRating.toFixed(1)}</p>
                <p className="mt-1 text-sm text-[rgba(248,243,234,0.62)]">{copy.metrics.proofCaption}</p>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.aside
          className="surface-panel flex h-full flex-col justify-between rounded-[36px] p-6 sm:p-7"
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">{copy.boardTitle}</p>
              <span className="rounded-full bg-[#0f9d8a]/10 px-3 py-1 text-xs font-medium text-[#0f9d8a]">{backendLabel}</span>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[24px] bg-[var(--soft-panel)] p-4">
                <p className="text-sm text-[var(--muted)]">{copy.ideaLabel}</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--ink)]">{copy.ideaTitle}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.ideaDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-[var(--line)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{copy.boardStats.cities}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{cityCount}</p>
                </div>
                <div className="rounded-[22px] border border-[var(--line)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{copy.boardStats.bookings}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{bookingsCount}</p>
                </div>
                <div className="rounded-[22px] border border-[var(--line)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{copy.boardStats.waitlist}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{waitlistCount}</p>
                </div>
                <div className="rounded-[22px] border border-[var(--line)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{copy.boardStats.speed}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    {minResponseTime} {locale === 'uz' ? 'daq' : 'мин'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] bg-[#111827] p-5 text-[var(--paper)]">
            <p className="text-sm uppercase tracking-[0.25em] text-[rgba(248,243,234,0.55)]">{copy.nextMoveLabel}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{recommendationName}</p>
            <p className="mt-2 text-sm leading-6 text-[rgba(248,243,234,0.74)]">{recommendationReason}</p>
            <button onClick={onOpenLaunch} className="mt-5 rounded-full bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[#111827]">
              {copy.nextMoveButton}
            </button>
          </div>
        </motion.aside>
      </section>
    </>
  );
}
