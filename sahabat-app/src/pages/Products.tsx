import { useEffect, useMemo, useState } from "react"
import { useApp } from "@/store/app-store"
import { fmtRp } from "@/lib/format"
import { PageHead, EmptyState } from "@/components/common"
import { Input } from "@/components/ui/input"
import { FilterSelect, Pagination, paginate } from "@/components/datatable"
import { Icon } from "@/components/Icon"

const SORT_OPTIONS = [
  { value: "name", label: "Urutkan: Nama A–Z" },
  { value: "price-asc", label: "Urutkan: Harga termurah" },
  { value: "price-desc", label: "Urutkan: Harga termahal" },
]

export function Products() {
  const { products, role, setProductBase } = useApp()
  const canEdit = role === "owner" || role === "admin"
  const [q, setQ] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [q, sortBy])

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    const base = query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : products
    const sorted = [...base]
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === "price-asc") sorted.sort((a, b) => a.base - b.base)
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.base - a.base)
    return sorted
  }, [products, q, sortBy])

  const pg = paginate(list, page)

  return (
    <div>
      <PageHead crumb="Master Data" title="Produk & Harga Dasar" />

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_240px]">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk…"
            className="h-11 rounded-xl pl-10"
          />
        </div>
        <FilterSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} icon="tag" />
      </div>

      {list.length === 0 ? (
        <EmptyState icon="tag" title="Produk tidak ditemukan" desc="Coba kata kunci lain." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="hidden border-b px-[18px] py-3 text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground sm:flex">
            <span className="flex-1">Produk</span>
            <span className="w-24">Satuan</span>
            <span className="w-44 text-right">Harga Dasar</span>
            <span className="w-20 text-center">Status</span>
          </div>

          {pg.slice.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 border-b px-4 py-3 sm:px-[18px]"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold">{p.name}</div>
                <div className="text-[12px] text-muted-foreground sm:hidden">/ {p.unit}</div>
              </div>
              <span className="hidden w-24 text-[13px] text-muted-foreground sm:inline">
                / {p.unit}
              </span>
              <div className="flex w-auto justify-end sm:w-44">
                {canEdit ? (
                  <span className="inline-flex items-center gap-1 rounded-[9px] border bg-background px-2 py-1.5">
                    <span className="text-[12px] text-muted-foreground">Rp</span>
                    <input
                      value={Number(p.base).toLocaleString("id-ID")}
                      onChange={(e) =>
                        setProductBase(p.id, Number(e.target.value.replace(/[^0-9]/g, "")) || 0)
                      }
                      inputMode="numeric"
                      className="w-[78px] min-w-0 border-0 bg-transparent text-right text-[13.5px] font-bold tabular-nums outline-none"
                    />
                  </span>
                ) : (
                  <span className="text-[14px] font-bold tabular-nums">{fmtRp(p.base)}</span>
                )}
              </div>
              <span className="hidden w-20 justify-center sm:flex">
                <span className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-0.5 text-[11.5px] font-bold text-[#16a34a]">
                  Aktif
                </span>
              </span>
            </div>
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
