interface DemoNoticeProps {
  message: string
}

export function DemoNotice({ message }: DemoNoticeProps) {
  return (
    <div
      role="note"
      className="bg-secondary px-4 py-1.5 text-center text-xs text-secondary-foreground"
    >
      {message}
    </div>
  )
}
