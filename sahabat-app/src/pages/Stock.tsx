import { useEffect, useMemo, useState } from "react"
import { useApp, isStaffRole } from "@/store/app-store"
import { PageHead, EmptyState } from "@/components/common"
import { Input } from "@/components/ui/input"
import { FilterSelect, Pagination, paginate } from "@/components/datatable"
import { Icon } from "@/components/Icon"

const STATUS_OPTIONS = [
  { value: "all", label: "Semua status" },
  { value: "low", label: "Menipis" },
  { value: "ok", label: "Aman" },
]
const SORT_OPTIONS = [
  { value: "name", label: "Urutkan: Nama A–Z" },
  { value: "low-first", label: "Urutkan: Stok menipis dulu" },
  { value: "qty-asc", label: "Urutkan: Sisa paling sedikit" },
]

export function Stock() {
  const { stock, role, adjustStock, addLowNote } = useApp()
  const canEdit = role === "owner" || role === "admin"
  const canNote = isStaffRole(role)
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [q, statusFilter, sortBy])

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    let base = query ? stock.filter((m) => m.name.toLowerCase().includes(query)) : stock
    if (statusFilter === "low") base = base.filter((m) => m.qty <= m.min)
    else if (statusFilter === "ok") base = base.filter((m) => m.qty > m.min)
    const sorted = [...base]
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === "qty-asc") sorted.sort((a, b) => a.qty - b.qty)
    else if (sortBy === "low-first")
      sorted.sort(
        (a, b) => Number(b.qty <= b.min) - Number(a.qty <= a.min) || a.qty - b.qty,
      )
    return sorted
  }, [stock, q, statusFilter, sortBy])

  const pg = paginate(list, page)

  return (
    <div>
      <PageHead crumb="Master Data" title="Stok Bahan" />

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_180px_220px]">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari bahan…"
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon="boxes" />
        <FilterSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
      </div>

      {list.length === 0 ? (
        <EmptyState icon="boxes" title="Bahan tidak ditemukan" desc="Coba ubah kata kunci atau filter." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {pg.slice.map((m) => {
            const low = m.qty <= m.min
            return (
              <div
                key={m.id}
                className="flex flex-wrap items-center gap-3 border-b px-4 py-3.5 sm:px-[18px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-bold">{m.name}</div>
                  {m.note?.trim() && (
                    <div className="mt-0.5 text-[12px] text-muted-foreground">{m.note}</div>
                  )}
                  {canNote && (
                    <button
                      onClick={() => addLowNote(m.id)}
                      className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-semibold text-primary"
                    >
                      <Icon name="message-square-plus" className="size-3" />
                      Tandai hampir habis
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => adjustStock(m.id, -1)}
                      aria-label="Kurangi stok"
                      className="flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon name="minus" className="size-3.5" />
                    </button>
                  )}
                  <span className="min-w-[72px] text-center text-[14px] font-bold tabular-nums">
                    {m.qty} {m.unit}
                  </span>
                  {canEdit && (
                    <button
                      onClick={() => adjustStock(m.id, 1)}
                      aria-label="Tambah stok"
                      className="flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon name="plus" className="size-3.5" />
                    </button>
                  )}
                </div>

                <span
                  className={
                    "rounded-md border px-2.5 py-1 text-[11px] font-bold " +
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
