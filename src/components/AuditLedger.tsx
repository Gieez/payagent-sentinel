'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AuditLedgerEntry } from '@/lib/types';
import { Table, Search, Download, Shield, Eye, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface AuditLedgerProps {
  entries: AuditLedgerEntry[];
}

export function AuditLedger({ entries }: AuditLedgerProps) {
  const [gridApi, setGridApi] = useState<GridApi<AuditLedgerEntry> | null>(null);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<AuditLedgerEntry | null>(null);

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

  // AG Grid Column Definitions
  const columnDefs: ColDef<AuditLedgerEntry>[] = useMemo(() => [
    {
      headerName: 'TX ID',
      field: 'txId',
      width: 110,
      pinned: 'left',
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono text-cyan-400 font-semibold cursor-pointer">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Timestamp',
      field: 'timestamp',
      width: 140,
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
      width: 160,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-xs text-slate-200 truncate">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Merchant',
      field: 'merchant',
      width: 160,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono text-xs text-slate-300 font-medium">{params.value}</span>
      ),
    },
    {
      headerName: 'Item / Resource',
      field: 'item',
      minWidth: 200,
      flex: 1,
      cellClass: 'text-xs text-slate-300',
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 130,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 120,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono font-bold text-slate-100 text-xs">
          ${params.data?.amount.toFixed(2)}
        </span>
      ),
    },
    {
      headerName: 'Risk Score',
      field: 'riskScore',
      width: 110,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => {
        const score = params.value || 0;
        let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        if (score >= 60) color = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
        else if (score > 20) color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

        return (
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${color}`}>
            {score}/100
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
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> CAPTURED
            </span>
          );
        }
        if (status === 'PENDING_APPROVAL') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> REVIEW
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 font-medium">
            <XCircle className="w-3.5 h-3.5" /> REJECTED
          </span>
        );
      },
    },
    {
      headerName: 'PayPal Order ID',
      field: 'paypalOrderId',
      width: 150,
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <span className="font-mono text-xs text-blue-400 font-medium">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Inspect',
      width: 90,
      pinned: 'right',
      cellRenderer: (params: ICellRendererParams<AuditLedgerEntry>) => (
        <button
          type="button"
          onClick={() => setSelectedEntry(params.data || null)}
          className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      
      {/* Top Ledger Bar: Title, Search, Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-mono font-semibold tracking-wide text-white uppercase flex items-center gap-2">
              AG Grid Real-Time Audit Ledger
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-normal">
                AG Grid v36 Community
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Immutable telemetry for autonomous agent procurement & PayPal sandbox events
            </p>
          </div>
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter transactions..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Container */}
      <div className="ag-theme-quartz-dark w-full h-[380px] rounded-lg overflow-hidden border border-slate-800">
        <AgGridReact<AuditLedgerEntry>
          rowData={entries}
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

      {/* Row Detail Modal (LLM Reasoning Trace & Inspection) */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-mono font-bold text-white">
                  Audit Telemetry: {selectedEntry.txId}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Agent ID</span>
                <span className="text-slate-200">{selectedEntry.agentId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Amount</span>
                <span className="text-slate-200 font-bold">${selectedEntry.amount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Risk Score</span>
                <span className="text-cyan-400 font-bold">{selectedEntry.riskScore}/100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PayPal ID</span>
                <span className="text-blue-400">{selectedEntry.paypalOrderId}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono font-semibold text-slate-300">
                Full Sentinel Reasoning Trace
              </span>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto">
                {selectedEntry.fullReasoning.map((trace, idx) => (
                  <div key={idx} className="text-slate-300">
                    {trace}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
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
