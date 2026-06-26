const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
]
const MONTHS_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export function fmtRp(n: number | string): string {
  const num = Math.round(Number(n) || 0)
  return "Rp" + num.toLocaleString("id-ID")
}

export function fmtRpShort(n: number | string): string {
  const num = Math.round(Number(n) || 0)
  if (num >= 1_000_000)
    return (
      (num / 1_000_000)
        .toFixed(num % 1_000_000 === 0 ? 0 : 1)
        .replace(".", ",") + "jt"
    )
  if (num >= 1000) return Math.round(num / 1000) + "rb"
  return String(num)
}

export function dateLabel(d?: string): string {
  if (!d) return "—"
  const p = d.split("-")
  if (p.length !== 3) return d
  return `${parseInt(p[2])} ${MONTHS_SHORT[parseInt(p[1]) - 1]}`
}

export function dateLabelFull(d?: string): string {
  if (!d) return "—"
  const p = d.split("-")
  if (p.length !== 3) return d
  return `${parseInt(p[2])} ${MONTHS_FULL[parseInt(p[1]) - 1]} ${p[0]}`
}

export function waNumber(c?: string): string {
  let d = String(c || "").replace(/\D/g, "")
  if (!d) return ""
  if (d[0] === "0") d = "62" + d.slice(1)
  else if (d.slice(0, 2) !== "62" && d[0] === "8") d = "62" + d
  return d
}

export function waLink(c?: string, text?: string): string {
  const n = waNumber(c)
  const base = n ? "https://wa.me/" + n : "https://wa.me/"
  return base + (text ? "?text=" + encodeURIComponent(text) : "")
}

export function initials(name?: string): string {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export interface RefLink {
  label: string
  isLink: boolean
  href: string | null
}

export function parseRefs(str?: string): RefLink[] {
  if (!str) return []
  return String(str)
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const isLink =
        /^https?:\/\//i.test(s) || /\.(com|id|net|org|co)\b/i.test(s) || s.includes("/")
      return {
        label: s,
        isLink,
        href: isLink ? (/^https?:/i.test(s) ? s : "https://" + s) : null,
      }
    })
}

export function refsArr(str?: string): string[] {
  return str
    ? String(str)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : []
}
