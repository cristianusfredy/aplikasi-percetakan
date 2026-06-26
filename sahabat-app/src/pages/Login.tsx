import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LOGIN_ROLES } from "@/lib/constants"
import { isStaffRole, useApp } from "@/store/app-store"
import { Icon } from "@/components/Icon"
import { cn } from "@/lib/utils"

export function Login() {
  const { role, login } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (role) navigate(isStaffRole(role) ? "/tasks" : "/", { replace: true })
  }, [role, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_-10%,#e9f6ee_0%,#f6faf7_55%,#edf4f0_100%)] px-5 py-8">
      <div className="w-full max-w-[760px]">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex size-[46px] items-center justify-center rounded-[13px] bg-gradient-to-br from-[#16a34a] to-[#166534] text-white shadow-lg shadow-primary/30">
            <Icon name="printer" className="size-6" />
          </div>
          <div className="text-left">
            <div className="text-[18px] font-extrabold tracking-[0.14em] text-[#1c1917]">
              SAHABAT PRINTING
            </div>
            <div className="text-[12px] tracking-wide text-[#9a8f85]">
              Sistem Manajemen Percetakan
            </div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-primary">
            Masuk sebagai
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1c1917] sm:text-3xl">
            Pilih peran Anda untuk mulai
          </h1>
          <p className="mx-auto mt-2.5 max-w-[460px] text-[15px] text-[#7c736b]">
            Satu sistem terpusat untuk order, harga, produksi, pembayaran, dan
            laporan — menggantikan catatan WhatsApp yang tercecer.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LOGIN_ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                login(r.id)
                navigate(isStaffRole(r.id) ? "/tasks" : "/")
              }}
              className="group rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#bfe3cc] hover:shadow-xl"
            >
              <div
                className={cn(
                  "mb-4 flex size-11 items-center justify-center rounded-xl text-xl",
                  r.iconClass,
                )}
              >
                <Icon name={r.icon} className="size-5" />
              </div>
              <div className="text-[17px] font-extrabold text-[#1c1917]">
                {r.title}
              </div>
              <div className="mb-3.5 mt-0.5 text-[13px] text-[#9a8f85]">{r.who}</div>
              <div className="text-[13px] leading-relaxed text-[#57514b]">
                {r.desc}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-primary">
                Masuk
                <Icon
                  name="arrow-right"
                  className="size-[15px] transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-[12.5px] text-[#a8a29e]">
          Prototipe MVP · Anda bisa berpindah peran kapan saja dari menu atas
        </div>
      </div>
    </div>
  )
}
