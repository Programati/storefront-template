import type { StoreContent } from '@/types'

export const storeContent: StoreContent = {
  home: {
    sections: [
      { type: 'hero', ctaLabel: 'Ver catálogo' },
      { type: 'categories', title: 'Explorá por categoría' },
      { type: 'featured', title: 'Destacados' },
      {
        type: 'howToOrder',
        title: 'Cómo pedir',
        steps: [
          {
            title: 'Elegí tus productos',
            description:
              'Explorá el catálogo y agregá lo que quieras al pedido.',
          },
          {
            title: 'Completá tus datos',
            description: 'Indicá cómo querés recibirlo y cuándo.',
          },
          {
            title: 'Enviá por WhatsApp',
            description: 'Armamos el mensaje y lo mandás para confirmar.',
          },
        ],
      },
      {
        type: 'faq',
        title: 'Preguntas frecuentes',
        items: [
          {
            question: '¿Cómo se paga?',
            answer: 'El pago se coordina por WhatsApp al confirmar el pedido.',
          },
          {
            question: '¿Puedo modificar un pedido ya enviado?',
            answer: 'Sí, escribinos por WhatsApp con el código de tu pedido.',
          },
        ],
      },
    ],
  },
}
