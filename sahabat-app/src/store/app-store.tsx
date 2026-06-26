import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { STATUSES } from "@/lib/constants"
import {
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_STAFF,
  MOCK_STOCK,
  START_NEXT_NUM,
} from "@/lib/mock"
import type {
  Issue,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Role,
  Staff,
  StockItem,
} from "@/lib/types"

export interface TaskRef {
  orderId: string
  itemId: string
  productName: string
  customerName: string
  qty: number
  unit: string
  deadline: string
  status: OrderStatus
  brief: string
}

export interface IssueRef {
  type: string
  note: string
  where: string
}

interface AppState {
  role: Role | null
  userId: string | null
  theme: "A" | "B"
  orders: Order[]
  products: Product[]
  staff: Staff[]
  stock: StockItem[]
}

interface AppContextValue extends AppState {
  toastMsg: string | null
  // auth
  login: (role: Role) => void
  switchRole: (role: Role) => void
  logout: () => void
  toggleTheme: () => void
  toast: (msg: string) => void
  // lookups
  staffName: (id: string) => string
  staffJob: (id: string) => string
  prod: (id: string) => Product | undefined
  myTasks: () => TaskRef[]
  allIssues: () => IssueRef[]
  currentUserLabel: () => string
  // mutations
  addOrder: (order: Order) => void
  nextOrderId: () => string
  addPayment: (orderId: string, amount: number) => void
  markPaid: (orderId: string, total: number) => void
  cancelItem: (orderId: string, itemId: string) => void
  setItemStatus: (orderId: string, itemId: string, status: OrderStatus) => void
  advanceItem: (orderId: string, itemId: string, flow: OrderStatus[]) => void
  addIssue: (orderId: string, itemId: string, issue: Issue) => void
  assignOperator: (orderId: string, itemId: string, operatorId: string) => void
  setProductBase: (id: string, base: number) => void
  adjustStock: (id: string, delta: number) => void
  addLowNote: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function defaultUser(role: Role): string | null {
  return role === "designer" ? "s1" : role === "production" ? "s3" : null
}

export function isStaffRole(role: Role | null): boolean {
  return role === "designer" || role === "production"
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [theme, setTheme] = useState<"A" | "B">("A")
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [staff] = useState<Staff[]>(MOCK_STAFF)
  const [stock, setStock] = useState<StockItem[]>(MOCK_STOCK)
  const [nextNum, setNextNum] = useState<number>(START_NEXT_NUM)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "B")
  }, [theme])

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400)
  }, [])

  const login = useCallback((r: Role) => {
    setRole(r)
    setUserId(defaultUser(r))
  }, [])

  const switchRole = useCallback((r: Role) => {
    setRole(r)
    setUserId(defaultUser(r))
  }, [])

  const logout = useCallback(() => {
    setRole(null)
    setUserId(null)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "A" ? "B" : "A"))
  }, [])

  const staffName = useCallback(
    (id: string) => staff.find((s) => s.id === id)?.name ?? "Belum di-assign",
    [staff],
  )
  const staffJob = useCallback(
    (id: string) => staff.find((s) => s.id === id)?.job ?? "",
    [staff],
  )
  const prod = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const mutateOrder = useCallback(
    (id: string, fn: (o: Order) => Order) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? fn({ ...o }) : o)))
    },
    [],
  )

  const mutateItem = useCallback(
    (orderId: string, itemId: string, fn: (it: OrderItem) => OrderItem) => {
      mutateOrder(orderId, (o) => ({
        ...o,
        items: o.items.map((it) => (it.id === itemId ? fn({ ...it }) : it)),
      }))
    },
    [mutateOrder],
  )

  const nextOrderId = useCallback(() => "ORD-" + nextNum, [nextNum])

  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev])
      setNextNum((n) => n + 1)
    },
    [],
  )

  const addPayment = useCallback(
    (orderId: string, amount: number) => {
      if (!amount) return
      mutateOrder(orderId, (o) => ({ ...o, dp: (Number(o.dp) || 0) + amount }))
      toast("Pembayaran dicatat")
    },
    [mutateOrder, toast],
  )

  const markPaid = useCallback(
    (orderId: string, total: number) => {
      mutateOrder(orderId, (o) => ({ ...o, dp: total }))
      toast("Order ditandai lunas")
    },
    [mutateOrder, toast],
  )

  const cancelItem = useCallback(
    (orderId: string, itemId: string) => {
      mutateItem(orderId, itemId, (it) => ({ ...it, status: "Dibatalkan" }))
      toast("Item dibatalkan")
    },
    [mutateItem, toast],
  )

  const setItemStatus = useCallback(
    (orderId: string, itemId: string, status: OrderStatus) => {
      mutateItem(orderId, itemId, (it) => ({ ...it, status }))
      toast("Status: " + status)
    },
    [mutateItem, toast],
  )

  const advanceItem = useCallback(
    (orderId: string, itemId: string, flow: OrderStatus[]) => {
      mutateItem(orderId, itemId, (it) => {
        const i = flow.indexOf(it.status)
        const ni = i >= 0 && i < flow.length - 1 ? flow[i + 1] : null
        return ni ? { ...it, status: ni } : it
      })
      toast("Status diperbarui")
    },
    [mutateItem, toast],
  )

  const addIssue = useCallback(
    (orderId: string, itemId: string, issue: Issue) => {
      mutateItem(orderId, itemId, (it) => ({
        ...it,
        issues: [...it.issues, issue],
      }))
      toast("Masalah dicatat")
    },
    [mutateItem, toast],
  )

  const assignOperator = useCallback(
    (orderId: string, itemId: string, operatorId: string) => {
      mutateItem(orderId, itemId, (it) => ({ ...it, operatorId }))
      toast(operatorId ? "Operator produksi di-assign" : "Assign operator dihapus")
    },
    [mutateItem, toast],
  )

  const setProductBase = useCallback((id: string, base: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, base } : p)))
  }, [])

  const adjustStock = useCallback((id: string, delta: number) => {
    setStock((prev) =>
      prev.map((m) => (m.id === id ? { ...m, qty: Math.max(0, m.qty + delta) } : m)),
    )
  }, [])

  const addLowNote = useCallback(
    (id: string) => {
      const by = userId ? staffName(userId) : "tim"
      setStock((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, note: "Dilaporkan hampir habis oleh " + by } : m,
        ),
      )
      toast("Catatan stok terkirim")
    },
    [userId, staffName, toast],
  )

  const myTasks = useCallback((): TaskRef[] => {
    const out: TaskRef[] = []
    const siap = STATUSES.indexOf("Siap Cetak")
    orders.forEach((o) =>
      o.items.forEach((it) => {
        const idx = STATUSES.indexOf(it.status)
        let mine = false
        if (role === "designer")
          mine = it.designerId === userId && idx <= siap && it.status !== "Dibatalkan"
        else if (role === "production")
          mine = it.operatorId === userId && idx >= siap && it.status !== "Dibatalkan"
        if (mine)
          out.push({
            orderId: o.id, itemId: it.id, productName: it.productName,
            customerName: o.customerName, qty: it.qty, unit: it.unit,
            deadline: o.deadline, status: it.status, brief: it.brief,
          })
      }),
    )
    return out
  }, [orders, role, userId])

  const allIssues = useCallback((): IssueRef[] => {
    const out: IssueRef[] = []
    orders.forEach((o) =>
      o.items.forEach((it) =>
        it.issues.forEach((iss) =>
          out.push({
            type: iss.type,
            note: iss.note,
            where: `${o.id} · ${o.customerName} · ${it.productName}`,
          }),
        ),
      ),
    )
    return out
  }, [orders])

  const currentUserLabel = useCallback((): string => {
    if (isStaffRole(role) && userId) return staffName(userId)
    return role === "owner" ? "Pak Hendra" : "Mbak Rina"
  }, [role, userId, staffName])

  const value = useMemo<AppContextValue>(
    () => ({
      role, userId, theme, orders, products, staff, stock, toastMsg,
      login, switchRole, logout, toggleTheme, toast,
      staffName, staffJob, prod, myTasks, allIssues, currentUserLabel,
      addOrder, nextOrderId, addPayment, markPaid, cancelItem, setItemStatus,
      advanceItem, addIssue, assignOperator, setProductBase, adjustStock, addLowNote,
    }),
    [
      role, userId, theme, orders, products, staff, stock, toastMsg,
      login, switchRole, logout, toggleTheme, toast,
      staffName, staffJob, prod, myTasks, allIssues, currentUserLabel,
      addOrder, nextOrderId, addPayment, markPaid, cancelItem, setItemStatus,
      advanceItem, addIssue, assignOperator, setProductBase, adjustStock, addLowNote,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
