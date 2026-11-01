'use client';

import React from 'react';
import { Shield, Activity, ExternalLink, Cpu } from 'lucide-react';

interface HeaderProps {
  currentSpent: number;
  sessionCap: number;
  totalOrders: number;
}

export function Header({ currentSpent, sessionCap, totalOrders }: HeaderProps) {
  const percentSpent = Math.min(100, (currentSpent / sessionCap) * 100);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-tight text-white">
                  PAYAGENT<span className="text-cyan-400">SENTINEL</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  v1.0 SANDBOX
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Autonomous Agentic Commerce Firewall & Real-Time Audit Ledger
              </p>
            </div>
          </div>

          {/* Telemetry & Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
            
            {/* Live Environment Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>PayPal v2 Orders</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>{totalOrders} Audited Orders</span>
              </div>
            </div>

            {/* Spend Guardrail Progress */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 min-w-[200px]">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" /> Session Spend
                </span>
                <span className="text-slate-200 font-semibold">
                  ${currentSpent.toFixed(2)} / ${sessionCap.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    percentSpent > 85 ? 'bg-rose-500' : percentSpent > 60 ? 'bg-amber-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${percentSpent}%` }}
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
              <a
                href="https://github.com/Gieez/payagent-sentinel"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
