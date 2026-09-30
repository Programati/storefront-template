import { imageUrl } from '@/lib/image-url'

interface SmartImageProps {
  path: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function SmartImage({
  path,
  alt,
  width = 400,
  height = 400,
  priority = false,
  className,
}: SmartImageProps) {
  return (
    <img
      src={imageUrl(path, { width, height })}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  )
}
