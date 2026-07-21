export function smoothScrollTo(href: string) {
  if (!href.startsWith("#")) return false
  const id = href.slice(1)
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" })
    return true
  }
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  history.pushState(null, "", href)
  return true
}

export function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return
  e.preventDefault()
  smoothScrollTo(href)
}
