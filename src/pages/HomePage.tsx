import { useStoreContent } from '@/app/store'
import { StorePageMeta } from '@/app/StorePageMeta'
import { HomeSections } from './home/HomeSections'

export function HomePage() {
  const { home } = useStoreContent()

  return (
    <>
      <StorePageMeta />
      <HomeSections sections={home.sections} />
    </>
  )
}
