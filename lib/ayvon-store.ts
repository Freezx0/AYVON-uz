import { existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  type Booking,
  type CreateBookingInput,
  type JoinWaitlistInput,
  type LaunchState,
  type WaitlistEntry,
  buildLiveStudios,
  calculateBookingTotal,
  getStudioById
} from '@/lib/ayvon-data';

type DatabaseSync = import('node:sqlite').DatabaseSync;

type LegacyStore = {
  bookings: Booking[];
  waitlist: WaitlistEntry[];
};

type SqliteBookingRow = {
  id: string;
  studio_id: string;
  studio_name: string;
  city: string;
  slot: string;
  seats: number;
  duration: number;
  total: number;
  guest: string;
  brief: string;
  created_at_label: string;
  created_at_sort: string;
};

type SqliteWaitlistRow = {
  id: string;
  name: string;
  email: string;
  goal: string;
  city: string;
  created_at_label: string;
  created_at_sort: string;
};

const dataDirectory = path.join(process.cwd(), 'data');
const legacyStorePath = path.join(dataDirectory, 'ayvon-store.json');
const sqlitePath = path.join(dataDirectory, 'ayvon.sqlite');
const hostedBackendErrorMessage = 'Hosted deployment requires Supabase. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.';

let sqliteDb: DatabaseSync | null = null;

function formatCreatedAt(date = new Date()) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tashkent'
  }).format(date);
}

function createTimestamp(date = new Date()) {
  return {
    label: formatCreatedAt(date),
    sort: date.toISOString()
  };
}

function hasSupabaseAdminConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return Boolean(supabaseUrl && serviceRoleKey);
}

function isHostedRuntime() {
  return process.env.VERCEL === '1' || typeof process.env.VERCEL_ENV === 'string';
}

function assertHostedBackendConfig() {
  if (isHostedRuntime() && !hasSupabaseAdminConfig()) {
    throw new Error(hostedBackendErrorMessage);
  }
}

export function isHostedBackendConfigError(error: unknown) {
  return error instanceof Error && error.message === hostedBackendErrorMessage;
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}

