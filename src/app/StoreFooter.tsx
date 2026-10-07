import { Link } from 'react-router'
import { toast } from 'sonner'
import {
  SiteFooter,
  type FooterSocial,
} from '@/components/shared/SiteFooter/SiteFooter'
import {
  displayPhone,
  internationalPhone,
  whatsappChatUrl,
} from '@/lib/contact/contact'
import { copyToClipboard } from '@/lib/clipboard'
import { parseSocialLink } from '@/lib/social-link/parseSocialLink'
import { StoreBrand } from './StoreBrand'
import { useStoreConfig, useStoreContent } from './store'

export function StoreFooter() {
  const config = useStoreConfig()
  const content = useStoreContent()

  const chatUrl = whatsappChatUrl(config.whatsappNumber)

  // Una URL inválida no se muestra: nunca llega un href sin validar al DOM.
  const socials: FooterSocial[] = []
  const instagram = config.social?.instagram
    ? parseSocialLink('instagram', config.social.instagram)
    : null
  const facebook = config.social?.facebook
    ? parseSocialLink('facebook', config.social.facebook)
    : null
  if (instagram)
    socials.push({ name: 'instagram', label: 'Instagram', href: instagram })
  if (facebook)
    socials.push({ name: 'facebook', label: 'Facebook', href: facebook })

  async function handleCopy() {
    const ok = await copyToClipboard(internationalPhone(config.whatsappNumber))
    if (ok) toast.success('Número copiado')
    else toast.error('No pudimos copiar el número.')
  }

  return (
    <SiteFooter
      brand={
        <Link to="/">
          <StoreBrand priority={false} />
        </Link>
      }
      tagline={config.tagline}
      whatsapp={
        chatUrl
          ? {
              href: chatUrl,
              display: displayPhone(config.whatsappNumber),
              onCopy: handleCopy,
            }
          : undefined
      }
      socials={socials}
      columns={content.footer?.columns}
    />
  )
}
