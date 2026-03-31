import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/ayvon-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const state = await createBooking(body);
    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create booking.';
    const status = /unknown|invalid|required|short|not enough|exceeds|not found/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
