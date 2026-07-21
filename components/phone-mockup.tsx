import Image from "next/image"
import { cn } from "@/lib/utils"

function isInlineSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:")
}

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
  const safeSrc = src || "/placeholder.svg"
  const inline = isInlineSrc(safeSrc)

  return (
    <div
      className={cn(
        "relative aspect-[280/580] w-[280px] rounded-[2.6rem] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-background">
        {inline ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={safeSrc} alt={alt} className="absolute inset-0 size-full object-cover object-top" />
        ) : (
          <Image
            src={safeSrc}
            alt={alt}
            fill
            sizes="280px"
            priority={priority}
            className="object-cover object-top"
          />
        )}
      </div>
    </div>
  )
}
