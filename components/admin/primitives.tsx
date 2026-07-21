"use client"

import type React from "react"
import { useRef, useState } from "react"
import { ArrowDown, ArrowUp, GripVertical, ImageIcon, Plus, Trash2, Upload } from "lucide-react"

/* ----------------------------- Layout blocks ----------------------------- */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-pretty text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function Card({
  title,
  description,
  children,
  aside,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      {title ? (
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-card-foreground">{title}</h2>
            {description ? <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
          </div>
          {aside}
        </header>
      ) : null}
      <div className="flex flex-col gap-5 p-5">{children}</div>
    </section>
  )
}

/* ------------------------------- Form fields ------------------------------ */

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-xs font-medium text-foreground">
        {label}
        {hint ? <span className="font-normal text-muted-foreground">{hint}</span> : null}
      </span>
      {children}
    </label>
  )
}

const inputBase =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25"

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputBase}
    />
  )
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} resize-y leading-relaxed`}
    />
  )
}

/* ------------------------------- List editor ------------------------------ */

export function ListEditor({
  items,
  onChange,
  addLabel = "Add item",
}: {
  items: string[]
  onChange: (items: string[]) => void
  addLabel?: string
}) {
  const update = (i: number, v: string) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ""])
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              aria-label="上移"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="grid size-5 place-items-center text-muted-foreground disabled:opacity-30"
            >
              <ArrowUp className="size-3" />
            </button>
            <GripVertical className="size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            <button
              type="button"
              aria-label="下移"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              className="grid size-5 place-items-center text-muted-foreground disabled:opacity-30"
            >
              <ArrowDown className="size-3" />
            </button>
          </div>
          <input value={it} onChange={(e) => update(i, e.target.value)} className={inputBase} />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </button>
    </div>
  )
}

/* ------------------------------ Image field ------------------------------ */

export async function uploadImageFile(file: File, opts?: { id?: string; alt?: string }) {
  const form = new FormData()
  form.append("file", file)
  if (opts?.id) form.append("id", opts.id)
  if (opts?.alt) form.append("alt", opts.alt)
  const res = await fetch("/api/media", { method: "POST", body: form })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "上傳失敗")
  }
  return res.json() as Promise<{ url: string; media?: unknown; content?: unknown }>
}

export function ImageField({
  src,
  label,
  onUploaded,
  onClear,
  mediaId,
  ratio = "aspect-[9/19]",
}: {
  src: string
  label: string
  onUploaded?: (url: string) => void
  onClear?: () => void
  mediaId?: string
  ratio?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const data = await uploadImageFile(file, { id: mediaId, alt: label })
      onUploaded?.(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "上傳失敗")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`${ratio} w-20 overflow-hidden rounded-lg border border-border bg-muted`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src || "/placeholder.svg"} alt={label} className="size-full object-cover" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
          >
            <Upload className="size-3.5" />
            {busy ? "上傳中…" : "Replace image"}
          </button>
          {onClear ? (
            <button
              type="button"
              disabled={busy || !src}
              onClick={onClear}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-destructive shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
            >
              <Trash2 className="size-3.5" />
              刪除
            </button>
          ) : null}
        </div>
        <span className="max-w-xs truncate font-mono text-[11px] text-muted-foreground">{src}</span>
        {error ? <span className="text-xs text-destructive">{error}</span> : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}

/* ------------------------------- Controls -------------------------------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-input"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  )
}

export function MediaTile({
  src,
  label,
  onReplace,
}: {
  src: string
  label: string
  onReplace?: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [hover, setHover] = useState(false)
  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <button
        type="button"
        className="aspect-square w-full overflow-hidden bg-muted text-left"
        onClick={() => inputRef.current?.click()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src || "/placeholder.svg"} alt={label} className="size-full object-cover transition-transform group-hover:scale-105" />
      </button>
      <figcaption className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="truncate text-xs font-medium text-foreground">{label}</span>
        <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </figcaption>
      {hover ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-2">
          <span className="rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
            Replace
          </span>
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onReplace?.(f)
          e.target.value = ""
        }}
      />
    </figure>
  )
}
