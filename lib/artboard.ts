export const ARTBOARD_WIDTH = 1152
export const ARTBOARD_GAP = 8
export const ARTBOARD_GRID = 8

export type ArtboardSectionId =
  | "hero"
  | "features"
  | "how"
  | "enterprise"
  | "about"
  | "download"

export type ArtboardItemKind = "text" | "image"

export type ArtboardItem = {
  id: string
  x: number
  y: number
  w: number
  h: number
  scale: number
  z: number
  /** Freeform widgets added by the editor (not built-in section parts). */
  kind?: ArtboardItemKind
  textZh?: string
  textEn?: string
  src?: string
}

export type SectionArtboardData = {
  height: number
  items: ArtboardItem[]
  /** Built-in item ids the editor has deleted; normalize must not re-add them. */
  removedIds?: string[]
}

export type ArtboardsMap = Record<ArtboardSectionId, SectionArtboardData>

function item(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  z = 1,
  scale = 1,
): ArtboardItem {
  return { id, x, y, w, h, scale, z }
}

export function newWidgetId(kind: ArtboardItemKind) {
  return `widget.${kind}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 6)}`
}

export function createTextWidget(partial?: Partial<ArtboardItem>): ArtboardItem {
  return {
    id: newWidgetId("text"),
    x: 80,
    y: 80,
    w: 320,
    h: 80,
    scale: 1,
    z: 50,
    kind: "text",
    textZh: "新文字",
    textEn: "New text",
    ...partial,
  }
}

export function createImageWidget(partial?: Partial<ArtboardItem>): ArtboardItem {
  return {
    id: newWidgetId("image"),
    x: 80,
    y: 80,
    w: 280,
    h: 200,
    scale: 1,
    z: 50,
    kind: "image",
    src: "/placeholder.svg",
    ...partial,
  }
}

export function isFreeformItem(it: ArtboardItem) {
  return it.kind === "text" || it.kind === "image"
}


