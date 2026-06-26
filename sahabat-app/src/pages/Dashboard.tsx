import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { calc, stageOf } from "@/lib/calc"
import { fmtRp, dateLabel } from "@/lib/format"
import { TODAY } from "@/lib/constants"
import { PageHead, KpiCard, SectionCard } from "@/components/common"
import { StatusBadge, PayBadge } from "@/components/StatusBadge"
import { Icon } from "@/components/Icon"

export function Dashboard() {
  const { orders, stock, allIssues, currentUserLabel } = useApp()
  const navigate = useNavigate()

  const data = useMemo(() => {
    const monthOrders = orders.filter(
      (o) => (o.createdAt || "").slice(0, 7) === TODAY.slice(0, 7),
    )
    const active = orders.filter(
      (o) => !o.items.every((it) => it.status === "Selesai" || it.status === "Dibatalkan"),
    )
    const unpaid = orders.filter((o) => calc(o).pay !== "paid")
    const outstanding = unpaid.reduce((a, o) => a + calc(o).remaining, 0)
    const revenueMonth = monthOrders.reduce((a, o) => a + calc(o).dp, 0)
    return { active, unpaid, outstanding, revenueMonth, issues: allIssues() }
  }, [orders, allIssues])

  const recent = orders.slice(0, 5)

  return (
    <div>
      <PageHead crumb="Ringkasan" title={`Halo, ${currentUserLabel()} 👋`} />

      <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <KpiCard
          label="Pesanan Aktif"
          value={String(data.active.length)}
          sub={`dari ${orders.length} total order`}
          icon="clipboard-list"
          iconClass="bg-[#e4f5ea] text-[#15803d]"
        />
        <KpiCard
          label="Belum Lunas"
          value={String(data.unpaid.length)}
          sub={`${fmtRp(data.outstanding)} outstanding`}
          icon="wallet"
          iconClass="bg-[#fef2f2] text-[#dc2626]"
        />
        <KpiCard
          label="Pendapatan Bulan Ini"
          value={fmtRp(data.revenueMonth)}
          sub="total DP & pelunasan masuk"
          icon="trending-up"
          iconClass="bg-[#f0fdf4] text-[#16a34a]"
        />
        <KpiCard
          label="Masalah Produksi"
          value={String(data.issues.length)}
          sub="perlu tindak lanjut"
          icon="triangle-alert"
          iconClass="bg-[#fffbeb] text-[#d97706]"
        />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Pesanan Terbaru"
          action={
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1 text-[12.5px] font-bold text-primary"
            >
              Semua <Icon name="arrow-right" className="size-3.5" />
            </button>
          }
        >
          {recent.map((o) => {
            const c = calc(o)
            return (
              <button
                key={o.id}
                onClick={() => navigate(`/orders/${o.id}`)}
                className="flex w-full items-center gap-3 border-b px-4 py-3 text-left last:border-0 hover:bg-secondary/50 sm:px-[18px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-muted-foreground">
                      {o.id}
                    </span>
                    <span className="truncate text-[14px] font-bold">
                      {o.customerName}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">
                    {o.items.length} item · {dateLabel(o.deadline)}
                  </div>
                </div>
                <StatusBadge status={stageOf(o)} className="hidden sm:inline-flex" />
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[14px] font-extrabold tabular-nums">
                    {fmtRp(c.total)}
                  </span>
                  <PayBadge pay={c.pay} className="px-2 py-0.5 text-[10.5px]" />
                </div>
              </button>
            )
          })}
        </SectionCard>

        <div className="flex flex-col gap-4">
          <SectionCard title="Masalah Produksi/Desain" icon="triangle-alert">
            {data.issues.length === 0 ? (
              <div className="p-[18px] text-[13px] text-muted-foreground">
                Tidak ada masalah tercatat. 🎉
              </div>
            ) : (
              data.issues.map((g, i) => (
                <div key={i} className="border-b px-4 py-3 last:border-0 sm:px-[18px]">
                  <div className="text-[13px] font-bold text-[#b91c1c]">{g.type}</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">
                    {g.where}
                  </div>
                </div>
              ))
            )}
          </SectionCard>

          <SectionCard title="Stok Bahan" icon="boxes">
            {stock.map((m) => {
              const low = m.qty <= m.min
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-2.5 border-b px-4 py-2.5 last:border-0 sm:px-[18px]"
                >
                  <span className="flex-1 text-[13px] font-semibold">{m.name}</span>
                  <span className="text-[12.5px] tabular-nums text-muted-foreground">
                    {m.qty} {m.unit}
                  </span>
                  <span
                    className={
                      "rounded-md border px-2 py-0.5 text-[11px] font-bold " +
                      (low
                        ? "border-[#fde68a] bg-[#fffbeb] text-[#b45309]"
                        : "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]")
                    }
                  >
                    {low ? "Menipis" : "Aman"}
                  </span>
                </div>
              )
            })}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
