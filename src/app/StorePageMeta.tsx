import { PageMeta } from '@/components/shared/PageMeta/PageMeta'
import { buildPageMeta } from '@/lib/page-meta'
import type { PageMetaInput } from '@/lib/page-meta'
import { useStoreConfig } from './store'

export function StorePageMeta(input: PageMetaInput) {
  const config = useStoreConfig()
  return <PageMeta {...buildPageMeta(config, input)} />
}