export function createDefaultArtboards(): ArtboardsMap {
  const featuresItems: ArtboardItem[] = [
    item("features.title", 176, 48, 800, 56, 2),
    item("features.subtitle", 176, 116, 800, 56, 2),
  ]

  // Four pillars: alternating L/R copy columns with independent controls
  const pillarLayouts = [
    { copyX: 48, imageX: 620, y: 220 },
    { copyX: 620, imageX: 200, y: 780 },
    { copyX: 48, imageX: 620, y: 1340 },
    { copyX: 620, imageX: 200, y: 1900 },
  ]
  pillarLayouts.forEach((layout, i) => {
    const x = layout.copyX
    const y = layout.y
    featuresItems.push(
      item(`pillar.${i}.tag`, x, y, 160, 36, 2),
      item(`pillar.${i}.title`, x, y + 52, 480, 56, 2),
      item(`pillar.${i}.desc`, x, y + 120, 480, 110, 2),
      item(`pillar.${i}.points`, x, y + 248, 480, 96, 2),
      item(`pillar.${i}.cta`, x, y + 396, 250, 52, 3),
      item(`pillar.${i}.image`, layout.imageX, layout.y - 20, 280, 520, 1),
    )
  })

  const howItems: ArtboardItem[] = [
    item("how.title", 176, 48, 800, 56, 2),
    item("how.subtitle", 276, 116, 600, 40, 2),
  ]
  ;[48, 318, 588, 858].forEach((x, i) => {
    howItems.push(
      item(`how.step.${i}.badge`, x, 200, 250, 52, 2),
      item(`how.step.${i}.title`, x, 268, 250, 48, 2),
      item(`how.step.${i}.desc`, x, 328, 250, 120, 2),
    )
  })
  howItems.push(item("how.cta", 456, 520, 240, 52, 3))

  const aboutItems: ArtboardItem[] = [
    item("about.badge", 476, 48, 200, 36, 2),
    item("about.company", 276, 100, 600, 32, 2),
    item("about.title", 176, 148, 800, 60, 2),
    item("about.desc", 176, 230, 800, 110, 2),
    item("about.cta", 466, 360, 220, 52, 3),
  ]
  ;[48, 406, 764].forEach((x, i) => {
    aboutItems.push(
      item(`about.value.${i}.icon`, x, 460, 340, 56, 2),
      item(`about.value.${i}.title`, x, 528, 340, 40, 2),
      item(`about.value.${i}.desc`, x, 580, 340, 100, 2),
    )
  })

  return {
    hero: {
      height: 640,
      items: [
        item("hero.badge", 48, 96, 300, 40, 2),
        item("hero.title", 48, 152, 520, 130, 2),
        item("hero.desc", 48, 300, 500, 110, 2),
        item("hero.ctaPrimary", 48, 430, 170, 52, 3),
        item("hero.ctaSecondary", 232, 430, 190, 52, 3),
        item("hero.stat.0", 48, 510, 150, 80, 2),
        item("hero.stat.1", 214, 510, 150, 80, 2),
        item("hero.stat.2", 380, 510, 150, 80, 2),
        item("hero.imagePrimary", 620, 140, 220, 460, 1),
        item("hero.imageSecondary", 820, 80, 260, 520, 2),
      ],
      removedIds: [],
    },
    features: {
      height: 2680,
      items: featuresItems,
      removedIds: [],
    },
    how: {
      height: 720,
      items: howItems,
      removedIds: [],
    },
    enterprise: {
      height: 620,
      items: [
        item("enterprise.badge", 56, 80, 200, 36, 2),
        item("enterprise.title", 56, 140, 520, 100, 2),
        item("enterprise.desc", 56, 260, 520, 100, 2),
        item("enterprise.point.0", 56, 380, 250, 48, 2),
        item("enterprise.point.1", 320, 380, 250, 48, 2),
        item("enterprise.point.2", 56, 440, 250, 48, 2),
        item("enterprise.point.3", 320, 440, 250, 48, 2),
        item("enterprise.cta", 56, 520, 220, 52, 3),
        item("enterprise.image", 680, 60, 280, 520, 1),
      ],
      removedIds: [],
    },
    about: {
      height: 780,
      items: aboutItems,
      removedIds: [],
    },
    download: {
      height: 480,
      items: [
        item("download.title", 176, 80, 800, 70, 2),
        item("download.desc", 276, 170, 600, 56, 2),
        item("download.cta", 280, 260, 180, 52, 3),
        item("download.storeApp", 480, 260, 150, 52, 3),
        item("download.storePlay", 648, 260, 150, 52, 3),
        item("download.note", 426, 340, 300, 32, 2),
      ],
      removedIds: [],
    },
  }
}

export function snapArtboard(n: number) {
  return Math.round(n / ARTBOARD_GRID) * ARTBOARD_GRID
}

export function clampScale(n: number) {
  const stepped = Math.round(n / 0.05) * 0.05
  return Math.min(2, Math.max(0.4, Number(stepped.toFixed(2))))
}

export function itemBounds(item: ArtboardItem) {
  const w = Math.max(24, item.w * item.scale)
  const h = Math.max(24, item.h * item.scale)
  return { x: item.x, y: item.y, w, h, r: item.x + w, b: item.y + h }
}

function normalizeItem(raw: unknown, fallback: ArtboardItem): ArtboardItem {
  if (!raw || typeof raw !== "object") return { ...fallback }
  const v = raw as Partial<ArtboardItem>
  return {
    id: fallback.id,
    x: typeof v.x === "number" && Number.isFinite(v.x) ? v.x : fallback.x,
    y: typeof v.y === "number" && Number.isFinite(v.y) ? v.y : fallback.y,
    w: typeof v.w === "number" && Number.isFinite(v.w) ? Math.max(24, v.w) : fallback.w,
    h: typeof v.h === "number" && Number.isFinite(v.h) ? Math.max(24, v.h) : fallback.h,
    scale:
      typeof v.scale === "number" && Number.isFinite(v.scale)
        ? clampScale(v.scale)
        : fallback.scale,
    z: typeof v.z === "number" && Number.isFinite(v.z) ? v.z : fallback.z,
    kind: v.kind === "text" || v.kind === "image" ? v.kind : fallback.kind,
    textZh: typeof v.textZh === "string" ? v.textZh : fallback.textZh,
    textEn: typeof v.textEn === "string" ? v.textEn : fallback.textEn,
    src: typeof v.src === "string" ? v.src : fallback.src,
  }
}

