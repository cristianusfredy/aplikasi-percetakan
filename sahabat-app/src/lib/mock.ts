import type { Order, Product, Staff, StockItem } from "./types"

export const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Banner", base: 25000, unit: "m²", dim: true },
  { id: "p2", name: "Poster Full Color", base: 5000, unit: "lembar" },
  { id: "p3", name: "Poster BW", base: 3000, unit: "lembar" },
  { id: "p4", name: "Kartu Nama", base: 50000, unit: "box" },
  { id: "p5", name: "Stiker", base: 10000, unit: "lembar" },
  { id: "p6", name: "Spanduk", base: 28000, unit: "m²", dim: true },
  { id: "p7", name: "Brosur A5", base: 1500, unit: "lembar" },
  { id: "p8", name: "X-Banner", base: 75000, unit: "pcs" },
  { id: "p9", name: "Undangan", base: 4500, unit: "pcs" },
]

export const MOCK_STAFF: Staff[] = [
  { id: "s1", name: "Rian", job: "Desainer", type: "designer" },
  { id: "s2", name: "Putri", job: "Desainer", type: "designer" },
  { id: "s3", name: "Joko", job: "Operator Cetak", type: "production" },
  { id: "s4", name: "Eka", job: "Operator Finishing", type: "production" },
]

export const MOCK_STOCK: StockItem[] = [
  { id: "m1", name: "Flexi Banner", qty: 48, unit: "meter", min: 30, note: "" },
  { id: "m2", name: "Art Paper 260gr", qty: 12, unit: "rim", min: 15, note: "Hampir habis — perlu order" },
  { id: "m3", name: "Tinta Eco Solvent", qty: 6, unit: "liter", min: 4, note: "" },
  { id: "m4", name: "Stiker Vinyl", qty: 22, unit: "roll", min: 10, note: "" },
  { id: "m5", name: "Kertas Undangan", qty: 8, unit: "pack", min: 12, note: "" },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1042", customerName: "Andi Pratama", contact: "0812-3344-1290",
    createdAt: "2026-06-25", deadline: "2026-06-28",
    notes: "Pelanggan langganan, minta hasil rapi.", discount: 10000, discountNote: "Langganan", dp: 60000,
    items: [
      { id: "a1", productId: "p1", productName: "Banner", base: 25000, unit: "meter", qty: 2, brief: 'Banner promo 2m, dominan oranye, logo di tengah, teks "GRAND OPENING".', refs: "logo-grandopening.png, referensi-warna.jpg", designerId: "s1", operatorId: "s3", status: "Proses Cetak", issues: [] },
      { id: "a2", productId: "p2", productName: "Poster Full Color", base: 5000, unit: "lembar", qty: 10, brief: "Poster A3 full color, tema sama dengan banner.", refs: "", designerId: "s2", operatorId: "s4", status: "Finishing", issues: [] },
    ],
  },
  {
    id: "ORD-1041", customerName: "CV Maju Jaya", contact: "0856-7788-0021",
    createdAt: "2026-06-24", deadline: "2026-06-26", notes: "", discount: 0, discountNote: "", dp: 175000,
    items: [
      { id: "b1", productId: "p4", productName: "Kartu Nama", base: 50000, unit: "box", qty: 2, brief: "Kartu nama 2 box, desain minimalis, finishing doff.", refs: "", designerId: "s1", operatorId: "s3", status: "Selesai", issues: [] },
      { id: "b2", productId: "p7", productName: "Brosur A5", base: 1500, unit: "lembar", qty: 500, brief: "Brosur A5 dua sisi, 500 lembar.", refs: "", designerId: "s2", operatorId: "s3", status: "Siap Diambil", issues: [] },
    ],
  },
  {
    id: "ORD-1040", customerName: "Siti Aminah", contact: "0813-2211-7766",
    createdAt: "2026-06-24", deadline: "2026-06-30", notes: "Acara pernikahan 5 Juli.", discount: 0, discountNote: "", dp: 0,
    items: [
      { id: "c1", productId: "p9", productName: "Undangan", base: 4500, unit: "pcs", qty: 200, brief: "Undangan 200 pcs tema rustic.", refs: "moodboard-rustic.pdf, drive.google.com/contoh-undangan", designerId: "s2", operatorId: "", status: "Proses Desain", issues: [{ type: "Brief belum jelas", note: "Warna tema belum dikonfirmasi pelanggan." }] },
    ],
  },
  {
    id: "ORD-1039", customerName: "Toko Berkah", contact: "0821-9090-3322",
    createdAt: "2026-06-25", deadline: "2026-06-27", notes: "", discount: 5000, discountNote: "Nego", dp: 40000,
    items: [
      { id: "d1", productId: "p6", productName: "Spanduk", base: 28000, unit: "meter", qty: 3, brief: "Spanduk promo 3m.", refs: "logo-toko-berkah.png, contoh-spanduk.jpg", designerId: "s1", operatorId: "s3", status: "Siap Cetak", issues: [] },
      { id: "d2", productId: "p5", productName: "Stiker", base: 10000, unit: "lembar", qty: 100, brief: "Stiker label produk, 100 lembar.", refs: "", designerId: "s1", operatorId: "", status: "Order Masuk", issues: [] },
    ],
  },
  {
    id: "ORD-1038", customerName: "Budi Santoso", contact: "0878-1212-5544",
    createdAt: "2026-06-23", deadline: "2026-06-26", notes: "", discount: 0, discountNote: "", dp: 75000,
    items: [
      { id: "e1", productId: "p8", productName: "X-Banner", base: 75000, unit: "pcs", qty: 2, brief: "X-Banner stand pameran, 2 pcs.", refs: "referensi-pameran.jpg", designerId: "s1", operatorId: "", status: "Menunggu Approval", issues: [{ type: "File desain belum siap", note: "Menunggu logo vektor dari pelanggan." }] },
    ],
  },
  {
    id: "ORD-1037", customerName: "PT Sinar Abadi", contact: "0811-4545-9090",
    createdAt: "2026-06-22", deadline: "2026-06-24", notes: "Corporate order.", discount: 25000, discountNote: "Corporate", dp: 565000,
    items: [
      { id: "f1", productId: "p3", productName: "Poster BW", base: 3000, unit: "lembar", qty: 50, brief: "Poster BW pengumuman internal.", refs: "", designerId: "s2", operatorId: "s4", status: "Selesai", issues: [] },
      { id: "f2", productId: "p1", productName: "Banner", base: 25000, unit: "meter", qty: 5, brief: "Banner lobby 5m.", refs: "", designerId: "s1", operatorId: "s3", status: "Selesai", issues: [] },
      { id: "f3", productId: "p4", productName: "Kartu Nama", base: 50000, unit: "box", qty: 5, brief: "Kartu nama direksi 5 box.", refs: "", designerId: "s1", operatorId: "s3", status: "Selesai", issues: [] },
    ],
  },
  {
    id: "ORD-1036", customerName: "Dewi Lestari", contact: "0857-3030-1188",
    createdAt: "2026-06-21", deadline: "2026-06-25", notes: "", discount: 0, discountNote: "", dp: 30000,
    items: [
      { id: "g1", productId: "p7", productName: "Brosur A5", base: 1500, unit: "lembar", qty: 1000, brief: "Brosur promo toko, 1000 lembar.", refs: "", designerId: "s2", operatorId: "s3", status: "Proses Cetak", issues: [{ type: "Bahan hampir habis", note: "Art paper 260gr tersisa sedikit." }] },
    ],
  },
]

export const START_NEXT_NUM = 1043
