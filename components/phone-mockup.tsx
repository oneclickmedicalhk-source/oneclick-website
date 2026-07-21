import Image from "next/image"

export function PhoneMockup({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={`relative aspect-[280/580] w-[280px] rounded-[2.6rem] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl ${className}`}
    >
      <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-background">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          sizes="280px"
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}
