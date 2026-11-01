'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AuditLedgerEntry } from '@/lib/types';
import {
  Table,
  Search,
  Download,
  Shield,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Copy,
  CheckCheck,
} from 'lucide-react';

interface AuditLedgerProps {
  entries: AuditLedgerEntry[];
}

export function AuditLedger({ entries }: AuditLedgerProps) {
  const [gridApi, setGridApi] = useState<GridApi<AuditLedgerEntry> | null>(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CAPTURED' | 'PENDING_APPROVAL' | 'REJECTED'>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<AuditLedgerEntry | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const onGridReady = useCallback((params: GridReadyEvent<AuditLedgerEntry>) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const onExportCsv = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `payagent-sentinel-audit-${new Date().toISOString().split('T')[0]}.csv`,
      });
    }
  }, [gridApi]);

  const filteredEntries = useMemo(() => {
    if (statusFilter === 'ALL') return entries;
    return entries.filter((e) => e.status === statusFilter);
  }, [entries, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: entries.length,
      captured: entries.filter((e) => e.status === 'CAPTURED').length,
      pending: entries.filter((e) => e.status === 'PENDING_APPROVAL').length,
      rejected: entries.filter((e) => e.status === 'REJECTED').length,
    };
  }, [entries]);

  const handleCopyJson = () => {
    if (!selectedEntry) return;
    navigator.clipboard.writeText(JSON.stringify(selectedEntry, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // AG Grid Column Definitions
  const columnDefs: ColDef<AuditLedgerEntry>[] = useMemo(() => [
    {
      headerName: 'TX ID',
      field: 'txId',
      width: 115,
      pinned: 'left',
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono text-cyan-400 font-bold tracking-tight cursor-pointer hover:underline">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Timestamp',
      field: 'timestamp',
      width: 130,
      valueFormatter: (params) => {
        if (!params.value) return '';
        try {
          const d = new Date(params.value);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch {
          return params.value;
        }
      },
      cellClass: 'font-mono text-slate-400 text-xs',
    },
    {
      headerName: 'Agent Identity',
      field: 'agentId',
      width: 170,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
            {params.value ? String(params.value).slice(0, 1).toUpperCase() : 'A'}
          </div>
          <span className="font-mono text-xs text-slate-200 truncate">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Merchant / Target',
      field: 'merchant',
      width: 170,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono text-xs text-slate-300 font-medium">{params.value}</span>
      ),
    },
    {
      headerName: 'Item / Procurement Resource',
      field: 'item',
      minWidth: 220,
      flex: 1,
      cellClass: 'text-xs text-slate-300',
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 130,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700/80 font-medium">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 120,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono font-bold text-slate-100 text-xs tracking-tight">
          ${params.data?.amount.toFixed(2)} USD
        </span>
      ),
    },
    {
      headerName: 'Risk Score',
      field: 'riskScore',
      width: 120,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => {
        const score = params.value || 0;
        let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (score >= 60) color = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
        else if (score > 20) color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

        return (
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${color}`}>
            {score} / 100
          </span>
        );
      },
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 140,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => {
        const status = params.value;
        if (status === 'CAPTURED') {
          return (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold">
              <CheckCircle className="w-3.5 h-3.5" /> CAPTURED
            </span>
          );
        }
        if (status === 'PENDING_APPROVAL') {
          return (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-bold">
              <AlertCircle className="w-3.5 h-3.5" /> REVIEW
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-400 font-bold">
            <XCircle className="w-3.5 h-3.5" /> REJECTED
          </span>
        );
      },
    },
    {
      headerName: 'PayPal Order ID',
      field: 'paypalOrderId',
      width: 160,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono text-xs text-blue-400 font-medium">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Inspect',
      width: 95,
      pinned: 'right',
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <button
          type="button"
          onClick={() => setSelectedEntry(params.data || null)}
          className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
      ),
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="bg-[#0b111c] border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
      
      {/* Top Ledger Bar: Title, Filters, Search, Export */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold tracking-wide text-white uppercase flex items-center gap-2">
              AG Grid Real-Time Audit Ledger
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 border border-blue-700/60 text-blue-300 font-semibold">
                AG Grid v36 Community
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Immutable financial record of agentic commerce events, fraud scores, and PayPal Sandbox settlements
            </p>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('CAPTURED')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'CAPTURED'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold shadow-sm'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Captured ({counts.captured})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PENDING_APPROVAL')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'PENDING_APPROVAL'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800 font-bold shadow-sm'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Review ({counts.pending})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('REJECTED')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'REJECTED'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800 font-bold shadow-sm'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Blocked ({counts.rejected})</span>
          </button>
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono transition-colors cursor-pointer shrink-0 shadow-sm"
            title="Download CSV via AG Grid Export API"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Quartz Dark Table */}
      <div className="ag-theme-quartz-dark w-full h-[400px] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
        <AgGridReact<AuditLedgerEntry>
          rowData={filteredEntries}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          onGridReady={onGridReady}
          rowSelection={{ mode: 'singleRow' }}
          onRowClicked={(e) => setSelectedEntry(e.data || null)}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>

      {/* Forensic Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b111c] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-mono font-bold text-white">
                    Forensic Telemetry: {selectedEntry.txId}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Timestamp: {new Date(selectedEntry.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Agent Identity</span>
                <span className="text-slate-200 font-semibold">{selectedEntry.agentId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Committed Amount</span>
                <span className="text-slate-100 font-bold">${selectedEntry.amount.toFixed(2)} USD</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Risk Score</span>
                <span className="text-cyan-400 font-bold">{selectedEntry.riskScore} / 100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">PayPal Order ID</span>
                <span className="text-blue-400 font-semibold">{selectedEntry.paypalOrderId}</span>
              </div>
            </div>

            {/* Full LLM Reasoning Trace */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-300">
                  Full Sentinel Reasoning Trace
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px] transition-colors"
                >
                  {copiedJson ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'JSON Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto shadow-inner leading-relaxed">
                {selectedEntry.fullReasoning.map((trace, idx) => (
                  <div key={idx} className="text-slate-300">
                    {trace}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-mono text-slate-500">
                Decision: <strong className="text-slate-300">{selectedEntry.decision}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
