import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icon } from "./Icon"

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: "default" | "danger"
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [opts, setOpts] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((v: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((o) => {
    setOpts(o)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const settle = (v: boolean) => {
    setOpen(false)
    resolver.current?.(v)
    resolver.current = null
  }

  const danger = opts?.tone === "danger"

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={open} onOpenChange={(o) => !o && settle(false)}>
        <DialogContent className="max-w-[404px]">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-[11px]",
                  danger
                    ? "bg-[#fef2f2] text-[#dc2626]"
                    : "bg-secondary text-primary",
                )}
              >
                <Icon name={danger ? "triangle-alert" : "check-circle-2"} className="size-[22px]" />
              </span>
              <DialogTitle className="text-[17px]">{opts?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-[13.5px] leading-relaxed">
              {opts?.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => settle(false)}>
              {opts?.cancelLabel ?? "Batal"}
            </Button>
            <Button
              variant={danger ? "destructive" : "default"}
              onClick={() => settle(true)}
            >
              {opts?.confirmLabel ?? "Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider")
  return ctx
}
