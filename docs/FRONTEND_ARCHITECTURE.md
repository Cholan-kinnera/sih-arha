# Frontend Architecture & Technical Specification

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

> **Document Type**: Technical Frontend Architecture Document  
> **Status**: Approved Baseline Architecture  
> **Hierarchical Authority**: [docs/PRODUCT_CONSTITUTION.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_CONSTITUTION.md) $\rightarrow$ [docs/PRODUCT_REQUIREMENTS.md](file:///home/cholan0415/Projects/sih-arha/docs/PRODUCT_REQUIREMENTS.md) $\rightarrow$ [docs/UX_SPECIFICATION.md](file:///home/cholan0415/Projects/sih-arha/docs/UX_SPECIFICATION.md) $\rightarrow$ [docs/UI_DESIGN_SYSTEM.md](file:///home/cholan0415/Projects/sih-arha/docs/UI_DESIGN_SYSTEM.md) $\rightarrow$ `docs/FRONTEND_ARCHITECTURE.md`

---

## 1. Executive Summary & Technology Stack

The LEWS web client is engineered as a high-throughput, low-latency geospatial situation room dashboard. It is optimized for continuous operational monitoring, rapid cognitive triage, and zero-latency WebSocket stream synchronization.

### Core Technology Choices & Justifications
- **React 19 (TypeScript)**: Delivers a component-driven architecture with strict type safety across all domain entities, UI states, and telemetry packets.
- **Vite 8 & `@tailwindcss/vite` 4**: Next-generation bundler delivering $<300\text{ms}$ Hot Module Replacement (HMR) and optimized tree-shaken production bundles.
- **React Router 7 (`createBrowserRouter`)**: Establishes declarative, nested route layouts enabling full-page transitions alongside contextual slide-over drawers without unmounting the geospatial map canvas.
- **Zustand 5**: Ultra-lightweight global client state management for UI states (sidebar collapse, active drawers, region selections) and WebSocket connectivity state.
- **TanStack Query (React Query) 5**: Manages asynchronous server-state caching, background re-validation, and deduplicated REST queries.
- **Lucide React**: Unified icon set encoding status and domain hierarchy with accessible labels.

---

## 2. Directory Hierarchy & Architectural Layers

```text
apps/web/
├── src/
│   ├── app/                      # Application root, routing & providers
│   │   ├── App.tsx               # Root component wrapping router & providers
│   │   ├── router.tsx            # React Router 7 route definitions
│   │   └── providers/            # Context & QueryClient providers
│   │       └── AppProviders.tsx
│   │
│   ├── components/               # Reusable UI & domain components
│   │   ├── ui/                   # Primitive design system components
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── layout/               # Application shell & navigation
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopHeader.tsx
│   │   │   ├── NavigationGroup.tsx
│   │   │   ├── NavigationItem.tsx
│   │   │   ├── RealtimeStatus.tsx
│   │   │   ├── SimulationModeBadge.tsx
│   │   │   └── DataFreshness.tsx
│   │   ├── risk/                 # Domain-specific risk indicators
│   │   │   ├── RiskSeverityBadge.tsx
│   │   │   └── RiskScoreGauge.tsx
│   │   ├── alerts/               # Alert domain components
│   │   │   └── AlertSeverityBadge.tsx
│   │   └── data/                 # Provenance & data tags
│   │       └── ProvenanceBadge.tsx
│   │
│   ├── config/                   # Global constants & environment configs
│   │   ├── env.config.ts         # Base URLs & runtime modes
│   │   └── constants.ts          # App metadata & navigation tree
│   │
│   ├── lib/                      # Core domain utilities & helpers
│   │   ├── utils.ts              # `cn()` styling helper (clsx + tailwind-merge)
│   │   ├── risk-semantics.ts     # Thresholds, colors, severity mappers
│   │   ├── date-utils.ts         # Relative time & operational UTC formatters
│   │   └── tests/                # Unit test suites
│   │       └── risk-semantics.test.ts
│   │
│   ├── pages/                    # Route entry point views
│   │   ├── OverviewPage.tsx      # `/overview`
│   │   ├── RiskMapPage.tsx       # `/map`
│   │   ├── ZonesPage.tsx         # `/zones`
│   │   ├── AlertsPage.tsx        # `/alerts`
│   │   ├── AnalyticsPage.tsx     # `/analytics`
│   │   ├── ModelIntelligencePage.tsx # `/model-intelligence`
│   │   ├── DataSourcesPage.tsx   # `/data-sources`
│   │   └── NotFoundPage.tsx      # `*`
│   │
│   ├── services/                 # External communication abstractions
│   │   ├── api/                  # REST API client & feature endpoints
│   │   │   ├── client.ts         # Fetch wrapper with timeout & error normalization
│   │   │   ├── zones.api.ts
│   │   │   ├── alerts.api.ts
│   │   │   ├── overview.api.ts
│   │   │   ├── analytics.api.ts
│   │   │   ├── model.api.ts
│   │   │   └── dataSources.api.ts
│   │   └── realtime/             # WebSocket stream & connection lifecycle
│   │       ├── types.ts          # TelemetryPacket, AlertEvent, WsMessage
│   │       ├── connectionManager.ts # Exponential backoff reconnect manager
│   │       └── websocket.ts      # WebSocket client singleton & event hub
│   │
│   ├── stores/                   # Global client state (Zustand)
│   │   ├── useUiStore.ts         # Sidebar, drawer, active region state
│   │   └── useRealtimeStore.ts   # Connection health, scenario, alert counts
│   │
│   ├── styles/                   # Design tokens & baseline styles
│   │   └── tokens.css            # CSS custom properties matching UI Design System
│   │
│   ├── types/                    # Domain & API TypeScript interfaces
│   │   ├── domain.types.ts       # Zone, SensorReading, RiskScore, Alert, etc.
│   │   ├── realtime.types.ts     # TelemetryPacket, ConnectionState, Scenarios
│   │   ├── api.types.ts          # ApiResponse, ApiError, OverviewSummary
│   │   └── ui.types.ts           # Navigation, SeverityVisualConfig, UI types
│   │
│   ├── index.css                 # Root CSS importing Tailwind & tokens
│   └── main.tsx                  # React 19 application mount point
└── ...
```

---

## 3. Application Shell & Routing Architecture

### 3.1. Layout Shell (`AppShell.tsx`)
The shell consists of a two-tier structural layout:
1. **Fixed Top Header (`TopHeader.tsx`)**: $56\text{px}$ high, fixed at the viewport top (`z-index: 40`). Houses the current monitoring region badge, real-time connection status (`🟢 LIVE`), prominent amber `⚡ SIMULATION MODE` indicator, telemetry freshness timer, and quick alert drawer button.
2. **Fixed Sidebar (`Sidebar.tsx`)**: $240\text{px}$ expanded, $68\text{px}$ collapsed (`z-index: 30`). Houses the brand header, grouped navigation links (`MONITOR`, `ANALYZE`, `SYSTEM`), dynamic alert count badge, and bottom collapse toggle.
3. **Workspace Canvas (`<Outlet />`)**: Fluid viewport container padded with $24\text{px}$ spacing, auto-scrolling independently of the sidebar and header.

### 3.2. Route Configuration (`router.tsx`)
```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'map', element: <RiskMapPage /> },
      { path: 'zones', element: <ZonesPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'model-intelligence', element: <ModelIntelligencePage /> },
      { path: 'data-sources', element: <DataSourcesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
```

---

## 4. State Management Architecture

### 4.1. Separation of State Responsibilities
- **Server Data Cache**: Handled by TanStack Query (`@tanstack/react-query`). Server queries are cached, auto-deduplicated, and invalidated on demand.
- **Client Global UI State**: Handled by dedicated, focused Zustand stores:
  - `useUiStore`: Tracks sidebar collapsed status, selected zone ID for slide-over inspection, alert drawer visibility, and region selection.
  - `useRealtimeStore`: Tracks live WebSocket connection state (`CONNECTED`, `RECONNECTING`, `OFFLINE`), simulation mode status, active simulation preset, and critical alert counts.
- **Local Component State**: Handled by standard React hooks (`useState`, `useReducer`) for ephemeral form inputs, tooltips, and tab toggles.

---

## 5. API & Realtime Communication Architecture

### 5.1. REST API Client (`services/api/client.ts`)
- Configured with base URL resolution from `VITE_API_BASE_URL`.
- Implements request timeout enforcement via `AbortController` (default $8000\text{ms}$).
- Normalizes HTTP errors into strongly typed `ApiError` instances.
- Automatically handles JSON response parsing with `ApiResponse<T>` unwrapping.

### 5.2. Realtime WebSocket Hub (`services/realtime/websocket.ts`)
- Manages an asynchronous duplex WebSocket connection to `/ws/live` and `/ws/alerts`.
- Backed by `RealtimeConnectionManager` with exponential backoff retry ($1s, 2s, 4s, 8s, \max 15s$).
- Automatically updates `lastTelemetryTimestamp` in `useRealtimeStore` upon receiving incoming telemetry packets.
- Implements a pub/sub listener registry enabling decoupled component subscriptions.

---

## 6. Design System Implementation & Tokens

### 6.1. CSS Custom Properties (`src/styles/tokens.css`)
Implements the exact color, spacing, radius, and elevation values defined in `docs/UI_DESIGN_SYSTEM.md`:
- **Canvas / Surfaces**: `--bg-canvas` (`#0b0f17`), `--bg-surface` (`#111827`), `--bg-elevated` (`#1f2937`).
- **Severity Tokens**: `--risk-low` (`#10b981`), `--risk-moderate` (`#f59e0b`), `--risk-high` (`#f97316`), `--risk-critical` (`#ef4444`).
- **Typography Tokens**: Dual-font configuration utilizing `Inter` for general interface copy and `JetBrains Mono` for coordinates, risk scores, and telemetry metrics.

---

## 7. Risk Semantics & 4-Factor Representation

In compliance with the **Four-Factor Risk Rule**, every risk representation implements:
$$\text{Risk Output} = \text{Color Token} + \text{Lucide Icon} + \text{Severity Text} + \text{Numerical Score}$$

### Severity Band Mappings (`src/lib/risk-semantics.ts`):
- `0.00 – 0.29`: **LOW** (Emerald Green, `CheckCircle2`, e.g. `"● LOW (0.18)"`)
- `0.30 – 0.59`: **MODERATE** (Amber Gold, `AlertCircle`, e.g. `"● MODERATE (0.45)"`)
- `0.60 – 0.79`: **HIGH** (Safety Orange, `AlertTriangle`, e.g. `"▲ HIGH (0.68)"`)
- `0.80 – 1.00`: **CRITICAL** (Crimson Red, `ShieldAlert`, e.g. `"🚨 CRITICAL (0.84)"`)

---

## 8. Testing Strategy & Quality Assurance

- **Unit Testing**: Node.js test runner with `tsx` (`src/lib/tests/risk-semantics.test.ts`) validating threshold boundary conditions, score clamping, and number formatting.
- **Linting & Code Quality**: `oxlint` ensuring zero unused imports, dead variables, or unhandled exceptions.
- **Type Checking**: TypeScript compiler (`tsc -b`) enforcing strict type safety with `noEmit: true`.
- **Production Build Verification**: `vite build` validating asset tree-shaking, CSS token compilation, and zero bundle errors.
