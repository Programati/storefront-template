import { useState } from 'react'

// Devuelve el valor actual o, si pasó a undefined, el último que tuvo.
// Sirve para que un panel siga mostrando su contenido durante la animación
// de cierre, cuando el dato que lo alimenta ya desapareció de la URL.
export function useLastDefined<T>(value: T | undefined): T | undefined {
  const [last, setLast] = useState(value)
  // Patrón oficial de React para derivar estado de props: se ajusta durante el render.
  if (value !== undefined && value !== last) setLast(value)
  return value ?? last
}
