'use client';

import React from 'react';
import { Bot, Play, Sliders, CheckCircle2 } from 'lucide-react';
import { AgentPurchaseRequest, SentinelPolicy } from '@/lib/types';
import { PRESET_SCENARIOS } from '@/lib/mockData';

interface AgentSimulatorProps {
  request: AgentPurchaseRequest;
  policy: SentinelPolicy;
  isEvaluating: boolean;
  onRequestChange: (updated: AgentPurchaseRequest) => void;
  onPolicyChange: (updated: SentinelPolicy) => void;
  onExecute: () => void;
}

export function AgentSimulator({
  request,
  policy,
  isEvaluating,
  onRequestChange,
  onPolicyChange,
  onExecute,
}: AgentSimulatorProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-5">
      
      {/* Header & Preset Switchers */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-mono font-semibold tracking-wide text-white uppercase">
              Autonomous Agent Playground
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Select a scenario to test guardrails
          </span>
        </div>

        {/* 1-Click Scenario Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = request.id === preset.request.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onRequestChange({ ...preset.request, timestamp: new Date().toISOString() })}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/70 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {preset.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border inline-block w-fit ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Request Parameter Inputs */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
          <span className="text-xs font-mono font-medium text-slate-300">
            Agent Outbound Purchase Payload
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            Tool Call: <code className="bg-slate-900 px-1 py-0.5 rounded">paypal_procure()</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Agent Info */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Agent Identity
            </label>
            <input
              type="text"
              value={request.agentName}
              onChange={(e) => onRequestChange({ ...request, agentName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Amount ({request.currency})
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                value={request.amount}
                onChange={(e) => onRequestChange({ ...request, amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-800 rounded pl-6 pr-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Merchant Name
            </label>
            <input
              type="text"
              value={request.merchant}
              onChange={(e) => onRequestChange({ ...request, merchant: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Merchant Domain
            </label>
            <input
              type="text"
              value={request.merchantDomain}
              onChange={(e) => onRequestChange({ ...request, merchantDomain: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Item Description */}
        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">
            Product / Resource Requested
          </label>
          <input
            type="text"
            value={request.item}
            onChange={(e) => onRequestChange({ ...request, item: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Natural Language Intent / Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-mono text-slate-400">
              Agent Natural Language Intent Justification
            </label>
            <span className="text-[10px] font-mono text-slate-500">
              NLP Scanned by Sentinel
            </span>
          </div>
          <textarea
            rows={2}
            value={request.intentPrompt}
            onChange={(e) => onRequestChange({ ...request, intentPrompt: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Policy Guardrails Panel (Editable) */}
      <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Active Security Constraints
          </span>
          <span className="text-[10px] text-slate-500">Deterministic Guardrails</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Single Tx Cap ($)</label>
            <input
              type="number"
              value={policy.singleTxLimit}
              onChange={(e) => onPolicyChange({ ...policy, singleTxLimit: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 text-center border border-slate-700/60 rounded py-0.5 text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Review Above ($)</label>
            <input
              type="number"
              value={policy.requireApprovalAbove}
              onChange={(e) => onPolicyChange({ ...policy, requireApprovalAbove: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 text-center border border-slate-700/60 rounded py-0.5 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Session Cap ($)</label>
            <input
              type="number"
              value={policy.sessionBudgetCap}
              onChange={(e) => onPolicyChange({ ...policy, sessionBudgetCap: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 text-center border border-slate-700/60 rounded py-0.5 text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Execution CTA Button */}
      <button
        type="button"
        disabled={isEvaluating}
        onClick={onExecute}
        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wide uppercase shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isEvaluating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Evaluating Sentinel Policy & Sandbox API...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Trigger Agent Payment Tool</span>
          </>
        )}
      </button>

    </div>
  );
}
