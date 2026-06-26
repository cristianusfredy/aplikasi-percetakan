export type Role = "owner" | "admin" | "designer" | "production"

export type StaffType = "designer" | "production"

export type OrderStatus =
  | "Order Masuk"
  | "Menunggu DP"
  | "Proses Desain"
  | "Menunggu Approval"
  | "Siap Cetak"
  | "Proses Cetak"
  | "Finishing"
  | "Siap Diambil"
  | "Selesai"
  | "Dibatalkan"

export type PayStatus = "paid" | "partial" | "unpaid"

export interface Product {
  id: string
  name: string
  base: number
  unit: string
  dim?: boolean
}

export interface Staff {
  id: string
  name: string
  job: string
  type: StaffType
}

export interface StockItem {
  id: string
  name: string
  qty: number
  unit: string
  min: number
  note: string
}

export interface Issue {
  type: string
  note: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  base: number
  unit: string
  qty: number
  dim?: boolean
  dimL?: string
  dimW?: string
  pcs?: string
  brief: string
  refs: string
  designerId: string
  operatorId: string
  status: OrderStatus
  issues: Issue[]
}

export interface Order {
  id: string
  customerName: string
  contact: string
  createdAt: string
  deadline: string
  notes: string
  discount: number
  discountNote: string
  dp: number
  items: OrderItem[]
}

export interface DraftItem {
  id: string
  productId: string
  productName: string
  base: number
  unit: string
  qty: number | string
  dim: boolean
  dimL: string
  dimW: string
  pcs: string
  brief: string
  refs: string
  designerId: string
}

export interface Draft {
  customerName: string
  contact: string
  deadline: string
  notes: string
  items: DraftItem[]
  discount: number | string
  discountNote: string
  dp: number | string
}
