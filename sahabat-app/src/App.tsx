import { Navigate, Route, Routes } from "react-router-dom"
import type { ReactNode } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { isStaffRole, useApp } from "@/store/app-store"
import type { Role } from "@/lib/types"
import { Login } from "@/pages/Login"
import { Dashboard } from "@/pages/Dashboard"
import { Orders } from "@/pages/Orders"
import { OrderDetail } from "@/pages/OrderDetail"
import { CreateOrder } from "@/pages/CreateOrder"
import { Tasks } from "@/pages/Tasks"
import { TaskDetail } from "@/pages/TaskDetail"
import { Products } from "@/pages/Products"
import { Stock } from "@/pages/Stock"
import { Reports } from "@/pages/Reports"

function RequireAuth({ children }: { children: ReactNode }) {
  const { role } = useApp()
  if (!role) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RoleGate({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { role } = useApp()
  if (role && !allow.includes(role))
    return <Navigate to={isStaffRole(role) ? "/tasks" : "/"} replace />
  return <>{children}</>
}

const MANAGER: Role[] = ["owner", "admin"]

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<RoleGate allow={MANAGER}><Dashboard /></RoleGate>} />
        <Route path="/orders" element={<RoleGate allow={MANAGER}><Orders /></RoleGate>} />
        <Route path="/orders/:id" element={<RoleGate allow={MANAGER}><OrderDetail /></RoleGate>} />
        <Route path="/create" element={<RoleGate allow={MANAGER}><CreateOrder /></RoleGate>} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:orderId/:itemId" element={<TaskDetail />} />
        <Route path="/products" element={<RoleGate allow={MANAGER}><Products /></RoleGate>} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/reports" element={<RoleGate allow={["owner"]}><Reports /></RoleGate>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
