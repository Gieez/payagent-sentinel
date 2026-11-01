import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const captureResult = await capturePayPalOrder(orderId);
    return NextResponse.json(captureResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Capture failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