function normalizeFreeformItem(raw: unknown): ArtboardItem | null {
  if (!raw || typeof raw !== "object") return null
  const v = raw as Partial<ArtboardItem>
  if (v.kind !== "text" && v.kind !== "image") return null
  if (typeof v.id !== "string" || !v.id.startsWith("widget.")) return null
  const base =
    v.kind === "text"
      ? createTextWidget({ id: v.id })
      : createImageWidget({ id: v.id })
  return normalizeItem(v, base)
}

const OBSOLETE_ITEM_ID =
  /^(pillar\.\d+\.copy|hero\.stats|how\.step\.\d+$|enterprise\.points|about\.value\.\d+$|download\.stores)$/

export function normalizeArtboards(raw: unknown): ArtboardsMap {
  const defaults = createDefaultArtboards()
  if (!raw || typeof raw !== "object") return defaults

  const input = raw as Partial<Record<ArtboardSectionId, Partial<SectionArtboardData>>>
  const out = { ...defaults }

  for (const sectionId of Object.keys(defaults) as ArtboardSectionId[]) {
    const def = defaults[sectionId]
    const src = input[sectionId]
    if (!src || typeof src !== "object") {
      out[sectionId] = structuredClone(def)
      continue
    }
    const removedIds = Array.isArray(src.removedIds)
      ? [...new Set(src.removedIds.filter((id): id is string => typeof id === "string"))]
      : []
    const removed = new Set(removedIds)
    const rawItems = Array.isArray(src.items) ? src.items : []
    const byId = new Map(
      rawItems
        .filter((i): i is ArtboardItem => !!i && typeof (i as ArtboardItem).id === "string")
        .filter((i) => !OBSOLETE_ITEM_ID.test(i.id))
        .map((i) => [i.id, i]),
    )
    const items = def.items
      .filter((fallback) => !removed.has(fallback.id))
      .map((fallback) => normalizeItem(byId.get(fallback.id), fallback))
    for (const rawItem of rawItems) {
      const free = normalizeFreeformItem(rawItem)
      if (!free) continue
      if (removed.has(free.id)) continue
      if (items.some((i) => i.id === free.id)) continue
      items.push(free)
    }
    const height =
      typeof src.height === "number" && Number.isFinite(src.height)
        ? Math.max(320, src.height)
        : def.height
    out[sectionId] = { height, items, removedIds }
  }
  return out
}

export function addItemToArtboard(
  board: SectionArtboardData,
  item: ArtboardItem,
): SectionArtboardData {
  const maxZ = board.items.reduce((m, i) => Math.max(m, i.z), 0)
  const next = { ...item, z: Math.max(item.z, maxZ + 1) }
  const bottom = itemBounds(next).b
  const removedIds = (board.removedIds || []).filter((id) => id !== next.id)
  return {
    height: Math.max(board.height, snapArtboard(bottom + 48)),
    items: [...board.items, next],
    removedIds,
  }
}

/** Delete any item. Freeform is removed; built-ins go into removedIds. */
export function deleteItemFromArtboard(
  board: SectionArtboardData,
  id: string,
): SectionArtboardData {
  const target = board.items.find((i) => i.id === id)
  const items = board.items.filter((i) => i.id !== id)
  const removedIds = [...(board.removedIds || [])]
  if (target && !isFreeformItem(target) && !removedIds.includes(id)) {
    removedIds.push(id)
  }
  return { ...board, items, removedIds }
}

export function removeItemFromArtboard(
  board: SectionArtboardData,
  id: string,
): SectionArtboardData {
  return deleteItemFromArtboard(board, id)
}

export function restoreRemovedItem(
  board: SectionArtboardData,
  sectionId: ArtboardSectionId,
  id: string,
): SectionArtboardData {
  const def = createDefaultArtboards()[sectionId].items.find((i) => i.id === id)
  if (!def) {
    return {
      ...board,
      removedIds: (board.removedIds || []).filter((x) => x !== id),
    }
  }
  const removedIds = (board.removedIds || []).filter((x) => x !== id)
  if (board.items.some((i) => i.id === id)) {
    return { ...board, removedIds }
  }
  return addItemToArtboard({ ...board, removedIds }, { ...def })
}

