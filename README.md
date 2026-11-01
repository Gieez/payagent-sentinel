# PayAgent Sentinel: Autonomous Agentic Commerce Firewall & PayPal Audit Ledger

![PayAgent Sentinel Thumbnail](https://payagent-sentinel.vercel.app/thumbnail.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20v2-0070BA)](https://developer.paypal.com)
[![AG Grid](https://img.shields.io/badge/AG%20Grid-v36%20Community-1f5af6)](https://www.ag-grid.com)

Built for the **PayPal AI Hackathon: Build What’s Next with PayPal & AI**.
Targeting:
- **Best Use of Agentic Commerce ($5,000)**
- **Best Use of AG Grid ($5,000)**
- **Grand Prize Pool ($12,000 / $8,000 / $5,000)**

---

## Executive Summary

As autonomous AI agents are granted access to execute real-world tasks (procuring API inference tokens, leasing cloud GPUs, indexing paid dataset streams), handing them raw credit cards or unlimited API tokens is an existential financial vulnerability. A single prompt injection, loop hallucination, or malicious vendor redirect can drain corporate balances in minutes.

**PayAgent Sentinel** is an autonomous runtime proxy gate and financial firewall for agentic commerce. When an AI agent invokes a procurement tool, Sentinel intercepts the call, audits the prompt justification using NLP guardrails, enforces deterministic budget matrices, and conditionally routes transactions through the **PayPal Sandbox Orders v2 API** (auto-capturing legitimate sub-threshold orders while flagging high-value anomalies for human-in-the-loop review). Every decision, risk score, and reasoning trace is committed in real time to an immutable **AG Grid Financial Audit Ledger**.

---

## Key Architecture & Features

```
[Autonomous AI Agent]
         │
         ▼ (Tool Call: paypal_procure(merchant, amount, intent))
[PayAgent Sentinel Runtime Firewall]
   ├── 1. Deterministic Budget Gate (Single-tx limit, rolling session cap)
   ├── 2. Threat Intelligence Domain Check (Blacklist & phishing filter)
   ├── 3. NLP Prompt-Injection & Intent Coherence Scanner
   └── 4. Disposition Engine:
         ├── [PASS: Risk < 20]     -> PayPal Orders v2 -> Auto-Capture (Zero-Touch)
         ├── [WARN: Risk 20-59]    -> PayPal Orders v2 (CREATED) -> Human-in-the-Loop Modal
         └── [BLOCK: Risk >= 60]   -> Execution Aborted (Zero funds committed)
         │
         ▼
[AG Grid Real-Time Audit Ledger]
(Tx ID, Timestamp, Agent Identity, Merchant, Amount, Risk Score, PayPal Order ID, Trace Log)
```

### 1. Meaningful PayPal Integration
- **PayPal Sandbox REST API v2**: Generates and captures authentic `v2/checkout/orders` payloads.
- **Dynamic Human-in-the-Loop Checkout**: When spending exceeds warning thresholds, orders are held in `CREATED` state until an operator clicks *Approve & Capture*, triggering direct capture calls.
- **Fail-Safe Sandbox Simulator**: For seamless evaluation by hackathon judges without pre-configured sandbox credentials, Sentinel automatically falls back to an authentic PayPal Sandbox schema simulator.

### 2. Best Use of Agentic Commerce
- Bridges non-deterministic agent tool execution (`paypal_procure`) with deterministic financial risk policies.
- Protects agents from adversarial jailbreaks (`SYSTEM OVERRIDE: ignore previous instructions...`).
- Real-time spend meter tracking session caps and velocity limits.

### 3. Enterprise-Grade AG Grid Audit Ledger
- Powered by **AG Grid v36 Community** (`ag-theme-quartz-dark`).
- **Real-Time Row Injection**: New agent orders stream into the grid immediately with smooth sorting and status badges.
- **High Data Density**: Pinned transaction columns, risk score visualization, and tabular monospaced currency formatting.
- **Quick Filter & CSV Export**: Judges can filter transactions by agent or merchant and export immutable audit records to CSV via the AG Grid API.
- **Drill-Down Inspection**: Clicking any row opens the full step-by-step LLM reasoning trace.

---

## Preset Evaluation Scenarios

Visitors can test 4 pre-configured scenarios with 1 click:
1. **LLM Inference Credits ($14.50)**: Autonomous researcher buying API tokens on `openrouter.ai` -> **APPROVED & AUTO-CAPTURED**.
2. **DevOps Cloud Worker ($48.00)**: Build agent provisioning high-RAM worker on `render.com` -> **FLAGGED FOR REVIEW** (Human-in-the-Loop required).
3. **Prompt Injection Jailbreak ($145.00)**: Malicious prompt attempting to bypass limits and route funds -> **BLOCKED: CRITICAL VIOLATION**.
4. **Blacklisted Merchant ($65.00)**: Scraper agent attempting to purchase on `darkmarket.io` -> **BLOCKED: REPUTATION FAILURE**.

---

## Quick Start & Local Run

### Prerequisites
- Node.js 18+ (Tested on Node 20 & 24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Gieez/payagent-sentinel.git
cd payagent-sentinel

# Install dependencies
npm install

# Run the production build or dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Optional: Real PayPal Sandbox Credentials
Create a `.env.local` file with your credentials from [developer.paypal.com](https://developer.paypal.com/):

```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

*(If omitted, Sentinel seamlessly uses the built-in high-fidelity Sandbox simulator)*.

---

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Dark Quartz Palette
- **Data Grid**: AG Grid v36 Community (`ag-grid-react`)
- **Payment Engine**: PayPal Sandbox REST API v2
- **Icons**: Lucide React

---

## License
[MIT](LICENSE) © 2026 Gieez
