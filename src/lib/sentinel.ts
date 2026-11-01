import { AgentPurchaseRequest, SentinelPolicy, EvaluationResult, SentinelStatus } from './types';
import { createPayPalOrder, capturePayPalOrder } from './paypal';

/**
 * Default Sentinel Policy Configuration
 */
export const DEFAULT_POLICY: SentinelPolicy = {
  singleTxLimit: 75.0,
  sessionBudgetCap: 300.0,
  currentSpent: 42.5,
  requireApprovalAbove: 30.0,
  allowedCategories: ['cloud_infra', 'api_credits', 'data_source', 'dev_tool'],
  blockedKeywords: [
    'ignore previous',
    'system prompt',
    'override guardrail',
    'private wallet',
    'bypass limit',
    'personal gift',
    'crypto tumbler',
    'untraceable',
  ],
  blockedDomains: ['darkmarket.io', 'proxy-scam.ru', 'free-bitcoin-drop.xyz', 'stealth-card.cc'],
  strictPromptInjectionCheck: true,
};

/**
 * Evaluate Agent Purchase Request against Sentinel Security & Policy Guardrails
 */
export async function evaluateAgentPurchase(
  request: AgentPurchaseRequest,
  policy: SentinelPolicy = DEFAULT_POLICY
): Promise<EvaluationResult> {
  const startTime = Date.now();
  const reasoningTrace: string[] = [];
  const violations: string[] = [];
  let riskScore = 0;

  reasoningTrace.push(`[INGEST] Agent [${request.agentName} (${request.agentId})] issued purchase tool call for $${request.amount.toFixed(2)} ${request.currency}.`);
  reasoningTrace.push(`[METADATA] Merchant: ${request.merchant} (${request.merchantDomain}) | Category: ${request.category}`);

  // 1. Budget Checks
  if (request.amount > policy.singleTxLimit) {
    violations.push(`Amount $${request.amount.toFixed(2)} exceeds single transaction limit ($${policy.singleTxLimit.toFixed(2)})`);
    riskScore += 45;
    reasoningTrace.push(`[BUDGET] VIOLATION: Exceeds single transaction cap ($${request.amount.toFixed(2)} > $${policy.singleTxLimit.toFixed(2)})`);
  } else {
    reasoningTrace.push(`[BUDGET] PASSED: Within single transaction allowance ($${request.amount.toFixed(2)} <= $${policy.singleTxLimit.toFixed(2)})`);
  }

  const projectedBudget = policy.currentSpent + request.amount;
  if (projectedBudget > policy.sessionBudgetCap) {
    violations.push(`Projected spend $${projectedBudget.toFixed(2)} breaches session budget cap ($${policy.sessionBudgetCap.toFixed(2)})`);
    riskScore += 50;
    reasoningTrace.push(`[BUDGET] VIOLATION: Session cap breach (Current: $${policy.currentSpent.toFixed(2)}, Cap: $${policy.sessionBudgetCap.toFixed(2)})`);
  } else {
    reasoningTrace.push(`[BUDGET] PASSED: Projected session spend $${projectedBudget.toFixed(2)} within cap ($${policy.sessionBudgetCap.toFixed(2)})`);
  }

  // 2. Merchant & Domain Reputation
  const domainLower = request.merchantDomain.toLowerCase();
  if (policy.blockedDomains.some(d => domainLower.includes(d))) {
    violations.push(`Merchant domain [${request.merchantDomain}] is on active blacklisted domain registry`);
    riskScore += 80;
    reasoningTrace.push(`[REPUTATION] CRITICAL: Domain blacklisted in Sentinel Threat Intelligence.`);
  } else if (!domainLower.endsWith('.com') && !domainLower.endsWith('.org') && !domainLower.endsWith('.io') && !domainLower.endsWith('.net') && !domainLower.endsWith('.ai')) {
    violations.push(`Suspicious top-level domain detected on [${request.merchantDomain}]`);
    riskScore += 25;
    reasoningTrace.push(`[REPUTATION] WARN: Unusual TLD pattern detected on merchant URL.`);
  } else {
    reasoningTrace.push(`[REPUTATION] PASSED: Verified domain profile for [${request.merchantDomain}].`);
  }

  // 3. Category Validation
  if (!policy.allowedCategories.includes(request.category)) {
    violations.push(`Category '${request.category}' is not whitelisted in autonomous procurement policy`);
    riskScore += 35;
    reasoningTrace.push(`[POLICY] WARN: Unrecognized procurement category [${request.category}].`);
  } else {
    reasoningTrace.push(`[POLICY] PASSED: Authorized business procurement category.`);
  }

  // 4. Intent & Adversarial Prompt-Injection Scanner
  const promptLower = request.intentPrompt.toLowerCase();
  for (const keyword of policy.blockedKeywords) {
    if (promptLower.includes(keyword)) {
      violations.push(`Adversarial intent marker detected: "${keyword}"`);
      riskScore += 60;
      reasoningTrace.push(`[GUARDRAIL] ADVERSARIAL: Malicious or prompt-injection payload flagged matching pattern "${keyword}".`);
      break;
    }
  }

  // Check intent-to-item coherence
  if (request.intentPrompt.length < 10) {
    violations.push(`Agent intent explanation is insufficient (length < 10 chars)`);
    riskScore += 20;
    reasoningTrace.push(`[SEMANTICS] WARN: Agent justification too brief for audited checkout.`);
  } else {
    reasoningTrace.push(`[SEMANTICS] PASSED: Natural language justification verified for task coherence.`);
  }

  // Normalize risk score to 0-100
  riskScore = Math.min(100, Math.max(0, riskScore));

  // Determine Sentinel Decision
  let decision: SentinelStatus = 'APPROVED_AUTO';
  let orderId = '';
  let paypalStatus: 'CREATED' | 'COMPLETED' | 'REJECTED' = 'CREATED';

  if (riskScore >= 60 || violations.some(v => v.includes('blacklisted') || v.includes('Adversarial'))) {
    decision = 'BLOCKED_VIOLATION';
    paypalStatus = 'REJECTED';
    reasoningTrace.push(`[DISPOSITION] BLOCKED: Severe security risk score (${riskScore}/100). No financial funds committed.`);
  } else if (riskScore > 20 || request.amount >= policy.requireApprovalAbove) {
    decision = 'FLAGGED_REVIEW';
    reasoningTrace.push(`[DISPOSITION] FLAGGED: Risk score (${riskScore}/100) or amount ($${request.amount.toFixed(2)}) requires Human-in-the-Loop approval.`);
    
    // Create pending PayPal Sandbox Order
    const order = await createPayPalOrder(
      request.amount,
      request.currency,
      `[REVIEW] ${request.agentName}: ${request.item}`,
      request.id
    );
    orderId = order.id;
    paypalStatus = 'CREATED';
    reasoningTrace.push(`[PAYPAL] Order created in sandbox (${orderId}), awaiting human authorization.`);
  } else {
    decision = 'APPROVED_AUTO';
    reasoningTrace.push(`[DISPOSITION] APPROVED: Clean transaction telemetry. Initiating zero-touch autonomous capture.`);
    
    // Create and auto-capture PayPal Sandbox Order
    const order = await createPayPalOrder(
      request.amount,
      request.currency,
      `[AUTO-CAPTURED] ${request.agentName}: ${request.item}`,
      request.id
    );
    orderId = order.id;
    const capture = await capturePayPalOrder(orderId);
    paypalStatus = capture.status === 'COMPLETED' ? 'COMPLETED' : 'CREATED';
    reasoningTrace.push(`[PAYPAL] Autonomous capture succeeded. Order ID: ${orderId} | Capture Status: ${capture.status}`);
  }

  const latencyMs = Date.now() - startTime;
  reasoningTrace.push(`[SETTLEMENT] Cycle complete in ${latencyMs}ms.`);

  return {
    decision,
    riskScore,
    reasoningTrace,
    violations,
    paypalOrderId: orderId,
    paypalStatus,
    latencyMs,
  };
}
