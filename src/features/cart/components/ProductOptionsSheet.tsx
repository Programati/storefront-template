import { EmptyState } from '@/components/shared/EmptyState/EmptyState'
import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet/ResponsiveSheet'
import { useProductBySlug, useProductPanel } from '@/features/catalog'
import { useLastDefined } from '@/hooks/useLastDefined'
import { ProductOptionsForm } from './ProductOptionsForm'

export function ProductOptionsSheet() {
  const { slug, close } = useProductPanel()
  const product = useProductBySlug(slug ?? '')
  const lastProduct = useLastDefined(product)

  // Con la URL cerrada seguimos mostrando el último producto mientras dura la
  // animación de salida. Con un slug inválido NO: ahí mostramos el aviso.
  const displayed = slug === null ? lastProduct : product

  return (
    <ResponsiveSheet
      open={slug !== null}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      title={displayed?.name ?? 'Producto'}
      description={displayed?.description}
    >
      {displayed ? (
        <ProductOptionsForm
          key={displayed.id}
          product={displayed}
          onAdded={close}
        />
      ) : (
        <div className="p-4">
          <EmptyState
            title="Producto no encontrado"
            description="Puede que el enlace esté desactualizado."
          />
        </div>
      )}
    </ResponsiveSheet>
  )
}
