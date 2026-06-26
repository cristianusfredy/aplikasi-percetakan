import type { OrderStatus, Role } from "./types"

/** Tanggal acuan prototipe (belum ada tanggal live) */
export const TODAY = "2026-06-25"

export const STATUSES: OrderStatus[] = [
  "Order Masuk",
  "Menunggu DP",
  "Proses Desain",
  "Menunggu Approval",
  "Siap Cetak",
  "Proses Cetak",
  "Finishing",
  "Siap Diambil",
  "Selesai",
  "Dibatalkan",
]

export const MAIN_FLOW: OrderStatus[] = [
  "Order Masuk",
  "Menunggu DP",
  "Proses Desain",
  "Menunggu Approval",
  "Siap Cetak",
  "Proses Cetak",
  "Finishing",
  "Siap Diambil",
  "Selesai",
]

export const DESIGN_FLOW: OrderStatus[] = [
  "Order Masuk",
  "Proses Desain",
  "Menunggu Approval",
  "Siap Cetak",
]

export const PROD_FLOW: OrderStatus[] = [
  "Siap Cetak",
  "Proses Cetak",
  "Finishing",
  "Siap Diambil",
  "Selesai",
]

export const ISSUE_TYPES = [
  "Brief belum jelas",
  "File desain belum siap",
  "Bahan hampir habis",
  "Masalah mesin",
  "Deadline terlalu cepat",
  "Revisi terlalu banyak",
  "Masalah finishing",
]

export function nextStatus(
  cur: OrderStatus,
  flow: OrderStatus[],
): OrderStatus | null {
  const i = flow.indexOf(cur)
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : null
}

/** Warna badge per status (Tailwind arbitrary values, light theme) */
export const STATUS_BADGE: Record<OrderStatus, string> = {
  "Order Masuk": "bg-[#f1f5f9] text-[#475569]",
  "Menunggu DP": "bg-[#fffbeb] text-[#b45309]",
  "Proses Desain": "bg-[#f5f3ff] text-[#7c3aed]",
  "Menunggu Approval": "bg-[#eff6ff] text-[#2563eb]",
  "Siap Cetak": "bg-[#ecfeff] text-[#0891b2]",
  "Proses Cetak": "bg-[#eef2ff] text-[#4f46e5]",
  Finishing: "bg-[#f0fdfa] text-[#0d9488]",
  "Siap Diambil": "bg-[#f0fdf4] text-[#16a34a]",
  Selesai: "bg-[#dcfce7] text-[#15803d]",
  Dibatalkan: "bg-[#fef2f2] text-[#dc2626]",
}

/** Warna aksen (untuk garis kartu tugas / titik stepper) */
export const STATUS_ACCENT: Record<OrderStatus, string> = {
  "Order Masuk": "#475569",
  "Menunggu DP": "#b45309",
  "Proses Desain": "#7c3aed",
  "Menunggu Approval": "#2563eb",
  "Siap Cetak": "#0891b2",
  "Proses Cetak": "#4f46e5",
  Finishing: "#0d9488",
  "Siap Diambil": "#16a34a",
  Selesai: "#15803d",
  Dibatalkan: "#dc2626",
}

export const SHORT_STATUS: Record<string, string> = {
  "Order Masuk": "Masuk",
  "Menunggu DP": "DP",
  "Proses Desain": "Desain",
  "Menunggu Approval": "Approval",
  "Siap Cetak": "Siap",
  "Proses Cetak": "Cetak",
  Finishing: "Finish",
  "Siap Diambil": "Ambil",
  Selesai: "Selesai",
}

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Pemilik",
  admin: "Admin / Kasir",
  designer: "Desainer",
  production: "Operator Produksi",
}

export interface NavDef {
  to: string
  label: string
  icon: string
}

export const NAV_BY_ROLE: Record<Role, NavDef[]> = {
  owner: [
    { to: "/", label: "Dashboard", icon: "layout-dashboard" },
    { to: "/orders", label: "Pesanan", icon: "clipboard-list" },
    { to: "/products", label: "Produk & Harga", icon: "tag" },
    { to: "/stock", label: "Stok Bahan", icon: "boxes" },
    { to: "/reports", label: "Laporan", icon: "bar-chart-3" },
  ],
  admin: [
    { to: "/", label: "Dashboard", icon: "layout-dashboard" },
    { to: "/orders", label: "Pesanan", icon: "clipboard-list" },
    { to: "/create", label: "Buat Order", icon: "plus-circle" },
    { to: "/products", label: "Produk & Harga", icon: "tag" },
    { to: "/stock", label: "Stok Bahan", icon: "boxes" },
  ],
  designer: [
    { to: "/tasks", label: "Tugas Desain", icon: "pen-tool" },
    { to: "/stock", label: "Stok Bahan", icon: "boxes" },
  ],
  production: [
    { to: "/tasks", label: "Tugas Produksi", icon: "printer" },
    { to: "/stock", label: "Stok Bahan", icon: "boxes" },
  ],
}

export interface LoginRole {
  id: Role
  icon: string
  title: string
  who: string
  desc: string
  iconClass: string
}

export const LOGIN_ROLES: LoginRole[] = [
  {
    id: "owner",
    icon: "crown",
    title: "Pemilik",
    who: "Owner",
    desc: "Pantau seluruh order, pembayaran, stok, dan laporan bisnis dalam satu dashboard.",
    iconClass: "bg-[#e4f5ea] text-[#15803d]",
  },
  {
    id: "admin",
    icon: "user-cog",
    title: "Admin / Kasir",
    who: "Front office",
    desc: "Buat multi-order, hitung harga, catat pembayaran, dan assign tugas ke tim.",
    iconClass: "bg-[#eff6ff] text-[#2563eb]",
  },
  {
    id: "designer",
    icon: "pen-tool",
    title: "Desainer",
    who: "Tim Desain",
    desc: "Kerjakan brief desain, kelola approval pelanggan, lalu serahkan ke produksi saat siap cetak.",
    iconClass: "bg-[#f5f3ff] text-[#7c3aed]",
  },
  {
    id: "production",
    icon: "printer",
    title: "Operator Produksi",
    who: "Cetak & Finishing",
    desc: "Ambil pekerjaan siap cetak, jalankan cetak dan finishing hingga pesanan siap diambil.",
    iconClass: "bg-[#ecfeff] text-[#0891b2]",
  },
]