async function ensureSqliteDb() {
  if (sqliteDb) {
    return sqliteDb;
  }

  mkdirSync(dataDirectory, { recursive: true });

  const { DatabaseSync } = await import('node:sqlite');
  sqliteDb = new DatabaseSync(sqlitePath);
  sqliteDb.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    CREATE TABLE IF NOT EXISTS ayvon_bookings_local (
      id TEXT PRIMARY KEY,
      studio_id TEXT NOT NULL,
      studio_name TEXT NOT NULL,
      city TEXT NOT NULL,
      slot TEXT NOT NULL,
      seats INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      total INTEGER NOT NULL,
      guest TEXT NOT NULL,
      brief TEXT NOT NULL,
      created_at_label TEXT NOT NULL,
      created_at_sort TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ayvon_bookings_local_created_at_sort
      ON ayvon_bookings_local(created_at_sort DESC);

    CREATE TABLE IF NOT EXISTS ayvon_waitlist_local (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      goal TEXT NOT NULL,
      city TEXT NOT NULL,
      created_at_label TEXT NOT NULL,
      created_at_sort TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ayvon_waitlist_local_created_at_sort
      ON ayvon_waitlist_local(created_at_sort DESC);
  `);

  migrateLegacyJsonStore(sqliteDb);
  return sqliteDb;
}

function migrateLegacyJsonStore(db: DatabaseSync) {
  const bookingCount = Number((db.prepare('SELECT COUNT(*) as count FROM ayvon_bookings_local').get() as { count: number }).count);
  const waitlistCount = Number((db.prepare('SELECT COUNT(*) as count FROM ayvon_waitlist_local').get() as { count: number }).count);

  if (bookingCount > 0 || waitlistCount > 0 || !existsSync(legacyStorePath)) {
    return;
  }

  try {
    const raw = readFileSync(legacyStorePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LegacyStore>;
    const bookings = parsed.bookings ?? [];
    const waitlist = parsed.waitlist ?? [];

    const insertBooking = db.prepare(`
      INSERT OR IGNORE INTO ayvon_bookings_local (
        id, studio_id, studio_name, city, slot, seats, duration, total, guest, brief, created_at_label, created_at_sort
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertWaitlist = db.prepare(`
      INSERT OR IGNORE INTO ayvon_waitlist_local (
        id, name, email, goal, city, created_at_label, created_at_sort
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    bookings.forEach((booking, index) => {
      const createdAtSort = new Date(Date.now() - index * 1000).toISOString();
      insertBooking.run(
        booking.id,
        booking.studioId,
        booking.studioName,
        booking.city,
        booking.slot,
        booking.seats,
        booking.duration,
        booking.total,
        booking.guest,
        booking.brief,
        booking.createdAt,
        createdAtSort
      );
    });

    waitlist.forEach((entry, index) => {
      const createdAtSort = new Date(Date.now() - index * 1000).toISOString();
      insertWaitlist.run(entry.id, entry.name, entry.email, entry.goal, entry.city, entry.createdAt, createdAtSort);
    });
  } catch {
    // Ignore malformed legacy JSON and continue with a clean SQLite database.
  }
}

async function loadSqliteState(): Promise<LaunchState> {
  const db = await ensureSqliteDb();
  const bookings = db
    .prepare(
      `SELECT id, studio_id, studio_name, city, slot, seats, duration, total, guest, brief, created_at_label, created_at_sort
       FROM ayvon_bookings_local
       ORDER BY created_at_sort DESC
       LIMIT 50`
    )
    .all() as SqliteBookingRow[];

  const waitlist = db
    .prepare(
      `SELECT id, name, email, goal, city, created_at_label, created_at_sort
       FROM ayvon_waitlist_local
       ORDER BY created_at_sort DESC
       LIMIT 50`
    )
    .all() as SqliteWaitlistRow[];

  return {
    bookings: bookings.map(normalizeSqliteBookingRow),
    waitlist: waitlist.map(normalizeSqliteWaitlistRow),
    backend: 'sqlite'
  };
}

function normalizeSqliteBookingRow(row: SqliteBookingRow): Booking {
  return {
    id: row.id,
    studioId: row.studio_id,
    studioName: row.studio_name,
    city: row.city,
    slot: row.slot,
    seats: Number(row.seats),
    duration: Number(row.duration),
    total: Number(row.total),
    guest: row.guest,
    brief: row.brief,
    createdAt: row.created_at_label
  };
}

function normalizeSqliteWaitlistRow(row: SqliteWaitlistRow): WaitlistEntry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    goal: row.goal as WaitlistEntry['goal'],
    city: row.city,
    createdAt: row.created_at_label
  };
}

function normalizeBookingRow(row: Record<string, unknown>): Booking {
  return {
    id: String(row.id),
    studioId: String(row.studio_id),
    studioName: String(row.studio_name),
    city: String(row.city),
    slot: String(row.slot),
    seats: Number(row.seats),
    duration: Number(row.duration),
    total: Number(row.total),
    guest: String(row.guest),
    brief: String(row.brief),
    createdAt: String(row.created_at_label ?? row.created_at)
  };
}

function normalizeWaitlistRow(row: Record<string, unknown>): WaitlistEntry {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    goal: String(row.goal) as WaitlistEntry['goal'],
    city: String(row.city),
    createdAt: String(row.created_at_label ?? row.created_at)
  };
}

function validateBookingInput(input: CreateBookingInput) {
  if (!input.studioId || !input.slot) {
    throw new Error('Studio and slot are required.');
  }

  if (!Number.isInteger(input.seats) || input.seats < 1 || input.seats > 8) {
    throw new Error('Seats must be between 1 and 8.');
  }

  if (!Number.isInteger(input.duration) || input.duration < 1 || input.duration > 4) {
    throw new Error('Duration must be between 1 and 4 hours.');
  }

  if (input.guest.trim().length < 2) {
    throw new Error('Guest name is too short.');
  }

  if (input.brief.trim().length < 5) {
    throw new Error('Brief is too short.');
  }
}

function validateWaitlistInput(input: JoinWaitlistInput) {
  if (input.name.trim().length < 2) {
    throw new Error('Name is too short.');
  }

  if (!/\S+@\S+\.\S+/.test(input.email)) {
    throw new Error('Email is invalid.');
  }
}

async function loadSupabaseState() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const [bookingsResult, waitlistResult] = await Promise.all([
    supabase.from('ayvon_bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('ayvon_waitlist').select('*').order('created_at', { ascending: false })
  ]);

  if (bookingsResult.error || waitlistResult.error) {
    throw new Error(bookingsResult.error?.message ?? waitlistResult.error?.message ?? 'Supabase query failed.');
  }

  return {
    bookings: (bookingsResult.data ?? []).map((row) => normalizeBookingRow(row)),
    waitlist: (waitlistResult.data ?? []).map((row) => normalizeWaitlistRow(row))
  };
}

export async function loadLaunchState(): Promise<LaunchState> {
  try {
    const supabaseState = await loadSupabaseState();
    if (supabaseState) {
      return {
        ...supabaseState,
        backend: 'supabase'
      };
    }
  } catch (error) {
    if (isHostedRuntime()) {
      throw error;
    }

    // Fallback to local SQLite if Supabase is unavailable or not migrated yet.
  }

  assertHostedBackendConfig();
  return loadSqliteState();
}

export async function createBooking(input: CreateBookingInput): Promise<LaunchState> {
  validateBookingInput(input);

  const studio = getStudioById(input.studioId);
  if (!studio) {
    throw new Error('Unknown studio.');
  }

  const state = await loadLaunchState();
  const liveStudios = buildLiveStudios(state.bookings);
  const liveStudio = liveStudios.find((item) => item.id === input.studioId);
  const liveSlot = liveStudio?.availability.find((slot) => slot.label === input.slot);

  if (!liveStudio || !liveSlot) {
    throw new Error('Requested slot was not found.');
  }

  if (input.seats > liveStudio.seats) {
    throw new Error('Team size exceeds this studio capacity.');
  }

  if (liveSlot.left < input.seats) {
    throw new Error('Not enough seats left in this slot.');
  }

  const pricing = calculateBookingTotal(studio, input.duration, input.seats, input.membership);
  const timestamp = createTimestamp();
  const booking: Booking = {
    id: `AYV-${Date.now().toString().slice(-6)}`,
    studioId: studio.id,
    studioName: studio.name,
    city: studio.city,
    slot: input.slot,
    seats: input.seats,
    duration: input.duration,
    total: pricing.total,
    guest: input.guest.trim(),
    brief: input.brief.trim(),
    createdAt: timestamp.label
  };

  if (state.backend === 'supabase') {
    try {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        throw new Error('Supabase client is unavailable.');
      }

      const { error } = await supabase.from('ayvon_bookings').insert({
        id: booking.id,
        studio_id: booking.studioId,
        studio_name: booking.studioName,
        city: booking.city,
        slot: booking.slot,
        seats: booking.seats,
        duration: booking.duration,
        total: booking.total,
        guest: booking.guest,
        brief: booking.brief,
        created_at_label: booking.createdAt
      });

      if (error) {
        throw new Error(error.message);
      }

      return loadLaunchState();
    } catch (error) {
      if (isHostedRuntime()) {
        throw error;
      }

      // Fall through to the local SQLite database if the remote insert fails.
    }
  }

  assertHostedBackendConfig();
  const db = await ensureSqliteDb();
  db.prepare(`
    INSERT INTO ayvon_bookings_local (
      id, studio_id, studio_name, city, slot, seats, duration, total, guest, brief, created_at_label, created_at_sort
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    booking.id,
    booking.studioId,
    booking.studioName,
    booking.city,
    booking.slot,
    booking.seats,
    booking.duration,
    booking.total,
    booking.guest,
    booking.brief,
    booking.createdAt,
    timestamp.sort
  );

  return loadSqliteState();
}

export async function joinWaitlist(input: JoinWaitlistInput): Promise<LaunchState> {
  validateWaitlistInput(input);

  const timestamp = createTimestamp();
  const entry: WaitlistEntry = {
    id: `WL-${Date.now().toString().slice(-6)}`,
    name: input.name.trim(),
    email: input.email.trim(),
    goal: input.goal,
    city: input.city.trim(),
    createdAt: timestamp.label
  };

  const state = await loadLaunchState();

  if (state.backend === 'supabase') {
    try {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        throw new Error('Supabase client is unavailable.');
      }

      const { error } = await supabase.from('ayvon_waitlist').insert({
        id: entry.id,
        name: entry.name,
        email: entry.email,
        goal: entry.goal,
        city: entry.city,
        created_at_label: entry.createdAt
      });

      if (error) {
        throw new Error(error.message);
      }

      return loadLaunchState();
    } catch (error) {
      if (isHostedRuntime()) {
        throw error;
      }

      // Fall through to the local SQLite database if the remote insert fails.
    }
  }

  assertHostedBackendConfig();
  const db = await ensureSqliteDb();
  db.prepare(`
    INSERT INTO ayvon_waitlist_local (
      id, name, email, goal, city, created_at_label, created_at_sort
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(entry.id, entry.name, entry.email, entry.goal, entry.city, entry.createdAt, timestamp.sort);

  return loadSqliteState();
}
