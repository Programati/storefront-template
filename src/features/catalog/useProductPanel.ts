import { useQueryPanel } from '@/hooks/useQueryPanel'

export function useProductPanel() {
  const { value, open, close } = useQueryPanel('p')
  return { slug: value, open, close }
}
