import { calc, itemSubtotal, payMeta } from "@/lib/calc"
import { dateLabelFull, fmtRp } from "@/lib/format"
import type { Order } from "@/lib/types"
import { Icon } from "./Icon"

export function Nota({ order, onClose }: { order: Order; onClose: () => void }) {
  const c = calc(order)
  const pm = payMeta(c.pay)
  const print = () => setTimeout(() => window.print(), 30)

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/55 p-5 backdrop-blur-sm sm:p-8">
      <div className="w-full max-w-[660px]">
        <div className="no-print mb-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/15 px-3.5 py-2.5 text-[13px] font-bold text-white hover:bg-white/25"
          >
            <Icon name="arrow-left" className="size-4" />
            Tutup
          </button>
          <button
            onClick={print}
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-extrabold text-primary shadow-lg hover:bg-[#f0fdf4]"
          >
            <Icon name="printer" className="size-[17px]" />
            Cetak / Simpan PDF
          </button>
        </div>

        <div className="print-area overflow-hidden rounded-2xl bg-white text-[#1c1917] shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b-[3px] border-primary px-7 py-6">
            <div className="flex items-center gap-3">
              <div className="flex size-[46px] items-center justify-center rounded-[13px] bg-gradient-to-br from-[#16a34a] to-[#166534] text-white">
                <Icon name="printer" className="size-6" />
              </div>
              <div>
                <div className="text-[18px] font-extrabold tracking-wide">
                  SAHABAT PRINTING
                </div>
                <div className="mt-0.5 text-[11.5px] leading-relaxed text-[#78716c]">
                  Jl. Percetakan No. 12, Yogyakarta
                  <br />
                  0274-123456 · sahabatprinting
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[20px] font-extrabold tracking-wide text-primary">
                NOTA
              </div>
              <div className="mt-0.5 font-mono text-[13px] text-[#57534e]">
                {order.id}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-[#eee] px-7 py-5">
            <div>
              <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-[#a8a29e]">
                Ditagihkan kepada
              </div>
              <div className="text-[16px] font-extrabold">{order.customerName}</div>
              <div className="mt-0.5 text-[12.5px] text-[#78716c]">{order.contact}</div>
            </div>
            <div className="text-right">
              <div className="mb-1 flex justify-end gap-2 text-[12.5px]">
                <span className="text-[#a8a29e]">Tanggal</span>
                <span className="min-w-[130px] font-bold">
                  {dateLabelFull(order.createdAt)}
                </span>
              </div>
              <div className="mb-1.5 flex justify-end gap-2 text-[12.5px]">
                <span className="text-[#a8a29e]">Deadline</span>
                <span className="min-w-[130px] font-bold">
                  {dateLabelFull(order.deadline)}
                </span>
              </div>
              <span
                className={
                  "inline-flex rounded-md px-2.5 py-1 text-[12px] font-bold " +
                  pm.badgeClass
                }
              >
                {pm.label}
              </span>
            </div>
          </div>

          <div className="px-7 pt-1.5">
            <div className="grid grid-cols-[30px_1fr_70px_100px_110px] gap-2.5 border-b-2 border-[#1c1917] py-3 text-[10.5px] font-extrabold uppercase tracking-wide text-[#57534e]">
              <span>No</span>
              <span>Produk</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Harga</span>
              <span className="text-right">Subtotal</span>
            </div>
            {order.items.map((it, i) => (
              <div
                key={it.id}
                className="grid grid-cols-[30px_1fr_70px_100px_110px] items-center gap-2.5 border-b border-[#f0efed] py-3 text-[13px]"
              >
                <span className="tabular-nums text-[#a8a29e]">{i + 1}</span>
                <span className="font-bold">{it.productName}</span>
                <span className="text-center tabular-nums text-[#57534e]">
                  {it.qty} {it.unit}
                </span>
                <span className="text-right tabular-nums text-[#57534e]">
                  {fmtRp(it.base)}
                </span>
                <span className="text-right font-bold tabular-nums">
                  {fmtRp(itemSubtotal(it.base, it.qty))}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end px-7 pb-1.5 pt-4">
            <div className="flex w-[280px] flex-col gap-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#78716c]">Subtotal</span>
                <span className="tabular-nums">{fmtRp(c.subtotal)}</span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Diskon</span>
                  <span className="tabular-nums text-[#dc2626]">
                    −{fmtRp(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-dashed border-[#d6d3d1] pt-2 text-[14px] font-extrabold">
                <span>Total</span>
                <span className="tabular-nums">{fmtRp(c.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Dibayar</span>
                <span className="tabular-nums">{fmtRp(c.dp)}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[#f0fdf4] px-3 py-2.5 font-extrabold text-[#166534]">
                <span>Sisa</span>
                <span className="tabular-nums">{fmtRp(c.remaining)}</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-end justify-between gap-4 border-t border-[#eee] px-7 pb-6 pt-4">
            <div className="max-w-[280px] text-[11px] leading-relaxed text-[#a8a29e]">
              Terima kasih atas kepercayaan Anda.
              <br />
              Barang yang sudah dicetak tidak dapat dikembalikan. Mohon cek hasil
              sebelum meninggalkan toko.
            </div>
            <div className="text-center">
              <div className="mb-9 text-[11.5px] text-[#78716c]">Hormat kami,</div>
              <div className="w-[140px] border-t border-[#1c1917] pt-1.5 text-[11.5px] font-bold">
                Sahabat Printing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
