import { NextResponse } from 'next/server';
import { loadLaunchState } from '@/lib/ayvon-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await loadLaunchState();
    return NextResponse.json(state);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load launch state.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
