import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

interface PanelNavState {
  panelOpenedInApp?: boolean
}

// Un "panel" (sheet, modal) cuyo estado abierto/cerrado vive en la URL (?key=valor).
export function useQueryPanel(key: string) {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = searchParams.get(key)

  const open = useCallback(
    (nextValue: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(key, nextValue)
          return next
        },
        // Marca en el historial: "este panel lo abrió la app", así sabemos que
        // volver atrás es una forma segura de cerrarlo.
        { state: { panelOpenedInApp: true } satisfies PanelNavState },
      )
    },
    [key, setSearchParams],
  )

  const close = useCallback(() => {
    const state = location.state as PanelNavState | null
    if (state?.panelOpenedInApp) {
      navigate(-1)
      return
    }
    // Entraron por un link directo: atrás los sacaría del sitio, así que
    // solo quitamos el parámetro.
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(key)
        return next
      },
      { replace: true },
    )
  }, [key, location.state, navigate, setSearchParams])

  return { value, isOpen: value !== null, open, close }
}