export function duplicateArtboardItem(
  board: SectionArtboardData,
  id: string,
): { board: SectionArtboardData; newId: string } | null {
  const src = board.items.find((i) => i.id === id)
  if (!src) return null
  const copy: ArtboardItem = {
    ...structuredClone(src),
    id: isFreeformItem(src)
      ? newWidgetId(src.kind!)
      : `${src.id}.copy.${Date.now().toString(36).slice(-4)}`,
    x: snapArtboard(src.x + 24),
    y: snapArtboard(src.y + 24),
    kind: isFreeformItem(src) ? src.kind : "text",
    textZh: isFreeformItem(src) ? src.textZh : undefined,
    textEn: isFreeformItem(src) ? src.textEn : undefined,
    src: isFreeformItem(src) && src.kind === "image" ? src.src : undefined,
  }
  // Duplicating a built-in becomes a freeform text/image snapshot of position only —
  // for built-ins we clone as freeform text placeholder if not image id
  if (!isFreeformItem(src)) {
    const isImage = /image|Image|store|badge\.|icon/.test(src.id) || src.id.includes(".image")
    if (isImage) {
      copy.kind = "image"
      copy.src = "/placeholder.svg"
      copy.textZh = undefined
      copy.textEn = undefined
    } else {
      copy.kind = "text"
      copy.textZh = "複製文字"
      copy.textEn = "Copied text"
      copy.src = undefined
    }
  }
  return { board: addItemToArtboard(board, copy), newId: copy.id }
}

export function visibleArtboardItems(board: SectionArtboardData): ArtboardItem[] {
  const removed = new Set(board.removedIds || [])
  return board.items.filter((i) => !removed.has(i.id))
}

export type SnapGuide = { orient: "v" | "h"; pos: number }

export function snapItemWithGuides(
  moving: ArtboardItem,
  others: ArtboardItem[],
  threshold = 6,
): { item: ArtboardItem; guides: SnapGuide[] } {
  const A = itemBounds(moving)
  const centers = {
    cx: A.x + A.w / 2,
    cy: A.y + A.h / 2,
  }
  let x = moving.x
  let y = moving.y
  const guides: SnapGuide[] = []

  const candidatesX: number[] = [0, ARTBOARD_WIDTH / 2, ARTBOARD_WIDTH]
  const candidatesY: number[] = [0]

  for (const o of others) {
    if (o.id === moving.id) continue
    const B = itemBounds(o)
    candidatesX.push(B.x, B.x + B.w / 2, B.r)
    candidatesY.push(B.y, B.y + B.h / 2, B.b)
  }

  let bestDx = threshold + 1
  let bestDy = threshold + 1
  let snapX: number | null = null
  let snapY: number | null = null
  let guideX: number | null = null
  let guideY: number | null = null

  for (const tx of candidatesX) {
    for (const [from, toX] of [
      [A.x, tx],
      [centers.cx, tx],
      [A.r, tx],
    ] as const) {
      const d = Math.abs(from - tx)
      if (d <= threshold && d < bestDx) {
        bestDx = d
        snapX = moving.x + (tx - from)
        guideX = tx
      }
      void toX
    }
  }
  for (const ty of candidatesY) {
    for (const [from] of [
      [A.y, ty],
      [centers.cy, ty],
      [A.b, ty],
    ] as const) {
      const d = Math.abs(from - ty)
      if (d <= threshold && d < bestDy) {
        bestDy = d
        snapY = moving.y + (ty - from)
        guideY = ty
      }
    }
  }

  if (snapX !== null) {
    x = snapArtboard(snapX)
    if (guideX !== null) guides.push({ orient: "v", pos: guideX })
  }
  if (snapY !== null) {
    y = snapArtboard(Math.max(0, snapY))
    if (guideY !== null) guides.push({ orient: "h", pos: guideY })
  }

  return { item: { ...moving, x, y }, guides }
}
