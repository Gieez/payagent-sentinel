# Design Direction: PayAgent Sentinel

## Project
PayAgent Sentinel: Autonomous Agentic Commerce Firewall & Real-Time Financial Audit Ledger powered by PayPal Sandbox and AG Grid.

## Purpose
Provide a secure runtime proxy gate for autonomous AI agents making programmatic purchases, managing budget limits, evaluating malicious merchant intents, enforcing human-in-the-loop approvals, and capturing PayPal Orders v2 transactions with an immutable AG Grid audit log.

## Audience
PayPal AI Hackathon judges, autonomous agent engineers, fintech security teams, and e-commerce operators who require deterministic financial controls over non-deterministic LLM agents.

## Brand Character
- Technical
- Vigilant
- Precise
- Institutional
- Resilient
- High-performance

## Visual Concept
Institutional Fintech Security Terminal. Think Bloomberg command console engineered with modern dark UI rigor: high data density, monospaced numerical telemetry, high-contrast status pills (Verified/Settled/Blocked), real-time reasoning traces, and zero decorative fluff.

## Art Direction
Dark Technical Command Center. Deep obsidian backdrop with precision 1px borders, crisp monospaced metadata labels, and purpose-driven telemetry charts.

## Typography
- Display Typeface: Space Grotesk / Outfit
- Body Typeface: Plus Jakarta Sans
- Code / Data Typeface: JetBrains Mono
- Hierarchy:
  - Header: 20px / 1.2 / font-semibold / tracking-tight
  - Section Headings: 14px / font-mono / font-medium / tracking-wider / uppercase / text-muted-foreground
  - Data Values: 13px / font-mono / tabular-nums
  - Body Text: 13px / 1.4 / font-normal / text-slate-300
  - Captions & Meta: 11px / font-mono / text-slate-500

## Color System
- Canvas Background: `#080C14` (Deep obsidian slate)
- Card / Panel Surface: `#0F172A` (Rich dark slate)
- Surface Hover: `#1E293B`
- Subtle Border: `#1E293B`
- Focus / Active Border: `#38BDF8` (Sky blue precision)
- Brand Accent: `#0070BA` (PayPal Classic Electric Blue) & `#003087` (PayPal Deep Navy)
- Guardrail Safe / Captured: `#10B981` (Emerald)
- Guardrail Warn / Review: `#F59E0B` (Amber alert)
- Guardrail Rejected / High Risk: `#EF4444` (Crimson block)
- Text Primary: `#F8FAFC`
- Text Muted: `#94A3B8`
- Text Monospace: `#38BDF8`

## Composition & Layout
- Top Bar: System status (PayPal Sandbox Connected, Sentinel Policy Active, Total Spent / Budget Limit, AG Grid Audit Stream Ready).
- Upper Deck (Split Layout 5:7):
  - Left Panel: Autonomous Agent Simulator (Select agent task, budget policy threshold, inject prompt/anomalous request, trigger execution).
  - Right Panel: Real-time Sentinel Reasoning Chamber & PayPal Interactive Checkout / Approval Gate.
- Lower Deck: Full-width AG Grid Financial Ledger (Sortable, filterable, grouping by Agent ID, expandable LLM reasoning traces, PayPal Order IDs, Risk Scores).

## Shape Language
- Border Radius: 6px (`rounded-md`) for controls and panels, 4px (`rounded-sm`) for badges.
- Borders: Crisp 1px solid (`border-slate-800`), zero blurry outer glow.
- Elevation: Flat with sharp hairline depth.

## Motion & Transitions
- Micro-interactions: 120ms - 180ms ease-out.
- Real-time event highlights: subtle row pulse when new transaction is committed to AG Grid.
- Respect `prefers-reduced-motion` strictly.

## Component Philosophy
- Dense data displays over large empty cards.
- Direct interactive playground: Juri can click pre-configured presets (e.g., "Legit API Purchase", "Budget Overflow Attack", "Suspicious Merchant Phishing") and watch the policy engine and PayPal API react in real time.

## Forbidden Patterns
- No generic SaaS purple/pink gradient backgrounds.
- No floating 3D spheres or glassmorphic blur blobs.
- No em-dashes in microcopy.
- No static unclickable mockups; every button must execute genuine logic.
