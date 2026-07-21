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

export type ArtboardItem = {
  id: string
  x: number
  y: number
  w: number
  h: number
  scale: number
  z: number
}

export type SectionArtboardData = {
  height: number
  items: ArtboardItem[]
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

export function createDefaultArtboards(): ArtboardsMap {
  return {
    hero: {
      height: 640,
      items: [
        item("hero.badge", 48, 96, 300, 40, 2),
        item("hero.title", 48, 152, 520, 130, 2),
        item("hero.desc", 48, 300, 500, 110, 2),
        item("hero.ctaPrimary", 48, 430, 170, 52, 3),
        item("hero.ctaSecondary", 232, 430, 190, 52, 3),
        item("hero.stats", 48, 510, 500, 90, 2),
        item("hero.imagePrimary", 620, 140, 220, 460, 1),
        item("hero.imageSecondary", 820, 80, 260, 520, 2),
      ],
    },
    features: {
      height: 2680,
      items: [
        item("features.title", 176, 48, 800, 56, 2),
        item("features.subtitle", 176, 116, 800, 56, 2),
        item("pillar.0.copy", 48, 220, 480, 420, 2),
        item("pillar.0.image", 620, 200, 280, 520, 1),
        item("pillar.1.copy", 620, 780, 480, 420, 2),
        item("pillar.1.image", 200, 760, 280, 520, 1),
        item("pillar.2.copy", 48, 1340, 480, 420, 2),
        item("pillar.2.image", 620, 1320, 280, 520, 1),
        item("pillar.3.copy", 620, 1900, 480, 420, 2),
        item("pillar.3.image", 200, 1880, 280, 520, 1),
      ],
    },
    how: {
      height: 720,
      items: [
        item("how.title", 176, 48, 800, 56, 2),
        item("how.subtitle", 276, 116, 600, 40, 2),
        item("how.step.0", 48, 200, 250, 260, 2),
        item("how.step.1", 318, 200, 250, 260, 2),
        item("how.step.2", 588, 200, 250, 260, 2),
        item("how.step.3", 858, 200, 250, 260, 2),
        item("how.cta", 456, 520, 240, 52, 3),
      ],
    },
    enterprise: {
      height: 620,
      items: [
        item("enterprise.badge", 56, 80, 200, 36, 2),
        item("enterprise.title", 56, 140, 520, 100, 2),
        item("enterprise.desc", 56, 260, 520, 100, 2),
        item("enterprise.points", 56, 380, 520, 120, 2),
        item("enterprise.cta", 56, 520, 220, 52, 3),
        item("enterprise.image", 680, 60, 280, 520, 1),
      ],
    },
    about: {
      height: 780,
      items: [
        item("about.badge", 476, 48, 200, 36, 2),
        item("about.company", 276, 100, 600, 32, 2),
        item("about.title", 176, 148, 800, 60, 2),
        item("about.desc", 176, 230, 800, 110, 2),
        item("about.cta", 466, 360, 220, 52, 3),
        item("about.value.0", 48, 460, 340, 220, 2),
        item("about.value.1", 406, 460, 340, 220, 2),
        item("about.value.2", 764, 460, 340, 220, 2),
      ],
    },
    download: {
      height: 480,
      items: [
        item("download.title", 176, 80, 800, 70, 2),
        item("download.desc", 276, 170, 600, 56, 2),
        item("download.cta", 280, 260, 180, 52, 3),
        item("download.stores", 480, 260, 320, 52, 3),
        item("download.note", 426, 340, 300, 32, 2),
      ],
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
  }
}

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
    const byId = new Map(
      (Array.isArray(src.items) ? src.items : [])
        .filter((i): i is ArtboardItem => !!i && typeof (i as ArtboardItem).id === "string")
        .map((i) => [i.id, i]),
    )
    const items = def.items.map((fallback) => normalizeItem(byId.get(fallback.id), fallback))
    for (const [id, itemVal] of byId) {
      if (items.some((i) => i.id === id)) continue
      items.push(
        normalizeItem(itemVal, {
          id,
          x: 0,
          y: 0,
          w: 120,
          h: 40,
          scale: 1,
          z: 1,
        }),
      )
    }
    const height =
      typeof src.height === "number" && Number.isFinite(src.height)
        ? Math.max(320, src.height)
        : def.height
    out[sectionId] = { height, items }
  }
  return out
}
