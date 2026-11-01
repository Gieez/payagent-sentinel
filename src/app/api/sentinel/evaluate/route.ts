import { NextRequest, NextResponse } from 'next/server';
import { evaluateAgentPurchase, DEFAULT_POLICY } from '@/lib/sentinel';
import { AgentPurchaseRequest, SentinelPolicy } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const purchaseRequest: AgentPurchaseRequest = body.request;
    const policy: SentinelPolicy = body.policy || DEFAULT_POLICY;

    if (!purchaseRequest || !purchaseRequest.amount || !purchaseRequest.merchant) {
      return NextResponse.json(
        { error: 'Invalid purchase request payload. Missing amount or merchant.' },
        { status: 400 }
      );
    }

    const evaluation = await evaluateAgentPurchase(purchaseRequest, policy);
    return NextResponse.json(evaluation);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Evaluation engine error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
