import type { RouteObject } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { lazyPage } from './lazyPage'
import { PageSpinner } from './PageSpinner'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    HydrateFallback: PageSpinner,
    ErrorBoundary: RouteError, // errores del propio layout (raros)
    children: [
      {
        // Ruta sin path: solo existe para atrapar errores de las páginas
        // DENTRO del layout, así el header y el carrito siguen visibles.
        ErrorBoundary: RouteError,
        children: [
          { index: true, Component: HomePage }, // la home no es lazy: es la entrada de casi todos
          // `:categorySlug?` es opcional: una sola ruta sirve para /catalogo y /catalogo/x,
          // así el estado de la página (la búsqueda) no se pierde al cambiar de categoría.
          {
            path: 'catalogo/:categorySlug?',
            ...lazyPage(() => import('@/pages/CatalogPage'), 'CatalogPage'),
          },
          {
            path: 'pedido',
            ...lazyPage(() => import('@/pages/CheckoutPage'), 'CheckoutPage'),
          },
          {
            path: 'gracias',
            ...lazyPage(() => import('@/pages/ThanksPage'), 'ThanksPage'),
          },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]
