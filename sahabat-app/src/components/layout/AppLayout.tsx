import { useState, type ReactNode } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NAV_BY_ROLE, ROLE_LABEL } from "@/lib/constants"
import { initials } from "@/lib/format"
import { isStaffRole, useApp } from "@/store/app-store"
import type { Role } from "@/lib/types"
import { Icon } from "@/components/Icon"

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#16a34a] to-[#166534] text-white">
        <Icon name="printer" className="size-[18px]" />
      </div>
      {!compact && (
        <div className="min-w-0 leading-tight">
          <div className="text-[13.5px] font-extrabold tracking-[0.1em] text-sidebar-foreground">
            SAHABAT
          </div>
          <div className="text-[10.5px] tracking-[0.18em] text-sidebar-foreground/50">
            PRINTING
          </div>
        </div>
      )}
    </div>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { role, myTasks } = useApp()
  if (!role) return null
  const taskCount = myTasks().length
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {NAV_BY_ROLE[role].map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60",
            )
          }
        >
          <Icon name={n.icon} className="size-[18px]" />
          <span className="flex-1">{n.label}</span>
          {n.to === "/tasks" && taskCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {taskCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserFooter() {
  const { currentUserLabel, role, logout } = useApp()
  const navigate = useNavigate()
  const label = currentUserLabel()
  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[13px] font-bold text-primary">
          {initials(label)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-bold text-sidebar-foreground">
            {label}
          </div>
          <div className="text-[11px] text-sidebar-foreground/50">
            {role ? ROLE_LABEL[role] : ""}
          </div>
        </div>
        <button
          onClick={() => {
            logout()
            navigate("/login")
          }}
          title="Keluar"
          aria-label="Keluar"
          className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Icon name="log-out" className="size-4" />
        </button>
      </div>
    </div>
  )
}

const ROLE_SWITCH: { id: Role; label: string; icon: string }[] = [
  { id: "owner", label: "Owner", icon: "crown" },
  { id: "admin", label: "Admin", icon: "user-cog" },
  { id: "designer", label: "Desain", icon: "pen-tool" },
  { id: "production", label: "Produksi", icon: "printer" },
]

function RoleSwitcher() {
  const { role, switchRole } = useApp()
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-0.5 rounded-xl border bg-card p-1">
      {ROLE_SWITCH.map((r) => {
        const on = role === r.id
        return (
          <button
            key={r.id}
            onClick={() => {
              switchRole(r.id)
              navigate(isStaffRole(r.id) ? "/tasks" : "/")
            }}
            title={r.label}
            aria-label={"Masuk sebagai " + r.label}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold transition-colors",
              on
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon name={r.icon} className="size-[15px]" />
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function Header({ mobileNav }: { mobileNav: ReactNode }) {
  const { theme, toggleTheme } = useApp()
  return (
    <header className="sticky top-0 z-20 flex h-[62px] items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2.5 lg:hidden">
        {mobileNav}
        <Brand compact />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <RoleSwitcher />
        <button
          onClick={toggleTheme}
          title="Ganti tampilan"
          className="flex items-center gap-1.5 rounded-xl border bg-card px-3 py-2 text-[12.5px] font-bold hover:border-primary"
        >
          <Icon name="palette" className="size-[15px] text-primary" />
          <span className="hidden md:inline">
            Tampilan {theme === "A" ? "Terang" : "Gelap"}
          </span>
        </button>
      </div>
    </header>
  )
}

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)

  const mobileNav = (
    <Sheet open={navOpen} onOpenChange={setNavOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Buka menu navigasi"
          className="flex size-9 items-center justify-center rounded-[10px] border bg-card text-foreground hover:border-primary hover:text-primary"
        >
          <Icon name="menu" className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[272px] bg-sidebar p-0">
        <SheetHeader className="border-b border-sidebar-border p-4">
          <SheetTitle className="text-left">
            <Brand />
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100%-69px)] flex-col">
          <NavList onNavigate={() => setNavOpen(false)} />
          <UserFooter />
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="border-b border-sidebar-border p-4">
          <Brand />
        </div>
        <NavList />
        <UserFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header mobileNav={mobileNav} />
        <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 pb-12 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
