import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { cn } from "@/lib/utils"
import { dateLabel } from "@/lib/format"
import { STATUS_ACCENT } from "@/lib/constants"
import { PageHead, EmptyState } from "@/components/common"
import { StatusBadge } from "@/components/StatusBadge"
import { Input } from "@/components/ui/input"
import { Pagination, paginate } from "@/components/datatable"
import { Icon } from "@/components/Icon"

const DESIGN_FILTERS: [string, string][] = [
  ["all", "Semua"], ["active", "Aktif"], ["Proses Desain", "Proses Desain"],
  ["Menunggu Approval", "Approval"], ["Siap Cetak", "Siap Cetak"],
]
const PROD_FILTERS: [string, string][] = [
  ["all", "Semua"], ["active", "Aktif"], ["Proses Cetak", "Proses Cetak"],
  ["Finishing", "Finishing"], ["Siap Diambil", "Siap Diambil"],
]

export function Tasks() {
  const { role, myTasks } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [filter, q])

  const filters = role === "designer" ? DESIGN_FILTERS : PROD_FILTERS

  const list = useMemo(() => {
    const mine = myTasks()
    const query = q.trim().toLowerCase()
    let base =
      filter === "all"
        ? mine
        : filter === "active"
          ? mine.filter((t) => t.status !== "Selesai" && t.status !== "Dibatalkan")
          : mine.filter((t) => t.status === filter)
    if (query)
      base = base.filter(
        (t) =>
          t.customerName.toLowerCase().includes(query) ||
          t.productName.toLowerCase().includes(query) ||
          t.orderId.toLowerCase().includes(query),
      )
    return base
  }, [myTasks, filter, q])

  const pg = paginate(list, page)

  return (
    <div>
      <PageHead
        crumb="Produksi"
        title={role === "designer" ? "Tugas Desain" : "Tugas Produksi"}
      />

      <div className="mb-3 relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari pelanggan, produk, atau nomor order…"
          className="h-11 rounded-xl pl-10"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map(([value, label]) => {
          const on = filter === value
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-[10px] border px-3.5 py-2 text-[12.5px] font-bold transition-colors",
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground",
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Tidak ada tugas di filter ini"
          desc="Pilih filter lain atau ubah pencarian."
        />
      ) : (
        <>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {pg.slice.map((t) => (
              <button
                key={t.itemId}
                onClick={() => navigate(`/tasks/${t.orderId}/${t.itemId}`)}
                className="rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderLeft: `4px solid ${STATUS_ACCENT[t.status]}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11.5px] text-muted-foreground">
                    {t.orderId}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="mt-1.5 text-[16px] font-extrabold">{t.productName}</div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                  {t.customerName} · {t.qty} {t.unit}
                </div>
                {t.brief?.trim() && (
                  <div className="mt-2.5 rounded-lg border bg-background px-3 py-2 text-[12.5px] leading-relaxed">
                    {t.brief}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Icon name="calendar" className="size-3.5" />
                  {dateLabel(t.deadline)}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border bg-card">
            <Pagination
              page={pg.current}
              pageCount={pg.pageCount}
              total={pg.total}
              start={pg.start}
              count={pg.slice.length}
              onPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
