// ⚠️ TEMPORAL: esta implementación arma un placeholder a partir del nombre del
// archivo, solo para poder maquetar sin fotos reales. En la Fase 10 la
// reemplazamos por la URL real del proveedor de imágenes (ImageKit/Cloudinary),
// y ningún componente que la use va a tener que cambiar.
interface ImageUrlOptions {
  width?: number
  height?: number
}

export function imageUrl(
  path: string,
  { width = 400, height = 400 }: ImageUrlOptions = {},
): string {
  const label = encodeURIComponent(path.split('/').pop() ?? 'img')
  return `https://placehold.co/${width}x${height}?text=${label}`
}
