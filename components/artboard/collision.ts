import type { ArtboardItem, SectionArtboardData } from "@/lib/artboard"
import { ARTBOARD_GAP, ARTBOARD_WIDTH, itemBounds, snapArtboard } from "@/lib/artboard"

function intersects(
  a: ReturnType<typeof itemBounds>,
  b: ReturnType<typeof itemBounds>,
  gap = ARTBOARD_GAP,
) {
  return !(
    a.r + gap <= b.x ||
    b.r + gap <= a.x ||
    a.b + gap <= b.y ||
    b.b + gap <= a.y
  )
}

function pushApart(moving: ArtboardItem, other: ArtboardItem): ArtboardItem {
  const A = itemBounds(moving)
  const B = itemBounds(other)
  if (!intersects(A, B, ARTBOARD_GAP)) return other

  const overlapX = Math.min(A.r, B.r) - Math.max(A.x, B.x) + ARTBOARD_GAP
  const overlapY = Math.min(A.b, B.b) - Math.max(A.y, B.y) + ARTBOARD_GAP

  let nx = other.x
  let ny = other.y

  if (overlapY <= overlapX) {
    // Prefer vertical push
    if (B.y + B.h / 2 >= A.y + A.h / 2) ny = snapArtboard(A.b + ARTBOARD_GAP)
    else ny = snapArtboard(A.y - B.h - ARTBOARD_GAP)
  } else {
    if (B.x + B.w / 2 >= A.x + A.w / 2) nx = snapArtboard(A.r + ARTBOARD_GAP)
    else nx = snapArtboard(A.x - B.w - ARTBOARD_GAP)
  }

  nx = Math.max(0, Math.min(nx, ARTBOARD_WIDTH - B.w))
  ny = Math.max(0, ny)

  return { ...other, x: nx, y: ny }
}

/** Resolve overlaps by nudging non-moving items away from the active item. */
export function resolveCollisions(
  board: SectionArtboardData,
  movingId: string,
  passes = 6,
): SectionArtboardData {
  let items = board.items.map((i) => ({ ...i }))
  const moving = items.find((i) => i.id === movingId)
  if (!moving) return board

  for (let p = 0; p < passes; p++) {
    let changed = false
    for (let i = 0; i < items.length; i++) {
      const cur = items[i]
      if (cur.id === movingId) continue
      const next = pushApart(moving, cur)
      if (next.x !== cur.x || next.y !== cur.y) {
        items[i] = next
        changed = true
      }
    }
    // Also separate non-moving pairs lightly so chains don't stack
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (items[i].id === movingId || items[j].id === movingId) continue
        const a = items[i]
        const b = items[j]
        if (!intersects(itemBounds(a), itemBounds(b))) continue
        const pushed = pushApart(a, b)
        if (pushed.x !== b.x || pushed.y !== b.y) {
          items[j] = pushed
          changed = true
        }
      }
    }
    if (!changed) break
  }

  // Clamp moving item
  items = items.map((it) => {
    if (it.id !== movingId) return it
    const b = itemBounds(it)
    return {
      ...it,
      x: Math.max(0, Math.min(snapArtboard(it.x), ARTBOARD_WIDTH - b.w)),
      y: Math.max(0, snapArtboard(it.y)),
    }
  })

  const maxBottom = items.reduce((m, it) => Math.max(m, itemBounds(it).b), 0)
  const height = Math.max(board.height, snapArtboard(maxBottom + 48))

  return { height, items }
}

export function bringToFront(board: SectionArtboardData, id: string): SectionArtboardData {
  const maxZ = board.items.reduce((m, i) => Math.max(m, i.z), 0)
  return {
    ...board,
    items: board.items.map((i) => (i.id === id ? { ...i, z: maxZ + 1 } : i)),
  }
}
