'use client';

import React from 'react';
import { Terminal, ShieldCheck, ShieldAlert, ShieldX, Check, X, ExternalLink } from 'lucide-react';
import { EvaluationResult } from '@/lib/types';

interface ReasoningChamberProps {
  evaluation: EvaluationResult | null;
  isEvaluating: boolean;
  onApprovePending: (orderId: string) => void;
  onRejectPending: () => void;
}

export function ReasoningChamber({
  evaluation,
  isEvaluating,
  onApprovePending,
  onRejectPending,
}: ReasoningChamberProps) {
  if (isEvaluating) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center min-h-[460px] text-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Terminal className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-mono font-semibold text-white">
            Sentinel Security Pipeline Active
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm">
            Auditing agent intent prompt, checking budget guardrails, verifying merchant reputation, and minting PayPal Sandbox telemetry...
          </p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center min-h-[460px] text-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
          <Terminal className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-mono font-semibold text-slate-200">
            Sentinel Reasoning Chamber Idle
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm">
            Select an autonomous agent scenario on the left and trigger the payment tool call to inspect real-time evaluation logs and PayPal Sandbox capture.
          </p>
        </div>
      </div>
    );
  }

  const { decision, riskScore, reasoningTrace, violations, paypalOrderId, latencyMs } = evaluation;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      
      {/* Top Banner: Disposition & Risk Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        
        {/* Disposition Badge */}
        <div className="flex items-center gap-3">
          {decision === 'APPROVED_AUTO' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>APPROVED & AUTO-CAPTURED</span>
            </div>
          )}
          {decision === 'FLAGGED_REVIEW' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>FLAGGED FOR OPERATOR REVIEW</span>
            </div>
          )}
          {decision === 'BLOCKED_VIOLATION' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-semibold">
              <ShieldX className="w-4 h-4" />
              <span>BLOCKED: SECURITY VIOLATION</span>
            </div>
          )}
        </div>

        {/* Risk Score & Latency */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400 text-[11px]">Latency: {latencyMs}ms</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">Risk Score:</span>
            <span
              className={`font-bold ${
                riskScore >= 60 ? 'text-rose-400' : riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {riskScore}/100
            </span>
          </div>
        </div>

      </div>

      {/* Human-in-the-Loop Action Panel (For FLAGGED_REVIEW) */}
      {decision === 'FLAGGED_REVIEW' && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div>
            <span className="text-xs font-mono font-semibold text-amber-300 block">
              Human-in-the-Loop Approval Required
            </span>
            <span className="text-[11px] font-mono text-amber-200/70">
              PayPal Sandbox Order <code className="text-white font-bold">{paypalOrderId}</code> created in review queue.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onApprovePending(paypalOrderId || '')}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Approve & Capture
            </button>
            <button
              type="button"
              onClick={onRejectPending}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        </div>
      )}

      {/* Violations List (if any) */}
      {violations.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3">
          <span className="text-[11px] font-mono font-semibold text-rose-300 block mb-1 uppercase tracking-wider">
            Flagged Guardrail Breaches ({violations.length})
          </span>
          <ul className="space-y-1">
            {violations.map((v, i) => (
              <li key={i} className="text-xs font-mono text-rose-200/90 flex items-start gap-1.5">
                <span className="text-rose-500">•</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PayPal Sandbox Details */}
      {paypalOrderId && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">PayPal Order ID:</span>
            <span className="text-cyan-400 font-bold">{paypalOrderId}</span>
          </div>
          <a
            href={`https://www.sandbox.paypal.com/checkoutnow?token=${paypalOrderId}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Sandbox Inspector</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Live Terminal Reasoning Logs */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Sentinel Real-Time Audit Log
          </span>
          <span>{reasoningTrace.length} events logged</span>
        </div>
        <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-3 font-mono text-[11px] max-h-56 overflow-y-auto space-y-1 leading-relaxed">
          {reasoningTrace.map((log, index) => {
            let color = 'text-slate-300';
            if (log.startsWith('[INGEST]')) color = 'text-cyan-400';
            if (log.startsWith('[BUDGET]')) color = log.includes('VIOLATION') ? 'text-rose-400' : 'text-emerald-400';
            if (log.startsWith('[REPUTATION]')) color = log.includes('CRITICAL') ? 'text-rose-400' : log.includes('WARN') ? 'text-amber-400' : 'text-slate-300';
            if (log.startsWith('[GUARDRAIL]')) color = 'text-rose-400 font-semibold';
            if (log.startsWith('[PAYPAL]')) color = 'text-blue-400';
            if (log.startsWith('[DISPOSITION]')) color = log.includes('BLOCKED') ? 'text-rose-400 font-bold' : log.includes('FLAGGED') ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold';

            return (
              <div key={index} className={color}>
                {log}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
