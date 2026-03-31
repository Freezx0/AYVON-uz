# AYVON

AYVON is a startup-style concept website for Uzbekistan: a polished booking platform for vibe-based micro spaces.

Instead of renting generic meeting rooms, the user chooses a space by scenario:
- `Deep work`
- `Calls / podcast`
- `Team sprint`
- `Creative session`
- `Reset pause`

The interface looks like a premium product landing page, but it also works like a real app.

## What The Site Does

AYVON helps a user:
- browse a live catalog of curated spaces across multiple cities,
- filter by mood, city, budget and search query,
- get a recommended space from a built-in matchmaker,
- choose a real time slot and calculate pricing,
- create a booking,
- join a launch waitlist,
- see demand signals, occupancy and revenue charts,
- keep state after reload.

## Functional Parts

### 1. Hero + launch board
Shows the idea, live seat count, average occupancy, rating, booking count and waitlist count.

### 2. Catalog
The cards are interactive. Filters actually change the result set and the active studio.

### 3. Booking cockpit
The user picks:
- slot,
- duration,
- team size,
- membership mode,
- guest name,
- session brief.

Then the app creates a booking and immediately updates live availability.

### 4. Matchmaker
The concierge block recommends the best space based on:
- goal,
- team size,
- main priority.

### 5. Signals
Shows dynamic analytics for the currently selected space:
- occupancy,
- waitlist pressure,
- revenue,
- space quality metrics.

### 6. Live feed + waitlist
New bookings appear in the launch feed. Waitlist entries are saved through the backend as well.

## Backend Modes

The project supports 2 backend modes, but they are intended for different environments.

### Local SQLite backend
Works out of the box on your machine with no extra setup.

Data is saved in:
- `data/ayvon.sqlite`

If an older `data/ayvon-store.json` file exists, the app migrates that data into SQLite automatically on first run.

Use this mode for local development only.

Note:
- the local fallback uses `node:sqlite`
- for that reason, local development should run on Node 22+

### Supabase backend
If you add Supabase environment variables, the API routes will use Supabase instead of the local SQLite database.

Required env vars:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Template:
- `.env.example`

Schema file:
- `supabase/ayvon-schema.sql`

Important:
- hosted deployments should use Supabase
- the app will not try to write the local SQLite file on Vercel
- if Supabase env vars are missing in hosted mode, the API returns a clear configuration error instead of silently failing

## API Routes

The app uses internal API routes:
- `GET /api/launch-state`
- `POST /api/bookings`
- `POST /api/waitlist`

These routes power the frontend state and keep the product flow server-backed.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- SQLite
- Supabase

## Live Deploy

### Recommended production stack
- `Vercel` for hosting the Next.js app
- `Supabase Postgres` for bookings and waitlist

### Why not GitHub Pages
GitHub Pages only serves static files.

AYVON is not a static site. It uses server routes:
- `GET /api/launch-state`
- `POST /api/bookings`
- `POST /api/waitlist`

It also needs writable server-side persistence for bookings and waitlist.

Because of that, GitHub Pages is not a valid deployment target for this app.

### Vercel + Supabase setup
1. Create a Supabase project.
2. Open the SQL editor and run:
   - `supabase/ayvon-schema.sql`
3. In Vercel, import this GitHub repository.
4. Add these environment variables in the Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

5. Trigger a deployment.

After that:
- `GET /api/launch-state` reads from Supabase
- `POST /api/bookings` writes real bookings
- `POST /api/waitlist` writes real waitlist entries
- the live feed updates from the remote database instead of local SQLite

## Run

```bash
npm install
npm run dev
```

If you want local SQLite mode, use Node 22+.

Or production preview:

```bash
npm run build
npm run start
```

Open:

```text
http://localhost:3000
```

## Project Idea

This is not a clone of a common Uzbek listing site.

The core idea is:
`book a room by vibe, not by lease`

That means the product is built around emotional fit and work scenario, not just square meters and a photo gallery.
