import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { cn } from "@/lib/utils"
import { calc, stageOf } from "@/lib/calc"
import { STATUSES } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { PageHead, EmptyState } from "@/components/common"
import { OrderListItem } from "@/components/OrderListItem"
import { FilterSelect, Pagination, paginate } from "@/components/datatable"
import { Icon } from "@/components/Icon"
import type { Order } from "@/lib/types"

const isDone = (o: Order) =>
  o.items.length > 0 &&
  o.items.every((it) => it.status === "Selesai" || it.status === "Dibatalkan")

const STATUS_OPTIONS = [
  { value: "all", label: "Semua status" },
  ...STATUSES.map((s) => ({ value: s, label: s })),
]
const PAY_OPTIONS = [
  { value: "all", label: "Semua pembayaran" },
  { value: "paid", label: "Lunas" },
  { value: "partial", label: "DP / Sebagian" },
  { value: "unpaid", label: "Belum Bayar" },
]
const SORT_OPTIONS = [
  { value: "newest", label: "Urutkan: Terbaru" },
  { value: "deadline", label: "Urutkan: Deadline terdekat" },
  { value: "value", label: "Urutkan: Nilai terbesar" },
]

export function Orders() {
  const { orders, role } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState("")
  const [scope, setScope] = useState<"active" | "done">("active")
  const [statusFilter, setStatusFilter] = useState("all")
  const [payFilter, setPayFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const canCreate = role === "admin" || role === "owner"

  useEffect(() => setPage(1), [q, scope, statusFilter, payFilter, sortBy])

  const { activeCount, doneCount, list } = useMemo(() => {
    const query = q.trim().toLowerCase()
    let base = query
      ? orders.filter(
          (o) =>
            o.customerName.toLowerCase().includes(query) ||
            o.id.toLowerCase().includes(query),
        )
      : orders
    const activeCount = base.filter((o) => !isDone(o)).length
    const doneCount = base.filter((o) => isDone(o)).length

    base = base.filter((o) => (scope === "done" ? isDone(o) : !isDone(o)))
    if (statusFilter !== "all") base = base.filter((o) => stageOf(o) === statusFilter)
    if (payFilter !== "all") base = base.filter((o) => calc(o).pay === payFilter)

    const sorted = [...base]
    if (sortBy === "deadline")
      sorted.sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""))
    else if (sortBy === "value") sorted.sort((a, b) => calc(b).total - calc(a).total)

    return { activeCount, doneCount, list: sorted }
  }, [orders, q, scope, statusFilter, payFilter, sortBy])

  const pg = paginate(list, page)

  return (
    <div>
      <PageHead crumb="Operasional" title="Daftar Pesanan" />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari pelanggan atau nomor order…"
            className="h-11 rounded-xl pl-10"
          />
        </div>
        {canCreate && (
          <button
            onClick={() => navigate("/create")}
            className="flex h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-[13.5px] font-bold text-primary-foreground shadow-sm hover:bg-primary-strong"
          >
            <Icon name="plus" className="size-[17px]" />
            Buat Order
          </button>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-xl border bg-card p-1">
          {([
            ["active", activeCount],
            ["done", doneCount],
          ] as const).map(([sc, count]) => {
            const on = scope === sc
            return (
              <button
                key={sc}
                onClick={() => setScope(sc)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-bold transition-colors",
                  on ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {sc === "active" ? "Berjalan" : "Selesai"}
                <span
                  className={cn(
                    "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold",
                    on ? "bg-white/25 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
        <FilterSelect value={payFilter} onChange={setPayFilter} options={PAY_OPTIONS} icon="wallet" />
        <FilterSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} icon="arrow-right" />
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="clipboard-list"
          title={scope === "done" ? "Belum ada pesanan selesai" : "Tidak ada pesanan cocok"}
          desc={
            q || statusFilter !== "all" || payFilter !== "all"
              ? "Coba ubah kata kunci atau filter."
              : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {pg.slice.map((o) => (
            <OrderListItem
              key={o.id}
              order={o}
              onClick={() => navigate(`/orders/${o.id}`)}
            />
          ))}
          <Pagination
            page={pg.current}
            pageCount={pg.pageCount}
            total={pg.total}
            start={pg.start}
            count={pg.slice.length}
            onPage={setPage}
          />
        </div>
      )}
    </div>
  )
}
