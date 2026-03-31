'use client';

import { AppLanguage } from '@/lib/types';

const labels: Record<AppLanguage, string> = {
  uz: 'Oʻz',
  ru: 'Ru',
  en: 'En'
};

export function LanguageToggle({
  language,
  setLanguage
}: {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}) {
  return (
    <div className="glass inline-flex rounded-full p-1 shadow-glow">
      {(Object.keys(labels) as AppLanguage[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-3 py-1 text-sm transition ${
            language === lang ? 'bg-neon-blue/25 text-neon-blue' : 'text-slate-300 hover:text-white'
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
}
