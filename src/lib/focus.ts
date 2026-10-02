// Quita el foco del elemento activo (si hay uno).
export function releaseFocus() {
  const active = document.activeElement
  if (active instanceof HTMLElement) active.blur()
}
