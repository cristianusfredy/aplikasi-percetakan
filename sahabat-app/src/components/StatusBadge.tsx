import { cn } from "@/lib/utils"
import { STATUS_BADGE } from "@/lib/constants"
import { payMeta } from "@/lib/calc"
import type { OrderStatus, PayStatus } from "@/lib/types"

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11.5px] font-bold leading-none",
        STATUS_BADGE[status],
        className,
      )}
    >
      {status}
    </span>
  )
}

export function PayBadge({
  pay,
  className,
}: {
  pay: PayStatus
  className?: string
}) {
  const m = payMeta(pay)
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-bold leading-none",
        m.badgeClass,
        className,
      )}
    >
      {m.label}
    </span>
  )
}
