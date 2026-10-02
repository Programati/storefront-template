import type { StoreConfig } from '@/types'

type StoreIdentity = Pick<StoreConfig, 'storeName' | 'tagline'>

export type PageMetaInput = {
  pageTitle?: string
  description?: string
  noindex?: boolean
}

export type PageMetaResult = {
  title: string
  description: string
  noindex: boolean
}

export function buildPageMeta(
  store: StoreIdentity,
  input: PageMetaInput = {},
): PageMetaResult {
  const storeName = store.storeName.trim()
  const tagline = store.tagline?.trim()
  const pageTitle = input.pageTitle?.trim()

  const title = pageTitle
    ? `${pageTitle} · ${storeName}`
    : tagline
      ? `${storeName} — ${tagline}`
      : storeName

  const description =
    input.description?.trim() ||
    tagline ||
    `Catálogo online de ${storeName}. Armá tu pedido y envialo por WhatsApp.`

  return { title, description, noindex: input.noindex ?? false }
}
