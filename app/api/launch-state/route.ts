import { NextResponse } from 'next/server';
import { isHostedBackendConfigError, loadLaunchState } from '@/lib/ayvon-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const state = await loadLaunchState();
    return NextResponse.json(state);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load launch state.';
    const status = isHostedBackendConfigError(error) ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
