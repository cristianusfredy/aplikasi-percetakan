import { calc, stageOf } from "@/lib/calc"
import { dateLabel, fmtRp } from "@/lib/format"
import type { Order } from "@/lib/types"
import { StatusBadge, PayBadge } from "./StatusBadge"

export function OrderListItem({
  order,
  onClick,
}: {
  order: Order
  onClick: () => void
}) {
  const c = calc(order)
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col gap-2.5 border-b px-4 py-3.5 text-left last:border-0 hover:bg-secondary/50 sm:flex-row sm:items-center sm:gap-4 sm:px-[18px]"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-bold">{order.customerName}</div>
        <div className="mt-0.5 font-mono text-[11.5px] text-muted-foreground">
          {order.id} · {order.items.length} item · {dateLabel(order.deadline)}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <StatusBadge status={stageOf(order)} />
        <span className="w-[92px] text-right text-[14px] font-extrabold tabular-nums sm:w-auto">
          {fmtRp(c.total)}
        </span>
        <PayBadge pay={c.pay} />
      </div>
    </button>
  )
}
