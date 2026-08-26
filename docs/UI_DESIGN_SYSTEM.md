# UI Design System & Visual Specification (Light Enterprise Edition)

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

> **Document Type**: Master UI Design System & Visual Specification  
> **Status**: Approved Baseline Specification (Revised for Light Enterprise Intelligence UI)  
> **Hierarchical Authority**: [docs/PRODUCT_CONSTITUTION.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_CONSTITUTION.md) $\rightarrow$ [docs/PRODUCT_REQUIREMENTS.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_REQUIREMENTS.md) $\rightarrow$ [docs/UX_SPECIFICATION.md](file:///home/cholan0415/Projects/sih-arha/docs/UX_SPECIFICATION.md) $\rightarrow$ `docs/UI_DESIGN_SYSTEM.md`  
> **Target Audience**: Frontend Engineers, UI/UX Designers, Design System Maintainers, Evaluators

---

## 1. Design Direction & Visual Identity

### 1.1. Core Character: Light Enterprise Intelligence UI
The visual language of LEWS is engineered to communicate:

> **"This is a high-reliability, premium geospatial disaster-intelligence and operational monitoring platform."**

The aesthetic category is:
**Enterprise Geospatial Intelligence + Modern Financial/Operations Software + Premium SaaS Quality**

Key visual pillars:
- **Light Workspace Canvas**: Clean, warm-white / soft-slate canvas (`#f8fafc`) paired with crisp white card containers (`#ffffff`).
- **Deep Charcoal Typography**: High-contrast, highly legible slate typography (`#0f172a` and `#475569`) eliminating visual fatigue.
- **Restrained Blue/Indigo Accent**: Professional enterprise blue (`#2563eb`) used purposefully for active navigation, primary CTAs, and selected states.
- **Semantic Severity Encoding**: Colors are strictly reserved for conveying risk and operational state (`#16a34a` Low, `#d97706` Moderate, `#ea580c` High, `#dc2626` Critical).
- **Subtle Structure**: $1\text{px}$ crisp borders (`#e2e8f0`) and soft, minimal shadows (`0 1px 3px 0 rgba(0, 0, 0, 0.05)`).

### 1.2. Absolute Prohibitions & Anti-Patterns
1. 🚫 **ABSOLUTELY NO EMOJIS**: Emojis are strictly banned across the entire application interface (buttons, alerts, cards, headings, navigation, status pills, tooltips, empty states). All visual metaphors must use **Lucide React icons**.
   - *Example*: Do not use `⚡ SIMULATION MODE`; use `Simulation Mode` with the `Activity` or `Zap` Lucide icon.
   - *Example*: Do not use `🚨 CRITICAL`; use `CRITICAL` with the `TriangleAlert` or `ShieldAlert` Lucide icon.
2. 🚫 **NO NEON / RGB / CYBERPUNK AESTHETICS**: No glowing rainbow borders, neon green gauges, purple AI gradients, or dark admin template styling.
3. 🚫 **NO GENERIC DARK-MODE ADMIN STYLING**: The operational workspace is clean, bright, structured, and legible.
4. 🚫 **CONTROLLED GLASSMORPHISM RULE**: Glassmorphism is permitted **only** for floating map overlays (zoom controls, layer selectors, map legends) and future landing page hero sections. It is **never** applied to standard dashboard cards, tables, sidebars, or modal dialogs.
5. 🚫 **NO PLACEHOLDER PRODUCT MESSAGING**: Do not render placeholder text such as *"Frontend Architecture Initialized"*, *"Coming Soon"*, or *"Module Foundation Ready"*.

---

## 2. Semantic Color System

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          LIGHT ENTERPRISE COLOR MATRIX                                 │
├─────────────────┬───────────┬─────────────────────────┬────────────────────────────────┤
│ CATEGORY        │ HEX VALUE │ CSS TOKEN               │ OPERATIONAL USAGE              │
├─────────────────┼───────────┼─────────────────────────┼────────────────────────────────┤
│ Canvas / Bg     │ `#f8fafc` │ `--color-background`    │ Soft slate page canvas         │
│ Surface         │ `#ffffff` │ `--color-surface`       │ White card & panel containers  │
│ Surface Subtle  │ `#f1f5f9` │ `--color-surface-subtle`│ Table headers, input fills     │
│ Surface Elev.   │ `#ffffff` │ `--color-surface-elev.` │ Dropdowns, popovers, drawers   │
│ Border Subtle   │ `#e2e8f0` │ `--color-border`        │ Standard container borders     │
│ Border Strong   │ `#cbd5e1` │ `--color-border-strong` │ Focused inputs, divider lines  │
├─────────────────┼───────────┼─────────────────────────┼────────────────────────────────┤
│ Text Primary    │ `#0f172a` │ `--color-text-primary`  │ Deep charcoal headings & values│
│ Text Secondary  │ `#475569` │ `--color-text-secondary`│ Slate body text & labels       │
│ Text Muted      │ `#94a3b8` │ `--color-text-muted`    │ Timestamps, captions, units    │
│ Text Disabled   │ `#cbd5e1` │ `--color-text-disabled` │ Disabled button text           │
├─────────────────┼───────────┼─────────────────────────┼────────────────────────────────┤
│ Brand Accent    │ `#2563eb` │ `--color-brand`         │ Blue-600 primary action/nav    │
│ Brand Hover     │ `#1d4ed8` │ `--color-brand-hover`   │ Blue-700 active/hover          │
│ Brand Subtle    │ `#eff6ff` │ `--color-brand-subtle`  │ Blue-50 active item background │
├─────────────────┼───────────┼─────────────────────────┼────────────────────────────────┤
│ LOW Risk        │ `#16a34a` │ `--color-risk-low`      │ Emerald Green (0.00 – 0.29)    │
│ MODERATE Risk   │ `#d97706` │ `--color-risk-moderate` │ Amber Gold (0.30 – 0.59)       │
│ HIGH Risk       │ `#ea580c` │ `--color-risk-high`     │ Safety Orange (0.60 – 0.79)    │
│ CRITICAL Risk   │ `#dc2626` │ `--color-risk-critical` │ Crimson Red (0.80 – 1.00)      │
│ System / Info   │ `#2563eb` │ `--color-info`          │ Telemetry & system feeds       │
└─────────────────┴───────────┴─────────────────────────┴────────────────────────────────┘
```

> [!IMPORTANT]
> **The Four-Factor Risk Representation Rule**:  
> Risk is **NEVER** communicated through color alone. Every risk state must present:  
> **1. Semantic Color** + **2. Lucide Icon** + **3. Severity Text** + **4. Exact Numerical Score**  
> *(Example: Red Border + `TriangleAlert` Icon + `"CRITICAL"` + `"0.84"`)*.

---

## 3. CSS Custom Properties & Design Tokens

```css
:root {
  /* Canvas & Surfaces */
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-subtle: #f1f5f9;
  --color-surface-elevated: #ffffff;
  --color-overlay: rgba(15, 23, 42, 0.4);

  /* Borders */
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-border-focus: #2563eb;

  /* Typography Colors */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-text-disabled: #cbd5e1;
  --color-text-inverse: #ffffff;

  /* Brand Colors */
  --color-brand: #2563eb;
  --color-brand-hover: #1d4ed8;
  --color-brand-subtle: #eff6ff;
  --color-brand-border: #bfdbfe;

  /* Semantic Hazard Tiers */
  --color-risk-low: #16a34a;
  --color-risk-low-bg: #f0fdf4;
  --color-risk-low-border: #bbf7d0;

  --color-risk-moderate: #d97706;
  --color-risk-moderate-bg: #fffbeb;
  --color-risk-moderate-border: #fde68a;

  --color-risk-high: #ea580c;
  --color-risk-high-bg: #fff7ed;
  --color-risk-high-border: #fed7aa;

  --color-risk-critical: #dc2626;
  --color-risk-critical-bg: #fef2f2;
  --color-risk-critical-border: #fecaca;

  /* System & Simulator */
  --color-info: #2563eb;
  --color-info-bg: #eff6ff;
  --color-info-border: #bfdbfe;

  --color-simulator: #d97706;
  --color-simulator-bg: #fffbeb;
  --color-simulator-border: #fde68a;

  /* Fonts */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 9999px;

  /* Subtle Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
  --shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --shadow-drawer: -4px 0 20px rgba(0, 0, 0, 0.08);
}
```

---

## 4. Typography System

| Role | Font Family | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Metric** | `JetBrains Mono` | `28px` (`1.75rem`)| `700` (Bold) | `1.15` | `-0.02em` | Main KPI values (`0.84`, `184.2 mm`) |
| **Page Title** | `Inter` | `20px` (`1.25rem`)| `700` (Bold) | `1.25` | `-0.01em` | Screen headers (`Overview`, `Risk Map`) |
| **Section Header**| `Inter` | `16px` (`1rem`) | `600` (Semi) | `1.35` | `0` | Card & Panel titles (`Top At-Risk Zones`) |
| **Card Header** | `Inter` | `13px` (`0.8125rem`)| `600` (Semi) | `1.4` | `0.01em` | Widget headers (`Rainfall Intensity`) |
| **Body Standard** | `Inter` | `14px` (`0.875rem`)| `400` (Regular)| `1.5` | `0` | Descriptions, tables, AI evidence |
| **Body Small** | `Inter` | `12px` (`0.75rem`) | `400` (Regular)| `1.4` | `0` | Metadata, helper text, drawer subtext |
| **Monospace Data** | `JetBrains Mono` | `12px` (`0.75rem`) | `500` (Medium) | `1.4` | `0` | Zone IDs, coordinates, timestamps |
| **Badge / Tag** | `Inter` | `11px` (`0.6875rem`)| `600` (Semi)| `1.2` | `0.04em` | Status chips (`CRITICAL`, `SIMULATION`) |

---

## 5. Spacing System

Strict 4-point spacing scale creating a structured, calm enterprise rhythm:
- `sp-1` ($4\text{px}$): Micro gap between icon & label.
- `sp-2` ($8\text{px}$): Button gap, compact padding.
- `sp-3` ($12\text{px}$): Form input padding, table cell vertical padding.
- `sp-4` ($16\text{px}$): Standard card interior padding.
- `sp-5` ($20\text{px}$): Drawer interior padding, featured widget gaps.
- `sp-6` ($24\text{px}$): Page content margins and main layout grid gaps.
- `sp-8` ($32\text{px}$): Large structural section separation.

---

## 6. Border Radius Tokens

- **`--radius-sm` ($4\text{px}$)**: Checkboxes, dropdown items, tooltips.
- **`--radius-md` ($6\text{px}$)**: Buttons, text inputs, table headers, compact cards.
- **`--radius-lg` ($8\text{px}$)**: Standard cards, modal dialogs, drawer panels.
- **`--radius-pill` ($9999\text{px}$)**: Status badges, severity tags, filter pills.

---

## 7. Elevation & Subtle Shadow Tokens

- **Flat (Default)**: Clean white surface with $1\text{px}$ border (`#e2e8f0`).
- **Low (`--shadow-sm`)**: Subtle hover feedback on interactive cards.
- **Medium (`--shadow-md`)**: Dropdowns, floating map controls.
- **Drawer (`--shadow-drawer`)**: Right-side slide-over panel over the map canvas.

---

## 8. Layout Grid & Desktop Workspace

- **Top Header**: Height $56\text{px}$, fixed at top, background `#ffffff`, border bottom `1px solid #e2e8f0`.
- **Sidebar**: Width $240\text{px}$ (expanded) / $68\text{px}$ (collapsed), background `#ffffff`, border right `1px solid #e2e8f0`.
- **Workspace Canvas**: Fluid background `#f8fafc`, padding $24\text{px}$, max width $1600\text{px}$.

---

## 9. Sidebar Design

- **Background**: Solid `#ffffff` with $1\text{px}$ right border `#e2e8f0`.
- **Header**: Clean brand title `LEWS` in `#0f172a` with a blue logo icon container (`bg-blue-50 text-blue-600 border border-blue-200`).
- **Navigation Groups**: `MONITOR`, `ANALYZE`, `SYSTEM` with $11\text{px}$ uppercase slate headers (`#64748b`).
- **Navigation Item**:
  - Inactive: Text `#475569`, icon `#64748b`, hover `bg-slate-100 text-[#0f172a]`.
  - Active: Background `bg-blue-50`, text `text-blue-700 font-semibold`, left border $2\text{px}$ `border-blue-600`.
- **Alert Badge**: High-contrast red pill (`bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 text-xs`).

---

## 10. Top Header Design

- **Height**: $56\text{px}$; Background: `#ffffff`; Bottom Border: `1px solid #e2e8f0`.
- **Left**: Monitoring Basin pill (`bg-slate-100 text-slate-700 border border-slate-200`) with `MapPin` icon.
- **Center**:
  - Realtime Indicator: `LIVE (WebSocket)` with green pulsing dot (`bg-emerald-500`) and text (`text-emerald-700 bg-emerald-50 border border-emerald-200`).
  - Simulation Mode Badge: `Simulation Mode` with `Activity` icon in subtle amber (`bg-amber-50 text-amber-800 border border-amber-200`).
- **Right**:
  - Data Freshness: `Clock` icon + `Updated 4s ago` in `#64748b`.
  - Alert Notification Bell: Icon button with red badge count.

---

## 11. Reusable Card System

- **Standard Card**: Background `#ffffff`, border `1px solid #e2e8f0`, radius $8\text{px}$, shadow `--shadow-sm`.
- **Metric Card**: Displays metric label in `#64748b` uppercase, value in $28\text{px}$ `JetBrains Mono` `#0f172a`, and supporting text.
- **Alert Card**: Card with $4\text{px}$ vertical severity stripe on the left edge (`#dc2626` for Critical, `#ea580c` for High, `#d97706` for Moderate).
- **Interactive Card**: Subtle hover border transition to `#cbd5e1` and hover shadow.

---

## 12. Button System

| Variant | Visual Styling | Usage Scenario |
| :--- | :--- | :--- |
| **Primary** | `bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm` | Primary CTAs: "Acknowledge Alert", "Run Simulation" |
| **Secondary** | `bg-white hover:bg-slate-50 text-slate-700 border border-slate-300` | Supporting actions: "Fit Bounds", "Export Report" |
| **Ghost** | `hover:bg-slate-100 text-slate-600 hover:text-slate-900` | Tertiary actions: "Dismiss", "Close" |
| **Danger** | `bg-red-50 hover:bg-red-100 text-red-700 border border-red-200` | Destructive / emergency actions |
| **Icon Button**| `w-9 h-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md` | Zoom controls, tool toggles |

---

## 13. Status Badge Taxonomy (No Emojis)

| State | Lucide Icon | Background | Border | Text | Rendered Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `LOW` | `CheckCircle2` | `#f0fdf4` | `#bbf7d0` | `#15803d` | `CheckCircle2 + LOW (0.18)` |
| `MODERATE` | `AlertCircle` | `#fffbeb` | `#fde68a` | `#b45309` | `AlertCircle + MODERATE (0.45)` |
| `HIGH` | `TriangleAlert`| `#fff7ed` | `#fed7aa` | `#c2410c` | `TriangleAlert + HIGH (0.68)` |
| `CRITICAL` | `ShieldAlert` | `#fef2f2` | `#fecaca` | `#b91c1c` | `ShieldAlert + CRITICAL (0.84)` |
| `LIVE` | `Radio` | `#f0fdf4` | `#bbf7d0` | `#15803d` | `Radio + LIVE` |
| `SIMULATOR` | `Activity` | `#fffbeb` | `#fde68a` | `#b45309` | `Activity + Simulation Mode` |
| `REAL-WORLD` | `Globe` | `#eff6ff` | `#bfdbfe` | `#1d4ed8` | `Globe + REAL-WORLD` |

---

## 14. Geospatial Risk Map & Floating Glass Controls

- **Base Map**: OpenStreetMap Light / Positron CartoDB tiles with clean, high-contrast terrain.
- **Zone Polygon Styling**:
  - *Low Risk*: Fill `#16a34a`, Opacity `0.25`, Stroke `#16a34a`, Width $1.5\text{px}$.
  - *Moderate Risk*: Fill `#d97706`, Opacity `0.35`, Stroke `#d97706`, Width $2.0\text{px}$.
  - *High Risk*: Fill `#ea580c`, Opacity `0.45`, Stroke `#ea580c`, Width $2.5\text{px}$.
  - *Critical Risk*: Fill `#dc2626`, Opacity `0.55`, Stroke `#dc2626`, Width $3.0\text{px}$.
- **Selected Zone Outline**: High-contrast blue halo (`stroke: #2563eb, width: 3.5px, filter: drop-shadow(0 0 4px rgba(37,99,235,0.4))`).
- **Floating Overlays (Controlled Glassmorphism)**: Floating map tools (layer toggles, legend) use `bg-white/90 backdrop-blur-md border border-slate-200 shadow-md`.

---

## 15. AI Situation Briefing Component (No Chatbot / No Emojis)

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ AI SITUATION BRIEFING                                     [ Model: Grounded Gemini ]    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Current conditions indicate critical failure susceptibility in Meppadi Catchment North  │
│ (Index: 0.84). The primary trigger is extreme 72-hour precipitation (310.2mm) acting on │
│ a steep 34.5° slope with 86.4% soil moisture saturation.                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ STRUCTURED EVIDENCE USED: 72h Rain: 310mm | Soil Sat: 86% | Slope: 34.5° (No Hallucination)│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Container**: Background `#f8fafc`, border `1px solid #e2e8f0`, radius $8\text{px}$.
- **Footer**: Explicitly lists the structured telemetry inputs used for generation.

---

## 16. Future Landing Page Visual Direction

While the operational dashboard uses a clean **Light Enterprise Intelligence** theme, the future public-facing landing page will feature:
- **Spatial + Cinematic + Modern**: Rich mountain topography terrain renders, atmospheric depth, and interactive GIS storytelling.
- **Controlled Glass Panels**: Layered translucent surfaces with backdrop blur over geospatial maps.
- **Authoritative Presentation**: Focuses on physics-informed intelligence, public safety readiness, and data provenance. Zero gaming aesthetics.

---

## 17. Governance & Visual Contract

```text
PRODUCT_CONSTITUTION.md
        ↓
PRODUCT_REQUIREMENTS.md
        ↓
UX_SPECIFICATION.md
        ↓
UI_DESIGN_SYSTEM.md (Light Enterprise Edition)
        ↓
FRONTEND IMPLEMENTATION
```
