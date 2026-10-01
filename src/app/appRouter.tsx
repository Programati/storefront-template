import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { routes } from './routes'

// Se crea una sola vez y fuera del árbol de React.
const router = createBrowserRouter(routes)

export function AppRouter() {
  return <RouterProvider router={router} />
}
