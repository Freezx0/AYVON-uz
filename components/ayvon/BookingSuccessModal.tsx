'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type LocaleCopy } from '@/lib/ayvon-copy';

export function BookingSuccessModal({
  copy,
  successState,
  onClose
}: {
  copy: LocaleCopy['booking'];
  successState: {
    id: string;
    room: string;
    slot: string;
  } | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {successState ? (
        <motion.div
          key={successState.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.26)] px-4 backdrop-blur-[3px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="relative w-[min(92vw,460px)] overflow-hidden rounded-[32px] border border-[#0f9d8a]/20 bg-[linear-gradient(135deg,rgba(15,157,138,0.18),rgba(255,255,255,0.97))] p-6 shadow-[0_32px_120px_rgba(15,157,138,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-lg text-[var(--ink)]"
            >
              ×
            </button>

            <motion.div
              className="absolute left-6 top-6 h-14 w-14 rounded-full border border-[#0f9d8a]/35"
              animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            />

            <div className="relative flex items-start gap-4">
              <motion.div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0f9d8a] text-xl font-semibold text-white shadow-[0_18px_40px_rgba(15,157,138,0.28)]"
                initial={{ rotate: -14, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              >
                ✓
              </motion.div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f9d8a]">{copy.successTitle}</p>
                <h3 className="title-balance mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-[2rem]">
                  {copy.successDescription(successState.room, successState.slot)}
                </h3>
                <p className="copy-safe mt-2 text-sm leading-6 text-[var(--muted)]">{copy.successHint}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
