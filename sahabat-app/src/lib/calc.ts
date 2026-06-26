import { STATUSES } from "./constants"
import type { Order, OrderStatus, PayStatus } from "./types"

export interface OrderCalc {
  subtotal: number
  total: number
  dp: number
  remaining: number
  pay: PayStatus
}

export function calc(o: Order): OrderCalc {
  const subtotal = o.items.reduce(
    (a, it) => a + (Number(it.base) || 0) * (Number(it.qty) || 0),
    0,
  )
  const total = Math.max(0, subtotal - (Number(o.discount) || 0))
  const dp = Number(o.dp) || 0
  const remaining = Math.max(0, total - dp)
  let pay: PayStatus = "unpaid"
  if (dp >= total && total > 0) pay = "paid"
  else if (dp > 0) pay = "partial"
  return { subtotal, total, dp, remaining, pay }
}

export function stageOf(o: Order): OrderStatus {
  const idxs = o.items.map((it) => STATUSES.indexOf(it.status)).filter((i) => i >= 0)
  if (!idxs.length) return "Order Masuk"
  const allDone = o.items.every((it) => it.status === "Selesai")
  if (allDone) return "Selesai"
  const active = o.items
    .filter((it) => it.status !== "Selesai")
    .map((it) => STATUSES.indexOf(it.status))
  return STATUSES[Math.min(...active)]
}

export function itemSubtotal(base: number | string, qty: number | string): number {
  return (Number(base) || 0) * (Number(qty) || 0)
}

/** Luas dalam m² dari ukuran cm (panjang × lebar × pcs) */
export function areaQty(dimL: string, dimW: string, pcs: string): number {
  const L = Number(dimL) || 0
  const W = Number(dimW) || 0
  const p = Number(pcs) || 0
  const a = (L / 100) * (W / 100) * p
  return a ? Number(a.toFixed(4)) : 0
}

export interface PayMetaInfo {
  label: string
  badgeClass: string
}

export function payMeta(pay: PayStatus): PayMetaInfo {
  if (pay === "paid")
    return {
      label: "Lunas",
      badgeClass: "bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]",
    }
  if (pay === "partial")
    return {
      label: "DP / Sebagian",
      badgeClass: "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]",
    }
  return {
    label: "Belum Bayar",
    badgeClass: "bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]",
  }
}

export function payShort(pay: PayStatus): string {
  return pay === "paid" ? "Lunas" : pay === "partial" ? "DP" : "Belum"
}
