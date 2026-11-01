export type SentinelStatus = 'APPROVED_AUTO' | 'FLAGGED_REVIEW' | 'BLOCKED_VIOLATION';

export interface AgentPurchaseRequest {
  id: string;
  agentId: string;
  agentName: string;
  merchant: string;
  merchantDomain: string;
  item: string;
  category: 'cloud_infra' | 'api_credits' | 'data_source' | 'dev_tool' | 'unverified';
  amount: number;
  currency: string;
  intentPrompt: string;
  timestamp: string;
}

export interface SentinelPolicy {
  singleTxLimit: number; // e.g. $50
  sessionBudgetCap: number; // e.g. $250
  currentSpent: number;
  requireApprovalAbove: number; // e.g. $25
  allowedCategories: string[];
  blockedKeywords: string[];
  blockedDomains: string[];
  strictPromptInjectionCheck: boolean;
}

export interface EvaluationResult {
  decision: SentinelStatus;
  riskScore: number; // 0 - 100
  reasoningTrace: string[];
  violations: string[];
  paypalOrderId?: string;
  paypalStatus?: 'CREATED' | 'COMPLETED' | 'REJECTED';
  latencyMs: number;
}

export interface AuditLedgerEntry {
  txId: string;
  timestamp: string;
  agentId: string;
  merchant: string;
  item: string;
  category: string;
  amount: number;
  currency: string;
  riskScore: number;
  status: 'CAPTURED' | 'PENDING_APPROVAL' | 'REJECTED';
  decision: SentinelStatus;
  paypalOrderId: string;
  reasoningSummary: string;
  fullReasoning: string[];
}
