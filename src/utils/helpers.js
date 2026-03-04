export const fmtSum = (n) => {
  const v = Number(n || 0)
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + " mlrd so'm"
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + " mln so'm"
  return v.toLocaleString('uz-UZ') + " so'm"
}

export const fmtFull = (n) => Number(n || 0).toLocaleString('uz-UZ') + " so'm"

export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('uz-UZ') : '-'

export const uid = () => Date.now() + Math.floor(Math.random() * 9999)
