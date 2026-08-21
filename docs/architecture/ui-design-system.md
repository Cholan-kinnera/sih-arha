# CBIP Frontend Design Foundation & System Blueprint

This document outlines the visual language, design philosophy, spatial hierarchy, component guidelines, and screen specifications for the **Citizen Benefits Intelligence Platform (CBIP)** web frontend (`apps/web/`).

---

## 1. Design Philosophy: Calm Competence

The emotional target of CBIP is **Calm Competence**. The user interface must instill trust, clarity, and authority while assisting citizens through scheme discovery, eligibility explanation, and evidence verification.

### Core Principles
- **Trustworthy & Authoritative**: Clean typography, high contrast readability, grounded source citations.
- **Minimal & Premium**: Restrained hairline borders, surface elevation over heavy shadows, disciplined color usage.
- **Spatial & Functional**: Clear visual separation between conversational AI interaction, deterministic rule evaluation, and document verification lifecycles.
- **Production-Oriented**: Built using reusable component primitives, strict type contracts, and accessible standards.

---

## 2. Core Visual Separation Axiom

$$\text{AI Explains} \longrightarrow \text{Eligibility Engine Decides} \longrightarrow \text{Verification Establishes Trust}$$

The interface explicitly communicates which system component is responsible for each state:
- **AI Assistant Panel**: Displays conversational explanations, multilingual translations, and document extraction assistance.
- **Eligibility Engine Surface**: Displays deterministic rule-by-rule evaluation trees, attribute comparison logic, and rule status flags.
- **Verification Authority Panel**: Displays document verification timelines, validity expiration meters, and provider evidence statuses.

---

## 3. Visual Language & Color Palette

### 3.1 Dark-First Color Tokens
- **Canvas / Background**: Near-black charcoal (`#0B0F17`, `#111827`)
- **Surfaces & Cards**: Dark charcoal with hairline borders (`#1F2937` with border `#374151`)
- **Typography**: Soft white primary text (`#F9FAFB`), muted slate secondary text (`#9CA3AF`)
- **AI / Information Accent**: Muted trust-blue (`#3B82F6`)
- **Eligible / Verified State**: Muted emerald green (`#10B981`)
- **Pending / Missing State**: Muted amber (`#F59E0B`)
- **Ineligible State**: Neutral slate / dark zinc (`#64748B`) *(avoid aggressive red for standard ineligibility)*

### 3.2 Typography Hierarchy
- **Primary Body & UI**: Inter (`sans-serif`)
- **Multilingual Support**: Noto Sans (`sans-serif`)
- **System Identifiers**: JetBrains Mono (`monospace`) — reserved for rule IDs (`RUL-001`), document IDs (`DOC-KAR-01`), citation references (`SRC-001`), and verification hashes.

---

## 4. Component Language & Geometry

- **Border Radius**: Restrained 8px to 12px radius.
- **Borders**: 1px hairline borders (`rgba(255, 255, 255, 0.1)`).
- **Elevation**: Layered background surfaces over heavy drop shadows.
- **Iconography**: Clean 24px stroke outline icons (e.g., Lucide React).
- **Spacing System**: Strict 8px grid (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).

---

## 5. Key Screen Architecture

```
                               ┌─────────────────────────────┐
                               │       Landing Page          │
                               └──────────────┬──────────────┘
                                              │
                               ┌──────────────▼──────────────┐
                               │ Citizen Profile / Onboarding│
                               └──────────────┬──────────────┘
                                              │
                               ┌──────────────▼──────────────┐
                               │      Citizen Dashboard      │
                               └──────────────┬──────────────┘
                                              │
           ┌──────────────────────────────────┼──────────────────────────────────┐
           ▼                                  ▼                                  ▼
┌────────────────────┐              ┌────────────────────┐             ┌────────────────────┐
│  Scheme Discovery  │              │  Eligibility View  │             │ Document Verifier  │
│ (Personalized List)│              │  (Rule AST Center) │             │ (Evidence Timeline)│
└────────────────────┘              └────────────────────┘             └────────────────────┘
```

### 5.1 Eligibility Explanation (Visual Centerpiece)
The **Eligibility Explanation** view is the primary demonstration screen. It presents a transparent rule evaluation tree:

- **Rule Status Indicators**:
  - `✓` **Passed Condition**: Green checkmark + rule ID (`RUL-001`) + attribute value check.
  - `⚠` **Missing Evidence**: Amber warning + rule ID (`RUL-002`) + required evidence badge (`INCOME_CERTIFICATE`).
  - `✗` **Failed Condition**: Neutral slate cross + rule ID (`RUL-003`) + failure explanation string.
- **Evaluation State Banner**: Displays one of 4 explicit states: `ELIGIBLE`, `NOT_ELIGIBLE`, `POTENTIALLY_ELIGIBLE`, `INSUFFICIENT_INFORMATION`.

### 5.2 Persistent AI Assistant Dock
- **Collapsed**: Floating single-line prompt dock at the bottom of the screen.
- **Expanded**: Full conversational surface sliding upward into the foreground.
- **Handoff Mechanism**: When a user asks *"Am I eligible for PM-KISAN?"*, the assistant initiates a visual handoff animation transitioning focus to the **Eligibility Engine Surface**.

### 5.3 Document Intelligence & Verification Timeline
Visualizes document evidence progression through 5 explicit lifecycle states:
$$\text{UNVERIFIED} \longrightarrow \text{PROCESSING} \longrightarrow \text{VERIFIED} \longrightarrow \text{EXPIRED / CONFLICTED} \longrightarrow \text{RE-VERIFICATION REQUIRED}$$

Differentiates between **EXTRACTED** (OCR result) and **VERIFIED** (Authority trust established).

---

## 6. Frontend Technical Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Server State**: React Query (`@tanstack/react-query`)
- **Client State**: Zustand
- **Motion Engine**: Framer Motion (respecting `prefers-reduced-motion`)
- **Icons**: Lucide React
