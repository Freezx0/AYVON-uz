import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AYVON - Book Spaces By Vibe',
  description:
    'AYVON is a startup-style concept for Uzbekistan: a polished booking platform for vibe-based micro spaces, calls, deep work and short team sessions.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
