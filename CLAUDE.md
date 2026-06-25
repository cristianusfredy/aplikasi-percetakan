# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Sahabat Printing** — an MVP prototype of an internal print shop management system (Sistem Manajemen Percetakan). It replaces WhatsApp-based order tracking with a single-page web app. All text/labels are in Indonesian.

The app is a **self-contained single HTML file** — no build step, no npm, no backend. Open `Sahabat Printing v2.dc.html` directly in a browser.

## Running the App

Open `Sahabat Printing v2.dc.html` in a browser. No server required; `support.js` must be in the same directory. The runtime loads React 18 from unpkg.com, so an internet connection is needed on first load (cached thereafter).

`support.js` is the compiled dc-runtime. The comment at the top says it was generated from `dc-runtime/src/*.ts` with `cd dc-runtime && bun run build` — but that source directory is not in this repo. **Do not hand-edit `support.js`.**

## Architecture: dc-runtime (Design Component)

The app uses a custom reactive framework bundled in `support.js`. Every `.dc.html` file has two parts inside `<x-dc>`:

1. **Template** — HTML with `{{ expr }}` interpolations and two control tags:
   - `<sc-if value="{{ boolExpr }}">` — conditional rendering
   - `<sc-for list="{{ arrayExpr }}" as="item">` — list rendering
   - `style-hover="..."` — CSS applied on hover (compiled to a generated class)
   - Events: `onClick="{{ handlerName }}"`, `onInput="{{ handler }}"`, etc.

2. **Logic** — inside `<script type="text/x-dc" data-dc-script>`, a single class extending `DCLogic`:
   ```js
   class Component extends DCLogic {
     state = { /* all app state */ };
     renderVals() { return { /* computed values passed to template */ }; }
     someHandler = (e) => { this.setState({ ... }); };
   }
   ```
   - `this.setState(patch)` triggers a re-render (same API as React class components)
   - `renderVals()` returns the flat object that the template binds against — every `{{ name }}` in the template must appear here or in `state`
   - Lifecycle: `componentDidMount()`, `componentDidUpdate()`, `componentWillUnmount()`

The runtime compiles the template to React at runtime (not at build time).

## State Structure (in `Component.state`)

All data is in-memory (no backend):

| Key | Type | Description |
|-----|------|-------------|
| `screen` | `'login'`\|`'app'` | Whether the login screen or app is shown |
| `role` | `'owner'`\|`'admin'`\|`'designer'`\|`'operator'` | Active user role |
| `userId` | string | Active staff member ID |
| `view` | string | Current page/view |
| `orders` | array | All orders (each with nested `items[]`) |
| `products` | array | Product catalog with base prices |
| `staff` | array | Staff members (designers and operators) |
| `stock` | array | Material stock levels |
| `draft` | object | In-progress new order form state |

## Navigation / Views

Views (set via `this.setState({ view: '...' })`):

- `dashboard` — KPI cards, recent orders, issues, stock overview
- `orders` — filterable/searchable order list
- `orderDetail` — full order detail with payment panel
- `create` — multi-item order creation form
- `tasks` — operator/designer task list (filtered to their userId)
- `taskDetail` — single task detail with status advancement and issue reporting
- `products` — product price management
- `stock` — material stock management
- `reports` — business reports (daily/monthly)

## Production Status Flow

```
Order Masuk → Menunggu DP → Proses Desain → Menunggu Approval → Siap Cetak → Proses Cetak → Finishing → Siap Diambil → Selesai
                                                                              (also: Dibatalkan)
```

Defined in `MAIN_FLOW`, `DESIGN_FLOW`, `PROD_FLOW` constants. `nextStatus(cur, flow)` advances along a flow.

## Role-Based Access

| Role | Access |
|------|--------|
| `owner` | All views including reports, can edit prices |
| `admin` | Dashboard, orders, create order, products, stock (can edit payment, assign tasks) |
| `designer` / `operator` | Tasks only (can update status, report issues, view stock) |

Access is enforced via computed booleans in `renderVals()`: `canCreate`, `canEditPay`, `canEditStatus`, `isStaffRole`, etc.

## Theme System

Two themes (A and B), toggled by `toggleTheme`. Applied via CSS custom properties on the root div:
`--accent`, `--accent-strong`, `--accent-soft`, `--page`, `--card`, `--border`, `--text`, `--muted`, `--side-*` etc.
Theme A = light green, Theme B = dark slate. Both use `#15803d` as the primary accent.

## Key Patterns

- **Mutation helper**: `mutateOrder(id, fn)` — immutably updates a single order in state
- **Formatting**: `fmt(n)` formats numbers as Indonesian Rupiah (no `Rp` prefix, uses `.` thousands separator)
- **Date**: `TODAY` is hardcoded as `'2026-06-25'` (MVP prototype, no live date)
- **Lucide icons**: `<i data-lucide="icon-name"></i>`, rendered by calling `lucide.createIcons()` via `paintIcons()` after each render
- **Print/Nota**: `.print-area` class + `@media print` CSS for invoice printing

## File Reference

- `Sahabat Printing v2.dc.html` — **current version**, edit this one
- `Sahabat Printing.dc.html` — older v1 (kept for reference)
- `support.js` — dc-runtime (do not edit)
- `uploads/PRD_Sistem_Manajemen_Percetakan_MVP_Versi_Saat_Ini.md` — full Product Requirements Document
- `screenshots/` — UI screenshots for reference
