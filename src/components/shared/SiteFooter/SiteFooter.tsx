import { Copy } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  BrandIcon,
  type BrandName,
} from '@/components/shared/BrandIcon/BrandIcon'
import { Button } from '@/components/ui/button'
import type { FooterColumn } from '@/types'

export interface FooterSocial {
  name: BrandName
  label: string
  href: string
}

export interface FooterWhatsApp {
  href: string
  display: string
  onCopy: () => void
}

interface SiteFooterProps {
  brand: ReactNode
  tagline?: string
  whatsapp?: FooterWhatsApp
  socials?: FooterSocial[]
  columns?: FooterColumn[]
}

const linkClass = 'inline-flex items-center gap-2 hover:underline'
const NEW_TAB = <span className="sr-only"> (se abre en una pestaña nueva)</span>

export function SiteFooter({
  brand,
  tagline,
  whatsapp,
  socials = [],
  columns = [],
}: SiteFooterProps) {
  const hasContact = Boolean(whatsapp) || socials.length > 0

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="text-lg font-bold">{brand}</div>
          {tagline && (
            <p className="text-sm text-muted-foreground">{tagline}</p>
          )}
        </div>

        {hasContact && (
          <section aria-labelledby="footer-contacto" className="space-y-3">
            <h2 id="footer-contacto" className="text-sm font-semibold">
              Contacto
            </h2>
            <ul className="space-y-2 text-sm">
              {whatsapp && (
                <li className="flex flex-wrap items-center gap-2">
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <BrandIcon name="whatsapp" className="size-4" />
                    <span>WhatsApp: {whatsapp.display}</span>
                    {NEW_TAB}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={whatsapp.onCopy}
                    aria-label="Copiar número de WhatsApp"
                  >
                    <Copy className="size-3.5" aria-hidden="true" />
                    Copiar
                  </Button>
                </li>
              )}
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <BrandIcon name={social.name} className="size-4" />
                    <span>{social.label}</span>
                    {NEW_TAB}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {columns.map((column) => (
          <section key={column.title} className="space-y-3">
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {column.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </footer>
  )
}
