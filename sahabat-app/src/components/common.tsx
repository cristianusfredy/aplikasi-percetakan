import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "./Icon"

export function KpiCard({
  label,
  value,
  sub,
  icon,
  iconClass,
}: {
  label: string
  value: string
  sub?: string
  icon: string
  iconClass?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-[18px]">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-[9px]",
            iconClass ?? "bg-secondary text-primary",
          )}
        >
          <Icon name={icon} className="size-4" />
        </span>
      </div>
      <div className="text-[26px] font-extrabold tracking-tight tabular-nums">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[12.5px] text-muted-foreground">{sub}</div>}
    </div>
  )
}

export function EmptyState({
  icon = "party-popper",
  title,
  desc,
  className,
}: {
  icon?: string
  title: string
  desc?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-10 text-center text-muted-foreground",
        className,
      )}
    >
      <Icon name={icon} className="mx-auto size-7 text-primary" />
      <div className="mt-2.5 text-[15px] font-bold text-foreground">{title}</div>
      {desc && <div className="mt-1 text-[13px]">{desc}</div>}
    </div>
  )
}

export function SectionCard({
  title,
  icon,
  action,
  children,
  bodyClassName,
}: {
  title?: string
  icon?: string
  action?: ReactNode
  children: ReactNode
  bodyClassName?: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {title && (
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3.5 sm:px-[18px]">
          <h3 className="flex items-center gap-2 text-[15px] font-extrabold">
            {icon && <Icon name={icon} className="size-4 text-primary" />}
            {title}
          </h3>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

export function PageHead({
  crumb,
  title,
  children,
}: {
  crumb?: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        {crumb && (
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            {crumb}
          </div>
        )}
        <h2 className="truncate text-xl font-extrabold tracking-tight sm:text-[22px]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}
