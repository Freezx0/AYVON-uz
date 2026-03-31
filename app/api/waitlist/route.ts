import { NextResponse } from 'next/server';
import { isHostedBackendConfigError, joinWaitlist } from '@/lib/ayvon-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const state = await joinWaitlist(body);
    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to join waitlist.';
    const status = isHostedBackendConfigError(error) ? 503 : /invalid|short/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
