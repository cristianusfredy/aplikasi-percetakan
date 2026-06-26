import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/store/app-store"
import { areaQty } from "@/lib/calc"
import { fmtRp, refsArr, parseRefs } from "@/lib/format"
import { TODAY } from "@/lib/constants"
import { payMeta } from "@/lib/calc"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/Icon"
import type { DraftItem, Order, OrderItem } from "@/lib/types"

const inputCls =
  "w-full rounded-[10px] border border-input bg-background px-3 py-2.5 text-[13.5px] outline-none focus:border-primary"

function tomorrow(): string {
  const d = new Date(TODAY + "T00:00:00")
  d.setDate(d.getDate() + 1)
  const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function blankItem(): DraftItem {
  return {
    id: "it" + Math.random().toString(36).slice(2, 7),
    productId: "", productName: "", base: 0, unit: "", qty: 1,
    dim: false, dimL: "", dimW: "", pcs: "1", brief: "", refs: "", designerId: "",
  }
}

export function CreateOrder() {
  const { products, staff, addOrder, nextOrderId, toast } = useApp()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState("")
  const [contact, setContact] = useState("")
  const [deadline, setDeadline] = useState(tomorrow())
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<DraftItem[]>([blankItem()])
  const [discount, setDiscount] = useState("")
  const [discountNote, setDiscountNote] = useState("")
  const [dp, setDp] = useState("")
  const [showErr, setShowErr] = useState(false)

  const designers = staff.filter((s) => s.type === "designer")

  const patchItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))

  const onProduct = (idx: number, productId: string) => {
    const p = products.find((x) => x.id === productId)
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it
        const dim = !!p?.dim
        const next: DraftItem = {
          ...it,
          productId,
          productName: p?.name ?? "",
          base: p?.base ?? 0,
          unit: p?.unit ?? "",
          dim,
        }
        if (dim) {
          next.pcs = next.pcs || "1"
          next.qty = areaQty(next.dimL, next.dimW, next.pcs)
        } else {
          next.qty = Number(next.qty) > 0 ? next.qty : "1"
        }
        return next
      }),
    )
  }

  const onDimField = (idx: number, field: "dimL" | "dimW" | "pcs", value: string) => {
    const v = value.replace(/[^0-9]/g, "")
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it
        const next = { ...it, [field]: v }
        next.qty = areaQty(next.dimL, next.dimW, next.pcs)
        return next
      }),
    )
  }

  const addFiles = (idx: number, files: FileList | null) => {
    const names = Array.from(files ?? []).map((f) => f.name)
    if (!names.length) return
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, refs: [...refsArr(it.refs), ...names].join(", ") } : it,
      ),
    )
    toast(names.length + " file ditambahkan")
  }
  const addLink = (idx: number, value: string) => {
    const v = value.trim()
    if (!v) return
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, refs: [...refsArr(it.refs), v].join(", ") } : it,
      ),
    )
  }
  const removeRef = (idx: number, label: string) =>
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? { ...it, refs: refsArr(it.refs).filter((x) => x !== label).join(", ") }
          : it,
      ),
    )

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (a, it) => a + (Number(it.base) || 0) * (Number(it.qty) || 0),
      0,
    )
    const total = Math.max(0, subtotal - (Number(discount) || 0))
    const dpNum = Number(dp) || 0
    let pay: "paid" | "partial" | "unpaid" = "unpaid"
    if (dpNum >= total && total > 0) pay = "paid"
    else if (dpNum > 0) pay = "partial"
    return { subtotal, total, pay }
  }, [items, discount, dp])

  const save = () => {
    const valid =
      customerName.trim() && items.some((it) => it.productId && Number(it.qty) > 0)
    if (!valid) {
      setShowErr(true)
      toast("Lengkapi nama pelanggan & minimal 1 item")
      return
    }
    const id = nextOrderId()
    const orderItems: OrderItem[] = items
      .filter((it) => it.productId && Number(it.qty) > 0)
      .map((it) => ({
        id: it.id,
        productId: it.productId,
        productName: it.productName,
        base: Number(it.base) || 0,
        unit: it.unit,
        qty: Number(it.qty) || 0,
        dim: it.dim,
        brief: it.brief,
        refs: it.refs,
        designerId: it.designerId,
        operatorId: "",
        status: it.designerId ? "Proses Desain" : "Order Masuk",
        issues: [],
      }))
    const order: Order = {
      id,
      customerName: customerName.trim(),
      contact: contact || "—",
      createdAt: TODAY,
      deadline: deadline.trim(),
      notes,
      discount: Number(discount) || 0,
      discountNote,
      dp: Number(dp) || 0,
      items: orderItems,
    }
    addOrder(order)
    toast("Order " + id + " tersimpan")
    navigate(`/orders/${id}`)
  }

  return (
    <div>
      <button
        onClick={() => navigate("/orders")}
        className="mb-3.5 flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-foreground"
      >
        <Icon name="arrow-left" className="size-4" />
        Batal
      </button>

      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Data pelanggan */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="-mx-5 -mt-5 mb-4 rounded-t-xl border-b bg-secondary px-5 py-3.5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-secondary-foreground">
                <Icon name="user" className="size-4 text-primary" />
                Data Pelanggan
              </h3>
              <p className="mt-1 text-[12.5px] text-secondary-foreground/75">
                Input sekali — berlaku untuk semua item di order ini.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nama pelanggan">
                <input className={inputCls} value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="cth. Andi Pratama" />
              </Field>
              <Field label="No. WhatsApp">
                <input className={inputCls} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="cth. 0812…" />
              </Field>
              <Field label="Deadline">
                <input type="date" className={inputCls + " tabular-nums"} value={deadline} min={TODAY} onChange={(e) => setDeadline(e.target.value)} />
              </Field>
              <Field label="Catatan umum">
                <input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="opsional" />
              </Field>
            </div>
          </div>

          {/* Item order */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b bg-secondary px-[18px] py-3.5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-secondary-foreground">
                <Icon name="layers" className="size-4 text-primary" />
                Item Order
              </h3>
              <span className="text-[12px] text-secondary-foreground/75">
                {items.length} item
              </span>
            </div>

            {items.map((it, idx) => {
              const subtotal = (Number(it.base) || 0) * (Number(it.qty) || 0)
              const refs = parseRefs(it.refs)
              return (
                <div key={it.id} className="border-b p-[18px] last:border-0">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[13px] font-extrabold text-primary">
                      Item {idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
                        className="flex items-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-destructive"
                      >
                        <Icon name="trash-2" className="size-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>

                  <Field label="Produk">
                    <select
                      className={inputCls + " cursor-pointer"}
                      value={it.productId}
                      onChange={(e) => onProduct(idx, e.target.value)}
                    >
                      <option value="">— Pilih produk —</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {fmtRp(p.base)}/{p.unit}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {it.dim ? (
                    <div className="mt-3 rounded-xl border bg-secondary p-3">
                      <div className="mb-2.5 flex items-center gap-1.5 text-[11.5px] font-bold text-secondary-foreground">
                        <Icon name="ruler" className="size-3.5" />
                        Ukuran dalam sentimeter (cm)
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        <DimInput label="Panjang (cm)" value={it.dimL} placeholder="300" onChange={(v) => onDimField(idx, "dimL", v)} />
                        <DimInput label="Lebar (cm)" value={it.dimW} placeholder="150" onChange={(v) => onDimField(idx, "dimW", v)} />
                        <DimInput label="Jumlah (pcs)" value={it.pcs} placeholder="1" onChange={(v) => onDimField(idx, "pcs", v)} />
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-secondary-foreground">
                        Total luas{" "}
                        <b className="tabular-nums">
                          {Number(it.qty) > 0
                            ? Number(it.qty).toLocaleString("id-ID", { maximumFractionDigits: 4 }) + " m²"
                            : "—"}
                        </b>
                        <span className="font-medium text-muted-foreground">
                          · panjang × lebar × jumlah
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 max-w-[240px]">
                      <Field label={it.unit ? `Jumlah (${it.unit})` : "Jumlah"}>
                        <input
                          className={inputCls + " tabular-nums"}
                          inputMode="decimal"
                          value={String(it.qty)}
                          onChange={(e) => patchItem(idx, { qty: e.target.value.replace(/[^0-9.]/g, "") })}
                        />
                      </Field>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px]">
                    <span className="text-muted-foreground">
                      Harga dasar{" "}
                      <b className="tabular-nums text-foreground">
                        {it.productId ? fmtRp(it.base) + " / " + it.unit : "—"}
                      </b>
                    </span>
                    <span className="text-border">|</span>
                    <span className="text-muted-foreground">Subtotal</span>
                    <b className="text-[15px] tabular-nums text-primary">{fmtRp(subtotal)}</b>
                  </div>

                  <div className="mt-3">
                    <Field label="Desainer · PIC desain">
                      <select
                        className={inputCls + " cursor-pointer"}
                        value={it.designerId}
                        onChange={(e) => patchItem(idx, { designerId: e.target.value })}
                      >
                        <option value="">— Assign nanti —</option>
                        {designers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} · {s.job}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div className="mt-2 flex items-start gap-1.5 rounded-lg border bg-background px-3 py-2 text-[11.5px] text-muted-foreground">
                      <Icon name="info" className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span>
                        Operator produksi tidak di-assign di sini — desainer yang
                        menentukan operator setelah desain di-ACC pelanggan.
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Field label="Brief untuk desainer">
                      <input
                        className={inputCls}
                        value={it.brief}
                        onChange={(e) => patchItem(idx, { brief: e.target.value })}
                        placeholder="ukuran, warna, teks, finishing…"
                      />
                    </Field>
                  </div>

                  <div className="mt-3">
                    <label className="text-[12px] font-bold text-muted-foreground">
                      File desain / referensi{" "}
                      <span className="font-medium">(bisa beberapa file)</span>
                    </label>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-dashed border-primary bg-secondary px-3 py-2.5 text-[12.5px] font-bold text-secondary-foreground hover:bg-secondary/70">
                        <Icon name="cloud-upload" className="size-4" />
                        Upload File
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            addFiles(idx, e.target.files)
                            e.target.value = ""
                          }}
                        />
                      </label>
                      {refs.map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex max-w-[200px] items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-[12px] font-semibold"
                        >
                          <Icon name="paperclip" className="size-3 shrink-0 text-primary" />
                          <span className="truncate">{r.label}</span>
                          <button
                            onClick={() => removeRef(idx, r.label)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            aria-label="Hapus referensi"
                          >
                            <Icon name="x" className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      className={inputCls + " mt-2"}
                      placeholder="atau tempel link (drive.google.com/…) lalu tekan Enter"
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return
                        e.preventDefault()
                        addLink(idx, e.currentTarget.value)
                        e.currentTarget.value = ""
                      }}
                    />
                  </div>
                </div>
              )
            })}

            <button
              onClick={() => setItems((p) => [...p, blankItem()])}
              className="flex w-full items-center justify-center gap-1.5 py-3.5 text-[13.5px] font-bold text-primary hover:bg-secondary"
            >
              <Icon name="plus" className="size-[17px]" />
              Tambah Item
            </button>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="lg:sticky lg:top-[78px]">
          <div className="overflow-hidden rounded-xl border bg-card p-[18px] shadow-sm">
            <div className="-mx-[18px] -mt-[18px] mb-3.5 border-b bg-secondary px-[18px] py-3.5">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-secondary-foreground">
                <Icon name="receipt-text" className="size-4 text-primary" />
                Ringkasan
              </h3>
            </div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.filter((it) => it.productId).length || items.length} item)
                </span>
                <span className="tabular-nums">{fmtRp(totals.subtotal)}</span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Diskon</span>
                  <input
                    className="w-[120px] rounded-[9px] border border-input bg-background px-2.5 py-1.5 text-right text-[13px] tabular-nums outline-none focus:border-primary"
                    inputMode="numeric"
                    placeholder="0"
                    value={discount ? Number(discount).toLocaleString("id-ID") : ""}
                    onChange={(e) => setDiscount(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
                <input
                  className="mt-2 w-full rounded-[9px] border border-input bg-background px-2.5 py-1.5 text-[12.5px] outline-none focus:border-primary"
                  placeholder="Catatan diskon (opsional)"
                  value={discountNote}
                  onChange={(e) => setDiscountNote(e.target.value)}
                />
              </div>
              <div className="flex justify-between border-t border-dashed pt-2.5">
                <span className="text-[15px] font-extrabold">Total</span>
                <span className="text-[17px] font-extrabold tabular-nums text-primary">
                  {fmtRp(totals.total)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground">DP awal</span>
                <input
                  className="w-[120px] rounded-[9px] border border-input bg-background px-2.5 py-1.5 text-right text-[13px] tabular-nums outline-none focus:border-primary"
                  inputMode="numeric"
                  placeholder="0"
                  value={dp ? Number(dp).toLocaleString("id-ID") : ""}
                  onChange={(e) => setDp(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status bayar</span>
                <span
                  className={
                    "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold " +
                    payMeta(totals.pay).badgeClass
                  }
                >
                  {payMeta(totals.pay).label}
                </span>
              </div>
            </div>

            <Button className="mt-4 w-full" size="lg" onClick={save}>
              <Icon name="check" className="size-[18px]" />
              Simpan Order
            </Button>
            {showErr && (
              <div className="mt-2.5 text-center text-[12.5px] text-destructive">
                Isi nama pelanggan dan minimal 1 item dengan produk & jumlah.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-bold text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function DimInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-[11.5px] font-bold text-muted-foreground">{label}</label>
      <input
        className="mt-1.5 w-full rounded-[9px] border border-input bg-card px-2.5 py-2.5 text-[13.5px] tabular-nums outline-none focus:border-primary"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
