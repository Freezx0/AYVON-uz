'use client';

import type { Route } from 'next';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Locale } from '@/lib/ayvon-data';
import { type LocaleCopy } from '@/lib/ayvon-copy';

export function AyvonTopBar({
  copy,
  locale,
  onLocaleChange
}: {
  copy: LocaleCopy['hero'] & LocaleCopy['common'];
  locale: Locale;
  onLocaleChange: (value: Locale) => void;
}) {
  const pathname = usePathname();
  const navItems: Array<{ href: Route; label: string }> = [
    { href: '/', label: copy.navHome },
    { href: '/about', label: copy.navAbout },
    { href: '/catalog', label: copy.navCatalog },
    { href: '/booking', label: copy.navBooking },
    { href: '/analytics', label: copy.navAnalytics },
    { href: '/launch', label: copy.navLaunch }
  ];

  return (
    <header className="surface-panel flex flex-col gap-3 rounded-[28px] px-5 py-4 sm:px-7 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4">
      <Link href="/" className="flex min-w-0 items-center gap-4">
        <div className="brand-mark">A</div>
        <div className="min-w-0">
          <p className="eyebrow">AYVON</p>
          <p className="copy-safe text-[13px] text-[var(--muted)] sm:text-sm">{copy.brandSubtitle}</p>
        </div>
      </Link>

      <nav className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-[var(--muted)] lg:flex-nowrap lg:justify-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className={`nav-chip ${isActive ? 'nav-chip--active' : ''}`}>
              {item.label}
            </Link>
          );
        })}
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
  );
}

