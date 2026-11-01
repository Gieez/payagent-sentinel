'use client';

import React, { useState } from 'react';
import {
  Terminal,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Check,
  X,
  ExternalLink,
  Copy,
  CheckCheck,
  Activity,
  Layers,
  CreditCard,
} from 'lucide-react';
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
  const [copiedLog, setCopiedLog] = useState(false);

  const handleCopyLogs = () => {
    if (!evaluation) return;
    navigator.clipboard.writeText(evaluation.reasoningTrace.join('\n'));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  if (isEvaluating) {
    return (
      <div className="bg-[#0b111c] border border-slate-800/90 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[580px] text-center gap-5 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Terminal className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="max-w-md">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold inline-block mb-2">
            Sentinel Real-Time Pipeline Active
          </span>
          <h3 className="text-base font-mono font-bold text-white">
            Auditing Agent Tool Call & Ingesting Payload
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1.5 leading-relaxed">
            Scanning semantic prompt intent for jailbreak vectors, auditing budget caps, verifying domain reputation, and communicating with PayPal Sandbox v2 REST endpoints...
          </p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="bg-[#0b111c] border border-slate-800/90 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[580px] text-center gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="w-14 h-14 rounded-2xl bg-[#0e1624] border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
          <Terminal className="w-7 h-7 text-cyan-500/60" />
        </div>
        <div className="max-w-sm">
          <h3 className="text-sm font-mono font-bold text-slate-200">
            Sentinel Reasoning Deck Standby
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
            Select an autonomous agent scenario from the left panel and click &quot;Trigger Agent Payment Execution&quot; to inspect real-time security verification traces and PayPal Sandbox settlement.
          </p>
        </div>
      </div>
    );
  }

  const { decision, riskScore, reasoningTrace, violations, paypalOrderId, latencyMs } = evaluation;

  // Pipeline stages evaluation check
  const hasBudgetViolation = violations.some((v) => v.toLowerCase().includes('limit') || v.toLowerCase().includes('cap'));
  const hasDomainViolation = violations.some((v) => v.toLowerCase().includes('blacklisted') || v.toLowerCase().includes('domain'));
  const hasAdversarialViolation = violations.some((v) => v.toLowerCase().includes('adversarial') || v.toLowerCase().includes('marker'));

  return (
    <div className="bg-[#0b111c] border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl relative">
      
      {/* Top Banner: Disposition & Risk Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        
        {/* Disposition Badge */}
        <div className="flex items-center gap-3">
          {decision === 'APPROVED_AUTO' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-sm shadow-emerald-500/10">
              <ShieldCheck className="w-4 h-4" />
              <span>APPROVED & AUTO-CAPTURED</span>
            </div>
          )}
          {decision === 'FLAGGED_REVIEW' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-sm shadow-amber-500/10">
              <ShieldAlert className="w-4 h-4" />
              <span>FLAGGED FOR OPERATOR REVIEW</span>
            </div>
          )}
          {decision === 'BLOCKED_VIOLATION' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold shadow-sm shadow-rose-500/10">
              <ShieldX className="w-4 h-4" />
              <span>BLOCKED: SECURITY VIOLATION</span>
            </div>
          )}
        </div>

        {/* Risk Score & Latency Gauge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>{latencyMs}ms latency</span>
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Risk Meter:</span>
            <span
              className={`font-mono font-extrabold ${
                riskScore >= 60 ? 'text-rose-400' : riskScore > 20 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {riskScore} / 100
            </span>
          </div>
        </div>

      </div>

      {/* Multi-Stage Verification Pipeline Matrix */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> 5-Stage Verification Pipeline Status
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-mono">
          
          {/* Stage 1: Ingest */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center gap-1">
            <span className="text-slate-400">1. Ingest</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          {/* Stage 2: Budget */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center gap-1">
            <span className="text-slate-400">2. Budget Cap</span>
            {hasBudgetViolation ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <X className="w-3 h-3" /> BREACH
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> WITHIN CAP
              </span>
            )}
          </div>

          {/* Stage 3: Domain Reputation */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center gap-1">
            <span className="text-slate-400">3. Reputation</span>
            {hasDomainViolation ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <X className="w-3 h-3" /> BLOCKED
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> CLEAN TLD
              </span>
            )}
          </div>

          {/* Stage 4: Semantic NLP */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center gap-1">
            <span className="text-slate-400">4. Semantic NLP</span>
            {hasAdversarialViolation ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <X className="w-3 h-3" /> INJECTION
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> COHERENT
              </span>
            )}
          </div>

          {/* Stage 5: PayPal Orders v2 */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1 flex flex-col items-center gap-1">
            <span className="text-slate-400">5. PayPal Orders</span>
            {decision === 'BLOCKED_VIOLATION' ? (
              <span className="text-rose-400 font-bold">ABORTED</span>
            ) : decision === 'FLAGGED_REVIEW' ? (
              <span className="text-amber-400 font-bold">HELD REVIEW</span>
            ) : (
              <span className="text-emerald-400 font-bold">SETTLED</span>
            )}
          </div>

        </div>
      </div>

      {/* Human-in-the-Loop Action Banner (For FLAGGED_REVIEW) */}
      {decision === 'FLAGGED_REVIEW' && (
        <div className="bg-amber-950/20 border border-amber-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
          <div>
            <span className="text-xs font-mono font-bold text-amber-300 block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Human-in-the-Loop Approval Required
            </span>
            <span className="text-[11px] font-mono text-amber-200/80 mt-0.5 block">
              PayPal Sandbox Order <code className="text-white font-bold bg-amber-950/80 px-1 py-0.5 rounded">{paypalOrderId}</code> is staged in the review queue.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onApprovePending(paypalOrderId || '')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Approve & Capture
            </button>
            <button
              type="button"
              onClick={onRejectPending}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Reject Order
            </button>
          </div>
        </div>
      )}

      {/* Violations Flag Box */}
      {violations.length > 0 && (
        <div className="bg-rose-950/25 border border-rose-500/40 rounded-xl p-3.5 flex flex-col gap-2">
          <span className="text-[11px] font-mono font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldX className="w-3.5 h-3.5 text-rose-400" />
            Detected Guardrail Breaches ({violations.length})
          </span>
          <ul className="space-y-1.5">
            {violations.map((v, i) => (
              <li key={i} className="text-xs font-mono text-rose-200/90 flex items-start gap-2 bg-rose-950/30 p-2 rounded-lg border border-rose-900/40">
                <span className="text-rose-400 font-bold">•</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PayPal Sandbox Details Ribbon */}
      {paypalOrderId && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">PayPal Order ID:</span>
            <span className="text-cyan-400 font-bold">{paypalOrderId}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 uppercase">Sandbox v2 API</span>
            <a
              href={`https://www.sandbox.paypal.com/checkoutnow?token=${paypalOrderId}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 underline underline-offset-2"
            >
              <span>Sandbox Inspector</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Live Terminal Reasoning Logs Deck */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">Sentinel Real-Time Audit Log</span>
            <span className="text-slate-600">|</span>
            <span>{reasoningTrace.length} events logged</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLogs}
              className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px] transition-colors"
            >
              {copiedLog ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLog ? 'Copied' : 'Copy Log'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5 leading-relaxed shadow-inner">
          {reasoningTrace.map((log, index) => {
            let color = 'text-slate-300';
            if (log.startsWith('[INGEST]')) color = 'text-cyan-400 font-medium';
            if (log.startsWith('[BUDGET]')) color = log.includes('VIOLATION') ? 'text-rose-400 font-semibold' : 'text-emerald-400';
            if (log.startsWith('[REPUTATION]')) color = log.includes('CRITICAL') ? 'text-rose-400 font-semibold' : log.includes('WARN') ? 'text-amber-400' : 'text-slate-300';
            if (log.startsWith('[GUARDRAIL]')) color = 'text-rose-400 font-bold bg-rose-950/30 px-1 py-0.5 rounded';
            if (log.startsWith('[PAYPAL]')) color = 'text-blue-400 font-medium';
            if (log.startsWith('[DISPOSITION]')) color = log.includes('BLOCKED') ? 'text-rose-400 font-extrabold' : log.includes('FLAGGED') ? 'text-amber-400 font-bold' : 'text-emerald-400 font-extrabold';

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
