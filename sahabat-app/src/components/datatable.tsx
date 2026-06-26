import { cn } from "@/lib/utils"
import { Icon } from "./Icon"

export const PAGE_SIZE = 10

export interface PageInfo<T> {
  slice: T[]
  pageCount: number
  current: number
  start: number
  total: number
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE): PageInfo<T> {
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / size))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * size
  return { slice: items.slice(start, start + size), pageCount, current, start, total }
}

function pageList(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const out: (number | "…")[] = [1]
  const left = Math.max(2, page - 1)
  const right = Math.min(pageCount - 1, page + 1)
  if (left > 2) out.push("…")
  for (let i = left; i <= right; i++) out.push(i)
  if (right < pageCount - 1) out.push("…")
  out.push(pageCount)
  return out
}

export function Pagination({
  page,
  pageCount,
  total,
  start,
  count,
  onPage,
}: {
  page: number
  pageCount: number
  total: number
  start: number
  count: number
  onPage: (p: number) => void
}) {
  if (total === 0) return null
  const from = start + 1
  const to = start + count
  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-[18px]">
      <span className="text-[12.5px] text-muted-foreground">
        Menampilkan{" "}
        <b className="text-foreground">
          {from}–{to}
        </b>{" "}
        dari {total}
      </span>
      {pageCount > 1 && (
        <div className="flex items-center gap-1">
          <PagerBtn
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            label="Halaman sebelumnya"
          >
            <Icon name="chevron-left" className="size-4" />
          </PagerBtn>
          {pageList(page, pageCount).map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className="px-1 text-[13px] text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p)}
                className={cn(
                  "size-8 rounded-md text-[13px] font-bold transition-colors",
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                {p}
              </button>
            ),
          )}
          <PagerBtn
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
            label="Halaman berikutnya"
          >
            <Icon name="chevron-right" className="size-4" />
          </PagerBtn>
        </div>
      )}
    </div>
  )
}

function PagerBtn({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

export interface FilterOption {
  value: string
  label: string
}

export function FilterSelect({
  value,
  onChange,
  options,
  icon = "list-filter",
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: FilterOption[]
  icon?: string
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <Icon
        name={icon}
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-xl border bg-card pl-9 pr-9 text-[13px] font-semibold outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
