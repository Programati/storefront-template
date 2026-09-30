export function SoldOutOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className="absolute inset-0 bg-background/50" />
      <span
        className="absolute top-5 -right-10 w-40 rotate-45 bg-destructive py-1 text-center
                   text-xs font-bold tracking-wide text-destructive-foreground shadow-sm
                   animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none"
      >
        AGOTADO
      </span>
    </div>
  )
}
