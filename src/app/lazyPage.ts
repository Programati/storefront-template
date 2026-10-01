import type { ComponentType } from 'react'

// Una página "lazy" viaja en su propio archivo, que solo se descarga al visitar
// la ruta. Así la carga inicial no incluye páginas que quizá nadie abra.
export function lazyPage<K extends string>(
  load: () => Promise<Record<K, ComponentType>>,
  exportName: K,
) {
  return {
    lazy: async () => ({ Component: (await load())[exportName] }),
  }
}
