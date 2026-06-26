import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { cn } from "@/lib/utils"
import { calc } from "@/lib/calc"
import { fmtRp, fmtRpShort } from "@/lib/format"
import { TODAY } from "@/lib/constants"
import { PageHead, SectionCard } from "@/components/common"
import { OrderListItem } from "@/components/OrderListItem"
import { Icon } from "@/components/Icon"

type Period = "today" | "week" | "month"
const DOW = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

function ymd(d: Date): string {
  const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
function recentDays(n: number): Date[] {
  const base = new Date(TODAY + "T00:00:00")
  const out: Date[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    out.push(d)
  }
  return out
}
function inPeriod(createdAt: string, period: Period): boolean {
  if (!createdAt) return false
  if (period === "today") return createdAt === TODAY
  if (period === "week") return recentDays(7).map(ymd).includes(createdAt)
  return createdAt.slice(0, 7) === TODAY.slice(0, 7)
}

export function Reports() {
  const { orders, allIssues } = useApp()
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>("month")

  const d = useMemo(() => {
    const periodOrders = orders.filter((o) => inPeriod(o.createdAt, period))
    const revenue = periodOrders.reduce((a, o) => a + calc(o).dp, 0)
    const value = periodOrders.reduce((a, o) => a + calc(o).total, 0)
    const unpaid = periodOrders.filter((o) => calc(o).pay !== "paid")
    const outstanding = unpaid.reduce((a, o) => a + calc(o).remaining, 0)

    const day7 = recentDays(7).map((dt) => {
      const key = ymd(dt)
      const val = orders
        .filter((o) => o.createdAt === key)
        .reduce((a, o) => a + calc(o).total, 0)
      return { key, val, num: dt.getDate(), dow: DOW[dt.getDay()] }
    })
    const maxV = Math.max(1, ...day7.map((x) => x.val))

    const agg: Record<string, { name: string; qty: number; rev: number; unit: string }> = {}
    periodOrders.forEach((o) =>
      o.items.forEach((it) => {
        if (it.status === "Dibatalkan") return
        const k = it.productName || "—"
        const rev = (Number(it.base) || 0) * (Number(it.qty) || 0)
        if (!agg[k]) agg[k] = { name: k, qty: 0, rev: 0, unit: it.unit }
        agg[k].qty += Number(it.qty) || 0
        agg[k].rev += rev
      }),
    )
    const top = Object.values(agg).sort((a, b) => b.rev - a.rev).slice(0, 5)
    const maxRev = Math.max(1, ...top.map((p) => p.rev))

    return { periodOrders, revenue, value, unpaid, outstanding, day7, maxV, top, maxRev }
  }, [orders, period])

  const issues = allIssues()
  const periodWord = period === "today" ? "hari ini" : period === "week" ? "7 hari terakhir" : "bulan ini"
  const periodShort = period === "today" ? "Hari Ini" : period === "week" ? "7 Hari" : "Bulan Ini"
  const trendTotal = d.day7.reduce((a, x) => a + x.val, 0)

  return (
    <div>
      <PageHead crumb="Analitik" title="Laporan Bisnis" />

      <div className="no-print mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl border bg-card p-1">
          {(["today", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition-colors",
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {p === "today" ? "Hari Ini" : p === "week" ? "7 Hari" : "Bulan Ini"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setTimeout(() => window.print(), 30)}
          className="ml-auto flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2.5 text-[13px] font-bold hover:border-primary hover:text-primary"
        >
          <Icon name="download" className="size-4 text-primary" />
          Ekspor / Cetak
        </button>
      </div>

      <div className="print-area">
        <div className="mb-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <RKpi label={`Order ${periodShort}`} value={String(d.periodOrders.length)} sub={`periode ${periodWord}`} />
          <RKpi label="Nilai Order" value={fmtRp(d.value)} sub="total nilai pesanan" />
          <RKpi label="Pendapatan Masuk" value={fmtRp(d.revenue)} sub="DP + pelunasan" color="text-[#16a34a]" />
          <RKpi label="Belum Lunas" value={fmtRp(d.outstanding)} sub={`${d.unpaid.length} order`} color="text-[#dc2626]" />
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-[18px] shadow-sm">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold">Nilai Order Masuk</h3>
                <div className="mt-0.5 text-[12px] text-muted-foreground">7 hari terakhir</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-muted-foreground">Total</div>
                <div className="text-[16px] font-extrabold tabular-nums text-primary">
                  {fmtRp(trendTotal)}
                </div>
              </div>
            </div>
            <div className="flex h-[150px] items-end gap-2 pt-3.5">
              {d.day7.map((x) => {
                const h = x.val > 0 ? Math.max(6, Math.round((x.val / d.maxV) * 100)) : 2
                const isToday = x.key === TODAY
                return (
                  <div key={x.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <div className="text-[9.5px] font-bold tabular-nums text-muted-foreground">
                      {x.val > 0 ? fmtRpShort(x.val) : ""}
                    </div>
                    <div
                      className="w-full max-w-[34px] rounded-t-md transition-all"
                      style={{
                        height: `${h}%`,
                        background: isToday ? "var(--primary)" : "color-mix(in srgb, var(--primary) 38%, white)",
                      }}
                    />
                    <div className="text-center leading-tight">
                      <div className="text-[12px] font-extrabold tabular-nums">{x.num}</div>
                      <div className="text-[9.5px] font-semibold text-muted-foreground">{x.dow}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <SectionCard title="Produk Terlaris" icon="trophy">
            {d.top.length === 0 ? (
              <div className="p-6 text-[13px] text-muted-foreground">
                Belum ada penjualan pada periode ini.
              </div>
            ) : (
              <div className="py-1.5">
                {d.top.map((p, i) => (
                  <div key={p.name} className="px-[18px] py-2.5">
                    <div className="mb-1.5 flex items-center gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[11px] font-extrabold text-secondary-foreground">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold">
                        {p.name}
                      </span>
                      <span className="text-[12px] tabular-nums text-muted-foreground">
                        {p.qty} {p.unit}
                      </span>
                      <span className="min-w-[74px] text-right text-[13px] font-extrabold tabular-nums">
                        {fmtRp(p.rev)}
                      </span>
                    </div>
                    <div className="ml-[30px] h-1.5 overflow-hidden rounded bg-background">
                      <div
                        className="h-full rounded bg-primary"
                        style={{ width: `${Math.max(5, Math.round((p.rev / d.maxRev) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Pembayaran Belum Lunas">
            {d.unpaid.length === 0 ? (
              <div className="p-5 text-[13px] text-muted-foreground">
                Semua order sudah lunas. 🎉
              </div>
            ) : (
              d.unpaid.map((o) => (
                <OrderListItem key={o.id} order={o} onClick={() => navigate(`/orders/${o.id}`)} />
              ))
            )}
          </SectionCard>

          <SectionCard title="Laporan Masalah">
            {issues.length === 0 ? (
              <div className="p-5 text-[13px] text-muted-foreground">
                Tidak ada masalah tercatat.
              </div>
            ) : (
              issues.map((g, i) => (
                <div key={i} className="border-b px-[18px] py-3 last:border-0">
                  <div className="text-[13px] font-bold text-[#b91c1c]">{g.type}</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">{g.where}</div>
                </div>
              ))
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function RKpi({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub: string
  color?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-[18px] shadow-sm">
      <div className="text-[12.5px] font-semibold text-muted-foreground">{label}</div>
      <div className={cn("mt-2 text-[24px] font-extrabold tabular-nums", color)}>
        {value}
      </div>
      <div className="mt-0.5 text-[12px] text-muted-foreground">{sub}</div>
    </div>
  )
}
