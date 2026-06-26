import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { useConfirm } from "@/components/confirm"
import { calc, itemSubtotal } from "@/lib/calc"
import { dateLabel, fmtRp, parseRefs } from "@/lib/format"
import { MAIN_FLOW, nextStatus } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge, PayBadge } from "@/components/StatusBadge"
import { Icon } from "@/components/Icon"
import { EmptyState } from "@/components/common"
import { Nota } from "@/components/Nota"

export function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    orders, role, staffName, advanceItem, cancelItem, addPayment, markPaid,
  } = useApp()
  const confirm = useConfirm()
  const [payRaw, setPayRaw] = useState("")
  const [showNota, setShowNota] = useState(false)

  const order = orders.find((o) => o.id === id)
  const c = useMemo(() => (order ? calc(order) : null), [order])
  const canManage = role === "owner" || role === "admin"

  if (!order || !c) {
    return (
      <div>
        <BackBtn onClick={() => navigate("/orders")} label="Kembali ke daftar" />
        <EmptyState icon="clipboard-list" title="Pesanan tidak ditemukan" />
      </div>
    )
  }

  const onAdd = () => {
    const amt = Number(payRaw) || 0
    if (!amt) return
    addPayment(order.id, Math.min(amt, c.remaining || amt))
    setPayRaw("")
  }
  const onMarkPaid = async () => {
    const ok = await confirm({
      title: "Tandai lunas?",
      message: `Pembayaran akan dicatat penuh sebesar ${fmtRp(c.remaining)} (sisa tagihan). Pastikan pembayaran sudah benar-benar diterima.`,
      confirmLabel: "Ya, Tandai Lunas",
    })
    if (ok) markPaid(order.id, c.total)
  }
  const onCancel = async (itemId: string) => {
    const ok = await confirm({
      title: "Batalkan item ini?",
      message:
        'Status item akan diubah menjadi "Dibatalkan" dan tidak dapat dikembalikan dari layar ini.',
      confirmLabel: "Ya, Batalkan",
      tone: "danger",
    })
    if (ok) cancelItem(order.id, itemId)
  }

  return (
    <div>
      <BackBtn onClick={() => navigate("/orders")} label="Kembali ke daftar" />

      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* Kolom kiri */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[12.5px] font-bold text-primary">
                  {order.id}
                </div>
                <h2 className="mt-1 text-[22px] font-extrabold">{order.customerName}</h2>
                <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Icon name="phone" className="size-3.5" />
                    {order.contact}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="calendar" className="size-3.5" />
                    Deadline {dateLabel(order.deadline)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="clock" className="size-3.5" />
                    Dibuat {dateLabel(order.createdAt)}
                  </span>
                </div>
              </div>
              <PayBadge pay={c.pay} className="px-3 py-1.5 text-[12px]" />
            </div>
            {order.notes?.trim() && (
              <div className="mt-3.5 rounded-xl border bg-background px-3.5 py-3 text-[13px]">
                <span className="font-bold text-muted-foreground">Catatan: </span>
                {order.notes}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b bg-secondary px-[18px] py-3.5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-secondary-foreground">
                <Icon name="layers" className="size-4 text-primary" />
                Item Pesanan
              </h3>
              <span className="text-[12.5px] text-secondary-foreground/75">
                {order.items.length} item
              </span>
            </div>
            {order.items.map((it) => {
              const refs = parseRefs(it.refs)
              const canAdvance = !!nextStatus(it.status, MAIN_FLOW)
              const done = it.status === "Selesai" || it.status === "Dibatalkan"
              return (
                <div key={it.id} className="border-b px-[18px] py-4 last:border-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[15px] font-extrabold">{it.productName}</div>
                      <div className="mt-0.5 text-[12.5px] tabular-nums text-muted-foreground">
                        {it.qty} {it.unit} × {fmtRp(it.base)}/{it.unit}
                      </div>
                    </div>
                    <div className="text-[15px] font-extrabold tabular-nums">
                      {fmtRp(itemSubtotal(it.base, it.qty))}
                    </div>
                  </div>

                  {it.brief?.trim() && (
                    <div className="mt-2.5 rounded-lg border bg-background px-3 py-2 text-[12.5px]">
                      <span className="font-bold text-muted-foreground">Brief: </span>
                      {it.brief}
                    </div>
                  )}

                  {refs.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[11.5px] font-bold text-muted-foreground">
                        Referensi:
                      </span>
                      {refs.map((r, i) => (
                        <a
                          key={i}
                          href={r.href ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border bg-secondary px-2.5 py-1 text-[12px] font-semibold text-primary"
                        >
                          <Icon name="paperclip" className="size-3" />
                          {r.label}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#ece6ff] bg-[#f5f3ff] px-2.5 py-1 text-[12px] text-muted-foreground">
                      <Icon name="pen-tool" className="size-3 text-[#7c3aed]" />
                      {staffName(it.designerId)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#cdf3f7] bg-[#ecfeff] px-2.5 py-1 text-[12px] text-muted-foreground">
                      <Icon name="printer" className="size-3 text-[#0891b2]" />
                      {it.operatorId ? staffName(it.operatorId) : "Belum di-assign"}
                    </span>
                    <StatusBadge status={it.status} className="ml-auto" />
                  </div>

                  {canManage && !done && canAdvance && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => advanceItem(order.id, it.id, MAIN_FLOW)}
                      >
                        Tandai Selesai Tahap Ini
                        <Icon name="arrow-right" className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Batalkan item"
                        onClick={() => onCancel(it.id)}
                        className="hover:border-destructive hover:text-destructive"
                      >
                        <Icon name="x" className="size-4" />
                      </Button>
                    </div>
                  )}
                  {canManage && !done && canAdvance && (
                    <div className="mt-1.5 text-[11.5px] text-muted-foreground">
                      Berikutnya: {nextStatus(it.status, MAIN_FLOW)}
                    </div>
                  )}
                  {done && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-2 text-[13px] font-bold text-secondary-foreground">
                      <Icon name="check-circle-2" className="size-4" />
                      {it.status === "Dibatalkan" ? "Item dibatalkan" : "Item selesai"}
                    </div>
                  )}

                  {it.issues.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {it.issues.map((iss, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-2.5 py-2 text-[12px] text-[#b91c1c]"
                        >
                          <Icon name="triangle-alert" className="mt-0.5 size-3" />
                          <span>
                            <b>{iss.type}</b>
                            {iss.note ? ` — ${iss.note}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel pembayaran */}
        <div className="lg:sticky lg:top-[78px]">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b bg-secondary px-[18px] py-3.5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-secondary-foreground">
                <Icon name="wallet" className="size-4 text-primary" />
                Ringkasan Pembayaran
              </h3>
            </div>
            <div className="flex flex-col gap-2.5 p-[18px] text-[13.5px]">
              <Row label="Subtotal" value={fmtRp(c.subtotal)} />
              <Row label="Diskon" value={"−" + fmtRp(order.discount || 0)} valueClass="text-[#dc2626]" />
              <div className="flex justify-between border-t border-dashed pt-2.5 font-extrabold">
                <span>Total</span>
                <span className="tabular-nums">{fmtRp(c.total)}</span>
              </div>
              <Row label="DP / Dibayar" value={fmtRp(c.dp)} />
              <div className="mt-1 flex justify-between rounded-lg bg-secondary px-3 py-2.5 font-extrabold text-secondary-foreground">
                <span>Sisa</span>
                <span className="tabular-nums">{fmtRp(c.remaining)}</span>
              </div>

              <Button variant="outline" className="mt-2 w-full" onClick={() => setShowNota(true)}>
                <Icon name="receipt" className="size-[17px] text-primary" />
                Cetak Nota / Invoice
              </Button>

              {canManage && (
                <div className="mt-2 border-t pt-3.5">
                  <label className="text-[12px] font-bold text-muted-foreground">
                    Catat pembayaran
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      value={payRaw ? Number(payRaw).toLocaleString("id-ID") : ""}
                      onChange={(e) => setPayRaw(e.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder="Jumlah"
                      className="tabular-nums"
                    />
                    <Button onClick={onAdd}>Tambah</Button>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 w-full text-[#16a34a] hover:border-[#16a34a] hover:bg-[#f0fdf4]"
                    onClick={onMarkPaid}
                    disabled={c.pay === "paid"}
                  >
                    Tandai Lunas
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNota && <Nota order={order} onClose={() => setShowNota(false)} />}
    </div>
  )
}

function BackBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="mb-3.5 flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-foreground"
    >
      <Icon name="arrow-left" className="size-4" />
      {label}
    </button>
  )
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={"tabular-nums " + (valueClass ?? "")}>{value}</span>
    </div>
  )
}
