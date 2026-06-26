import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { cn } from "@/lib/utils"
import { dateLabel, parseRefs, waLink } from "@/lib/format"
import {
  DESIGN_FLOW, ISSUE_TYPES, PROD_FLOW, SHORT_STATUS, STATUSES, nextStatus,
} from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/StatusBadge"
import { EmptyState } from "@/components/common"
import { Icon } from "@/components/Icon"

const inputCls =
  "w-full rounded-[10px] border border-input bg-background px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"

export function TaskDetail() {
  const { orderId, itemId } = useParams()
  const navigate = useNavigate()
  const { orders, role, staff, staffName, advanceItem, assignOperator, addIssue } = useApp()
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0])
  const [issueNote, setIssueNote] = useState("")

  const order = orders.find((o) => o.id === orderId)
  const item = order?.items.find((x) => x.id === itemId)

  if (!order || !item) {
    return (
      <div>
        <Back onClick={() => navigate("/tasks")} />
        <EmptyState title="Tugas tidak ditemukan" />
      </div>
    )
  }

  const isDesigner = role === "designer"
  const flow = isDesigner ? DESIGN_FLOW : PROD_FLOW
  const canAdvance = !!nextStatus(item.status, flow)
  const next = nextStatus(item.status, flow)
  const operators = staff.filter((s) => s.type === "production")
  const refs = parseRefs(item.refs)
  const hasContact = !!(order.contact && /\d/.test(order.contact))

  const nm = order.customerName
  const pr = item.productName
  const tAcc = `Halo ${nm} 🙏\n\nDesain untuk pesanan *${order.id} — ${pr}* sudah siap. Mohon dicek & dikonfirmasi:\n✅ ACC (setuju), atau\n✏️ Revisi (mohon sebutkan bagian yang diubah)\n\nTerima kasih,\nSahabat Printing.`
  const tRev = `Halo ${nm}, untuk pesanan *${order.id} — ${pr}* boleh dibantu info bagian mana yang ingin direvisi? Akan segera kami kerjakan. Terima kasih 🙏\nSahabat Printing.`
  const tReady = `Halo ${nm}, kabar baik! Pesanan *${order.id} — ${pr}* sudah selesai dan siap diambil di toko. Ditunggu ya 🙏\nSahabat Printing.`

  const cur = STATUSES.indexOf(item.status)

  return (
    <div>
      <Back onClick={() => navigate("/tasks")} />

      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="font-mono text-[12.5px] font-bold text-primary">{order.id}</div>
            <h2 className="mt-1 text-[22px] font-extrabold">{item.productName}</h2>
            <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Icon name="user" className="size-3.5" />
                {order.customerName}
              </span>
              <span className="flex items-center gap-1.5 tabular-nums">
                <Icon name="hash" className="size-3.5" />
                {item.qty} {item.unit}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="calendar" className="size-3.5" />
                Deadline {dateLabel(order.deadline)}
              </span>
            </div>

            {hasContact && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-3 flex items-center justify-between gap-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#128c3e]/10 text-[#128c3e]">
                      <Icon name="message-circle" className="size-[17px]" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-muted-foreground">
                        Hubungi pelanggan untuk approval
                      </div>
                      <div className="text-[13.5px] font-bold tabular-nums">
                        {order.contact}
                      </div>
                    </div>
                  </div>
                  <a
                    href={waLink(order.contact, "")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#128c3e] px-3.5 py-2.5 text-[12.5px] font-bold text-white hover:bg-[#0e7536]"
                  >
                    <Icon name="message-circle" className="size-[15px]" />
                    Chat WA
                  </a>
                </div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Template chat — sekali klik
                </div>
                <div className="flex flex-wrap gap-2">
                  <WaTemplate href={waLink(order.contact, tAcc)} icon="check-circle-2" className="border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]" label="Minta ACC desain" />
                  <WaTemplate href={waLink(order.contact, tRev)} icon="pencil-line" className="border-[#fde68a] bg-[#fffbeb] text-[#b45309]" label="Tanya revisi" />
                  <WaTemplate href={waLink(order.contact, tReady)} icon="package-check" className="border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]" label="Siap diambil" />
                </div>
              </div>
            )}
          </div>

          {/* Brief */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold">
              <Icon name="file-text" className="size-[15px] text-primary" />
              Brief Project
            </h3>
            {item.brief?.trim() ? (
              <div className="rounded-xl border bg-background px-3.5 py-3.5 text-[14px] leading-relaxed">
                {item.brief}
              </div>
            ) : (
              <div className="text-[13px] text-muted-foreground">
                Belum ada brief. Hubungi admin untuk detail.
              </div>
            )}
            {refs.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground">
                  <Icon name="paperclip" className="size-3 text-primary" />
                  File Referensi Pelanggan
                </div>
                <div className="flex flex-wrap gap-2">
                  {refs.map((r, i) => (
                    <a
                      key={i}
                      href={r.href ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[9px] border bg-secondary px-3 py-1.5 text-[13px] font-semibold text-primary"
                    >
                      <Icon name="file-image" className="size-3.5" />
                      {r.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Masalah */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-1.5 text-[14px] font-extrabold">
              <Icon name="triangle-alert" className="size-[15px] text-destructive" />
              Catatan Masalah
            </h3>
            {item.issues.length > 0 && (
              <div className="mb-3 flex flex-col gap-1.5">
                {item.issues.map((iss, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[13px] text-[#b91c1c]"
                  >
                    <Icon name="triangle-alert" className="mt-0.5 size-3.5" />
                    <span>
                      <b>{iss.type}</b>
                      {iss.note ? ` — ${iss.note}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              <select
                className={inputCls + " cursor-pointer"}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                {ISSUE_TYPES.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              <textarea
                className={inputCls + " min-h-[64px] resize-y leading-relaxed"}
                value={issueNote}
                onChange={(e) => setIssueNote(e.target.value)}
                placeholder="Detail masalah (opsional)…"
                rows={2}
              />
              <Button
                variant="outline"
                className="self-start border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fee2e2]"
                onClick={() => {
                  addIssue(order.id, item.id, { type: issueType, note: issueNote.trim() })
                  setIssueNote("")
                }}
              >
                <Icon name="plus" className="size-[15px]" />
                Catat Masalah
              </Button>
            </div>
          </div>
        </div>

        {/* Panel status */}
        <div className="lg:sticky lg:top-[78px]">
          <div className="rounded-xl border bg-card p-[18px] shadow-sm">
            <h3 className="mb-3 text-[15px] font-extrabold">Update Status</h3>
            <div className="mb-3.5 flex items-center gap-2.5">
              <span className="text-[12px] font-semibold text-muted-foreground">
                Saat ini
              </span>
              <StatusBadge status={item.status} className="px-3 py-1.5 text-[12.5px]" />
            </div>

            {canAdvance ? (
              <>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => advanceItem(order.id, item.id, flow)}
                >
                  Tandai Selesai Tahap Ini
                  <Icon name="arrow-right" className="size-[18px]" />
                </Button>
                <div className="mt-1.5 text-center text-[12px] text-muted-foreground">
                  Berikutnya: <b className="text-foreground">{next}</b>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-3 text-center text-[13px] font-bold text-secondary-foreground">
                <Icon name="check-circle-2" className="size-[17px]" />
                {isDesigner ? "Desain selesai — sudah diserahkan ke produksi" : "Pesanan selesai"}
              </div>
            )}

            {isDesigner && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-1 flex items-center gap-1.5 text-[13px] font-extrabold">
                  <Icon name="user-cog" className="size-4 text-primary" />
                  Assign Operator Produksi
                </div>
                <p className="mb-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  Tentukan operator yang mencetak setelah desain di-ACC pelanggan.
                </p>
                <select
                  className={inputCls + " cursor-pointer bg-card"}
                  value={item.operatorId}
                  onChange={(e) => assignOperator(order.id, item.id, e.target.value)}
                >
                  <option value="">— Belum di-assign —</option>
                  {operators.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} · {s.job}</option>
                  ))}
                </select>
                {item.operatorId && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-[9px] bg-secondary px-3 py-2.5 text-[12.5px] font-bold text-secondary-foreground">
                    <Icon name="check-circle-2" className="size-3.5" />
                    Produksi: {staffName(item.operatorId)}
                  </div>
                )}
              </div>
            )}

            <div className="mb-3 mt-5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Alur Tahap
            </div>
            <div className="flex items-start gap-1.5">
              {flow.map((name, i) => {
                const idx = STATUSES.indexOf(name)
                const isCur = name === item.status
                const done = idx < cur
                const first = i === 0
                const last = i === flow.length - 1
                return (
                  <div key={name} className="flex min-w-0 flex-1 flex-col items-center">
                    <div className="relative flex h-[22px] w-full items-center justify-center">
                      {!first && (
                        <span
                          className="absolute right-1/2 left-0 top-1/2 h-0.5 -translate-y-1/2"
                          style={{ background: idx <= cur ? "var(--primary)" : "var(--border)" }}
                        />
                      )}
                      {!last && (
                        <span
                          className="absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2"
                          style={{ background: done ? "var(--primary)" : "var(--border)" }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-[1] flex size-[22px] items-center justify-center rounded-full text-[11px]",
                          isCur
                            ? "bg-primary text-primary-foreground ring-4 ring-secondary"
                            : done
                              ? "bg-primary text-primary-foreground"
                              : "border-2 border-border bg-card text-muted-foreground",
                        )}
                      >
                        {done && <Icon name="check" className="size-3" />}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "mt-1.5 text-center text-[9.5px] leading-tight",
                        isCur
                          ? "font-extrabold text-primary"
                          : done
                            ? "font-semibold text-foreground"
                            : "font-semibold text-muted-foreground",
                      )}
                    >
                      {SHORT_STATUS[name] ?? name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-3.5 flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-foreground"
    >
      <Icon name="arrow-left" className="size-4" />
      Kembali ke Tugas Saya
    </button>
  )
}

function WaTemplate({
  href,
  icon,
  label,
  className,
}: {
  href: string
  icon: string
  label: string
  className: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-2 text-[12.5px] font-bold",
        className,
      )}
    >
      <Icon name={icon} className="size-[15px]" />
      {label}
    </a>
  )
}
