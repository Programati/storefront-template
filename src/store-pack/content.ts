import type { StoreContent } from '@/types'

export const storeContent: StoreContent = {
  demoNotice:
    'Vista de demostración: los pedidos de este sitio no llegan a ningún comercio.',
  home: {
    sections: [
      {
        type: 'hero',
        ctaLabel: 'Ver las delicias',
        banners: [
          {
            path: 'banners/banner-1.webp',
            alt: 'Collage de diez postres, cada uno en su recuadro',
          },
          {
            path: 'banners/banner-2.webp',
            alt: 'Postre individual con una frutilla bañada en chocolate encima',
          },
          {
            path: 'banners/banner-3.webp',
            alt: 'Tres postres servidos en vasitos',
          },
        ],
      },
      { type: 'categories', title: 'Elegí tu antojo' },
      { type: 'featured', title: 'Los favoritos de la casa' },
      {
        type: 'howToOrder',
        title: 'Cómo pedir',
        steps: [
          {
            title: 'Elegí tus dulces',
            description: 'Recorré el catálogo y sumá lo que quieras al pedido.',
          },
          {
            title: 'Contanos cuándo lo necesitás',
            description:
              'Indicá si retirás o te lo llevamos, y la fecha y hora.',
          },
          {
            title: 'Confirmá por WhatsApp',
            description:
              'Armamos el mensaje con tu pedido y lo enviás para coordinar.',
          },
        ],
      },
      {
        type: 'faq',
        title: 'Preguntas frecuentes',
        items: [
          {
            question: '¿Con cuánta anticipación tengo que pedir una torta?',
            answer:
              'Con 48 hs de anticipación. La decoración se coordina por WhatsApp.',
          },
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
