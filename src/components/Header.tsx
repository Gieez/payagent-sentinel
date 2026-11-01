'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Activity, ExternalLink, Cpu, Lock, Zap, Clock, Terminal } from 'lucide-react';

interface HeaderProps {
  currentSpent: number;
  sessionCap: number;
  totalOrders: number;
  blockedCount: number;
  avgLatencyMs: number;
}

export function Header({
  currentSpent,
  sessionCap,
  totalOrders,
  blockedCount,
  avgLatencyMs,
}: HeaderProps) {
  const [timeUtc, setTimeUtc] = useState<string>('');
  const percentSpent = Math.min(100, (currentSpent / sessionCap) * 100);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const blockRate = totalOrders > 0 ? Math.round((blockedCount / totalOrders) * 100) : 0;

  return (
    <header className="border-b border-slate-800/80 bg-[#070b13]/90 backdrop-blur-xl sticky top-0 z-50">
      
      {/* Top Telemetry Strip */}
      <div className="border-b border-slate-800/40 bg-[#04070c] px-4 sm:px-6 py-1.5 text-[11px] font-mono flex flex-wrap items-center justify-between text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">PAYPAL SANDBOX v2:</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>SENTINEL KERNEL:</span>
            <span className="text-slate-200">DETERMINISTIC GUARDRAILS ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{timeUtc || 'SYNCING UTC...'}</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-400">
            <Terminal className="w-3 h-3" />
            <span>DEVPOST HACKATHON BUILD</span>
          </div>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/70 transition-colors">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070b13]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold tracking-tight text-white">
                  PAYAGENT<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SENTINEL</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-700/60 text-cyan-300 font-semibold tracking-wide">
                  ENTERPRISE AGENTIC FIREWALL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>Autonomous Agent Procurement Protection</span>
                <span className="text-slate-700">•</span>
                <span className="text-slate-500">PayPal Orders v2 & AG Grid Ledger</span>
              </p>
            </div>
          </div>

          {/* Real-Time KPIs & Spend Meter */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* KPI Block 1: Audited Volume */}
            <div className="bg-[#0b111c] border border-slate-800/90 rounded-lg px-3 py-2 flex flex-col min-w-[100px]">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> Audited Tx
              </span>
              <span className="text-sm font-mono font-bold text-slate-100 mt-0.5">
                {totalOrders} <span className="text-[10px] text-slate-500 font-normal">orders</span>
              </span>
            </div>

            {/* KPI Block 2: Threat Mitigation Rate */}
            <div className="bg-[#0b111c] border border-slate-800/90 rounded-lg px-3 py-2 flex flex-col min-w-[110px]">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Blocked Threats
              </span>
              <span className="text-sm font-mono font-bold text-rose-400 mt-0.5 flex items-center gap-1">
                {blockedCount} <span className="text-[10px] text-slate-400 font-normal">({blockRate}%)</span>
              </span>
            </div>

            {/* KPI Block 3: Latency */}
            <div className="bg-[#0b111c] border border-slate-800/90 rounded-lg px-3 py-2 flex flex-col min-w-[95px] hidden sm:flex">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-medium">
                Avg Latency
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {avgLatencyMs > 0 ? `${avgLatencyMs}ms` : '< 2ms'}
              </span>
            </div>

            {/* Session Spend Guardrail Progress */}
            <div className="bg-[#0b111c] border border-slate-800/90 rounded-lg px-3.5 py-2 min-w-[210px] flex-1 sm:flex-initial">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" /> Session Cap
                </span>
                <span className="text-slate-200 font-bold">
                  ${currentSpent.toFixed(2)} <span className="text-slate-500 font-normal">/ ${sessionCap.toFixed(2)}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentSpent > 85 ? 'bg-rose-500 shadow-sm shadow-rose-500/50' : percentSpent > 60 ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${percentSpent}%` }}
                />
              </div>
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/Gieez/payagent-sentinel"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white bg-[#0b111c] hover:bg-slate-800/80 border border-slate-800/90 transition-all text-xs font-mono shrink-0 shadow-sm"
              title="View Source on GitHub"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

          </div>

        </div>
      </div>
    </header>
  );
}
