import { SiteBrand } from '@/components/shared/SiteBrand/SiteBrand'
import { SmartImage } from '@/components/shared/SmartImage/SmartImage'
import { useStoreConfig } from './store'
import { useImageResolver } from './useImageResolver'

// Alto del logo en pantalla: h-8 = 2 rem = 32 px.
const LOGO_DISPLAY_HEIGHT = 32

export function StoreBrand() {
  const { storeName, logo } = useStoreConfig()
  const resolver = useImageResolver()

  if (!logo) return <SiteBrand name={storeName} />

  const displayWidth = Math.round(
    (LOGO_DISPLAY_HEIGHT * logo.width) / logo.height,
  )

  return (
    <SiteBrand
      name={storeName}
      showName={logo.showName}
      logo={
        <SmartImage
          path={logo.path}
          // Con el nombre al lado, el logo es decorativo: no se lee dos veces.
          alt={logo.showName ? '' : logo.alt}
          resolver={resolver}
          sizes={`${displayWidth}px`}
          width={logo.width}
          height={logo.height}
          widths={[displayWidth * 2, logo.width]}
          priority
          className="h-8 w-auto"
        />
      }
    />
  )
}
