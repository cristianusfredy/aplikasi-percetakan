# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Sahabat Printing** — an MVP prototype of an internal print shop management system (Sistem Manajemen Percetakan). It replaces WhatsApp-based order tracking with a single-page web app. All text/labels are in Indonesian.

The app is a **self-contained single HTML file** — no build step, no npm, no backend. Open `Sahabat Printing v2.dc.html` directly in a browser.

## Running the App

Open `Sahabat Printing v2.dc.html` in a browser. No server required; `support.js` must be in the same directory. The runtime loads React 18 from unpkg.com and Lucide icons from unpkg.com, so an internet connection is needed on first load (cached thereafter).

`support.js` is the compiled dc-runtime. The comment at the top says it was generated from `dc-runtime/src/*.ts` with `cd dc-runtime && bun run build` — but that source directory is not in this repo. **Do not hand-edit `support.js`.**

## Architecture: dc-runtime (Design Component)

The app uses a custom reactive framework bundled in `support.js`. Every `.dc.html` file has two parts inside `<x-dc>`:

1. **Template** — HTML with `{{ expr }}` interpolations and two control tags:
   - `<sc-if value="{{ boolExpr }}">` — conditional rendering
   - `<sc-for list="{{ arrayExpr }}" as="item">` — list rendering
   - `style-hover="..."` — CSS applied on hover (compiled to a generated class)
   - Events: `onClick="{{ handlerName }}"`, `onInput="{{ handler }}"`, etc.
   - `hint-placeholder-val="{{ false }}"` / `hint-placeholder-count="4"` — skeleton loading hints; these do not affect runtime logic

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
| `role` | `'owner'`\|`'admin'`\|`'designer'`\|`'production'` | Active user role |
| `userId` | string | Active staff member ID (null for owner/admin) |
| `view` | string | Current page/view |
| `orders` | array | All orders (each with nested `items[]`) |
| `products` | array | Product catalog with base prices |
| `staff` | array | Staff members (`type: 'designer'` or `'production'`) |
| `stock` | array | Material stock levels |
| `draft` | object | In-progress new order form state |
| `nextNum` | number | Counter for `ORD-NNNN` order IDs |
| `vw` | number | Viewport width (updated on resize, `< 880` = mobile) |
| `task` | `{orderId, itemId}`\|null | Currently open task detail |
| `selectedOrderId` | string\|null | Currently open order detail |

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

- Designer role uses `DESIGN_FLOW` to advance tasks
- Production (operator) role uses `PROD_FLOW`
- When saving a new order, items with a `designerId` already assigned auto-start at `'Proses Desain'`

## Role-Based Access

| Role | Access |
|------|--------|
| `owner` | All views including reports, can edit prices |
| `admin` | Dashboard, orders, create order, products, stock (can edit payment, assign tasks) |
| `designer` / `production` | Tasks only (can update status, report issues, view stock) |

Access is enforced via computed booleans in `renderVals()`: `canCreate`, `canEditPay`, `canEditStatus`, `canEditStock`, `isStaff`, `isManager`, etc.

Default userId on login: `designer` → `'s1'`, `production` → `'s3'`, owner/admin → `null`.

## Theme System

Two themes (A and B), toggled by `toggleTheme`. Applied via CSS custom properties on the root div using `applyTheme()` called in `componentDidUpdate`.

Theme A = light green (`--page:#f6faf7`), Theme B = dark sidebar (`--side-bg:#15241b`). Both use `#15803d` as the primary accent.

## Key Patterns

### Formatting helpers
- `fmtRp(n)` — formats as Indonesian Rupiah with `Rp` prefix, e.g. `Rp25.000`
- `fmtRpShort(n)` — compact format: `25rb`, `1,5jt`
- `dateLabel(d)` — short date: `25 Jun`
- `dateLabelFull(d)` — long date: `25 Juni 2026`
- `waLink(c, text)` — WhatsApp web link, handles `08xx` → `62xx` conversion

### Order calculation
- `calc(o)` → `{ subtotal, total, dp, remaining, pay }` — `pay` is `'paid'|'partial'|'unpaid'`
- `stageOf(o)` — derives overall order status from item statuses: lowest-indexed active item status; `'Selesai'` if all items done

### Status / badge styling
- `statusMeta(s)` → `[bg, fg]` CSS color pair for each status string
- `badge(s, extra)` — returns inline style string for a status badge
- `payMeta(pay)` / `payBadge(pay)` — label + colors for payment status badges

### Mutation helper
- `mutateOrder(id, fn)` — immutably updates a single order in state; `fn` receives a shallow copy of the order

### Dimension-based products
Products with `dim: true` (e.g. Banner, Spanduk) use area pricing. The item stores `dimL`, `dimW` (in cm), and `pcs`. `areaQty(it)` computes `(L/100) * (W/100) * pcs` in m² and sets `qty`. Standard products use `qty` directly.

### Misc
- `toast(msg)` — shows a 2.2s bottom notification (use `this.toast('...')`)
- `allIssues()` — flattens all issue objects from all orders/items into a flat array
- `parseRefs(str)` — splits comma/newline refs into `{ label, isLink, href }` objects
- `paintIcons()` — renders Lucide icons via `lucide.createIcons()`, skips already-painted elements (checks `data-painted` attribute)
- `TODAY` is hardcoded as `'2026-06-25'` (MVP prototype, no live date)
- Order IDs follow format `ORD-NNNN`; `nextNum` starts at 1043

## File Reference

- `Sahabat Printing v2.dc.html` — **current version**, edit this one
- `Sahabat Printing.dc.html` — older v1 (kept for reference)
- `support.js` — dc-runtime (do not edit)
- `uploads/PRD_Sistem_Manajemen_Percetakan_MVP_Versi_Saat_Ini.md` — full Product Requirements Document
- `screenshots/` — UI screenshots for reference
