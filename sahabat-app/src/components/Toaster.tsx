import { useApp } from "@/store/app-store"
import { Icon } from "./Icon"

export function Toaster() {
  const { toastMsg } = useApp()
  if (!toastMsg) return null
  return (
    <div className="no-print pointer-events-none fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 items-center gap-2.5 rounded-xl bg-[#1c1917] px-5 py-3 text-[13.5px] font-semibold text-white shadow-2xl">
      <Icon name="check-circle-2" className="size-[17px] text-[#4ade80]" />
      {toastMsg}
    </div>
  )
}
