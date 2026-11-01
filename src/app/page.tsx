'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { AgentSimulator } from '@/components/AgentSimulator';
import { ReasoningChamber } from '@/components/ReasoningChamber';
import { AgentPurchaseRequest, SentinelPolicy, EvaluationResult, AuditLedgerEntry } from '@/lib/types';
import { PRESET_SCENARIOS, INITIAL_LEDGER_SEED } from '@/lib/mockData';
import { DEFAULT_POLICY } from '@/lib/sentinel';

// Dynamic import AG Grid with SSR disabled for optimal hydration and zero layout shift
const AuditLedger = dynamic(
  () => import('@/components/AuditLedger').then((mod) => mod.AuditLedger),
  {
    ssr: false,
    loading: () => (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 flex items-center justify-center text-slate-400 font-mono text-xs">
        <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
        Mounting AG Grid Audit Terminal...
      </div>
    ),
  }
);

export default function Home() {
  const [request, setRequest] = useState<AgentPurchaseRequest>(PRESET_SCENARIOS[0].request);
  const [policy, setPolicy] = useState<SentinelPolicy>(DEFAULT_POLICY);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [ledgerEntries, setLedgerEntries] = useState<AuditLedgerEntry[]>(INITIAL_LEDGER_SEED);
  const [currentSpent, setCurrentSpent] = useState<number>(42.5);

  const handleExecute = async () => {
    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/sentinel/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request, policy }),
      });

      if (!res.ok) {
        throw new Error(`Evaluation failed with status ${res.status}`);
      }

      const data: EvaluationResult = await res.json();
      setEvaluation(data);

      // Create new audit ledger record
      const newTxId = `TX-${Math.floor(9500 + Math.random() * 500)}`;
      const newEntry: AuditLedgerEntry = {
        txId: newTxId,
        timestamp: new Date().toISOString(),
        agentId: request.agentId,
        merchant: request.merchant,
        item: request.item,
        category: request.category,
        amount: request.amount,
        currency: request.currency,
        riskScore: data.riskScore,
        status: data.decision === 'APPROVED_AUTO' ? 'CAPTURED' : data.decision === 'FLAGGED_REVIEW' ? 'PENDING_APPROVAL' : 'REJECTED',
        decision: data.decision,
        paypalOrderId: data.paypalOrderId || 'N/A',
        reasoningSummary: data.violations.length > 0 ? data.violations[0] : 'Autonomous clean pass',
        fullReasoning: data.reasoningTrace,
      };

      setLedgerEntries((prev) => [newEntry, ...prev]);

      if (data.decision === 'APPROVED_AUTO') {
        setCurrentSpent((prev) => prev + request.amount);
      }
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApprovePending = async (orderId: string) => {
    try {
      await fetch('/api/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      // Update state
      setCurrentSpent((prev) => prev + request.amount);
      setLedgerEntries((prev) =>
        prev.map((entry) =>
          entry.paypalOrderId === orderId ? { ...entry, status: 'CAPTURED' } : entry
        )
      );

      if (evaluation) {
        setEvaluation({
          ...evaluation,
          decision: 'APPROVED_AUTO',
          reasoningTrace: [
            ...evaluation.reasoningTrace,
            `[HUMAN-IN-THE-LOOP] Operator manual approval granted for ${orderId}.`,
            `[PAYPAL] Capture confirmed in Sandbox environment.`,
          ],
        });
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleRejectPending = () => {
    if (evaluation) {
      setEvaluation({
        ...evaluation,
        decision: 'BLOCKED_VIOLATION',
        reasoningTrace: [
          ...evaluation.reasoningTrace,
          `[HUMAN-IN-THE-LOOP] Operator manually rejected order ${evaluation.paypalOrderId}. Zero funds moved.`,
        ],
      });
      setLedgerEntries((prev) =>
        prev.map((entry) =>
          entry.paypalOrderId === evaluation.paypalOrderId
            ? { ...entry, status: 'REJECTED' }
            : entry
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      <Header
        currentSpent={currentSpent}
        sessionCap={policy.sessionBudgetCap}
        totalOrders={ledgerEntries.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6 w-full">
        
        {/* Upper Deck: 5:7 Split (Simulator on Left, Reasoning Chamber on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6">
            <AgentSimulator
              request={request}
              policy={policy}
              isEvaluating={isEvaluating}
              onRequestChange={setRequest}
              onPolicyChange={setPolicy}
              onExecute={handleExecute}
            />
          </div>
          <div className="lg:col-span-6">
            <ReasoningChamber
              evaluation={evaluation}
              isEvaluating={isEvaluating}
              onApprovePending={handleApprovePending}
              onRejectPending={handleRejectPending}
            />
          </div>
        </div>

        {/* Lower Deck: Full-Width AG Grid Real-Time Audit Ledger */}
        <div className="w-full">
          <AuditLedger entries={ledgerEntries} />
        </div>

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        PayAgent Sentinel — Built for PayPal AI Hackathon (Build What’s Next with PayPal & AI)
      </footer>
    </div>
  );
}
