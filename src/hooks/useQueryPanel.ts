// src/hooks/useQueryPanel.ts
import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

interface PanelNavState {
  panelOpenedInApp?: boolean
}

// Un "panel" (sheet, modal) cuyo estado abierto/cerrado vive en la URL (?key=valor).
export function useQueryPanel(key: string) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const value = searchParams.get(key)

  const open = useCallback(
    (nextValue: string) => {
      // La URL se lee AL LLAMAR, no al renderizar: este callback puede quedar
      // guardado en un toast que sobrevive al componente que lo creó.
      const next = new URLSearchParams(window.location.search)
      next.set(key, nextValue)
      navigate(
        { search: next.toString() },
        // preventScrollReset: abrir un panel no debe llevar la página al tope.
        {
          state: { panelOpenedInApp: true } satisfies PanelNavState,
          preventScrollReset: true,
        },
      )
    },
    [key, navigate],
  )

  const close = useCallback(() => {
    const state = location.state as PanelNavState | null
    if (state?.panelOpenedInApp) {
      navigate(-1)
      return
    }
    // Entraron por un link directo: atrás los sacaría del sitio, así que
    // solo quitamos el parámetro.
    const next = new URLSearchParams(window.location.search)
    next.delete(key)
    navigate(
      { search: next.toString() },
      { replace: true, preventScrollReset: true },
    )
  }, [key, location.state, navigate])

  return { value, isOpen: value !== null, open, close }
}
