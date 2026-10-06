import type { Catalog } from '@/types'

export const catalog: Catalog = {
  categories: [
    { id: 'cat-budines', slug: 'budines', name: 'Budines y brownies' },
    { id: 'cat-tartas', slug: 'tartas', name: 'Tartas y tortas' },
    { id: 'cat-dulces', slug: 'dulces', name: 'Dulces' },
  ],
  products: [
    {
      id: 'prod-budin-limon',
      slug: 'budin-de-limon',
      name: 'Budín de limón',
      description: 'Budín húmedo con aroma a limón, por porción o entero.',
      categoryId: 'cat-budines',
      image: {
        path: 'products/budin-de-limon.webp',
        alt: 'Rebanadas de budín cítrico sobre una tabla',
      },
      variantLabel: 'Presentación',
      variants: [
        { id: 'budin-porcion', label: 'Porción', price: 1800 },
        { id: 'budin-entero', label: 'Entero', price: 9500 },
      ],
      optionGroups: [],
      details: { 'El entero rinde': '8 porciones' },
      featured: true,
    },
    {
      id: 'prod-pastafrola',
      slug: 'pastafrola',
      name: 'Pastafrola',
      description: 'Tarta de masa sablée con relleno a elección.',
      categoryId: 'cat-tartas',
      image: {
        path: 'products/pastafrola.webp',
        alt: 'Tarta con enrejado de masa y relleno dulce',
      },
      variantLabel: 'Presentación',
      variants: [
        { id: 'pastafrola-porcion', label: 'Porción', price: 1600 },
        { id: 'pastafrola-entera', label: 'Entera', price: 11000 },
      ],
      optionGroups: [
        {
          id: 'pastafrola-relleno',
          label: 'Relleno',
          type: 'single',
          required: true,
          choices: [
            { id: 'relleno-membrillo', label: 'Membrillo' },
            { id: 'relleno-batata', label: 'Batata' },
            {
              id: 'relleno-ddl',
              label: 'Dulce de leche',
              priceDelta: 800,
            },
          ],
        },
      ],
    },
    {
      id: 'prod-alfajores',
      slug: 'alfajores-de-maicena',
      name: 'Alfajores de maicena',
      description: 'Alfajores con dulce de leche y coco rallado.',
      categoryId: 'cat-dulces',
      image: {
        path: 'products/alfajores-de-maicena.webp',
        alt: 'Alfajores rellenos con borde de coco',
      },
      variantLabel: 'Cantidad',
      variants: [
        { id: 'alfajor-unidad', label: 'Unidad', price: 900 },
        { id: 'alfajor-media-docena', label: 'Media docena', price: 5000 },
        { id: 'alfajor-docena', label: 'Docena', price: 9000 },
      ],
      optionGroups: [],
    },
    {
      id: 'prod-torta-cumple',
      slug: 'torta-de-cumple',
      name: 'Torta de cumpleaños',
      description: 'Torta decorada para festejos. Se pide con anticipación.',
      categoryId: 'cat-tartas',
      image: {
        path: 'products/torta-de-cumple.webp',
        alt: 'Torta decorada lista para un festejo',
      },
      gallery: [
        {
          path: 'products/torta-de-cumple-2.webp',
          alt: 'Torta decorada vista de costado',
        },
        {
          path: 'products/torta-de-cumple-3.webp',
          alt: 'Detalle de la decoración de la torta',
        },
      ],
      variantLabel: 'Tamaño',
      variants: [
        { id: 'torta-8', label: '8 porciones', price: 18000 },
        { id: 'torta-12', label: '12 porciones', price: 26000 },
        { id: 'torta-16', label: '16 porciones', price: 34000 },
      ],
      optionGroups: [
        {
          id: 'torta-sabor',
          label: 'Sabor',
          type: 'single',
          required: true,
          choices: [
            { id: 'sabor-vainilla', label: 'Vainilla' },
            { id: 'sabor-chocolate', label: 'Chocolate' },
            { id: 'sabor-ddl', label: 'Dulce de leche' },
          ],
        },
        {
          id: 'torta-extras',
          label: 'Extras',
          type: 'multiple',
          required: false,
          choices: [
            {
              id: 'extra-cartel',
              label: 'Cartel con nombre',
              priceDelta: 1500,
            },
            { id: 'extra-velas', label: 'Velas', priceDelta: 500 },
            { id: 'extra-tarjeta', label: 'Tarjeta', priceDelta: 700 },
          ],
        },
      ],
      details: {
        Anticipación: '48 hs',
        Decoración: 'A coordinar por WhatsApp',
      },
      featured: true,
    },
    {
      id: 'prod-dulce-leche',
      slug: 'dulce-de-leche',
      name: 'Dulce de leche artesanal',
      description: 'Dulce de leche casero, se vende por peso.',
      categoryId: 'cat-dulces',
      image: {
        path: 'products/dulce-de-leche.webp',
        alt: 'Frasco de dulce de leche cremoso',
      },
      variantLabel: 'Peso',
      variants: [
        { id: 'ddl-250', label: '1/4 kg', price: 4500 },
        { id: 'ddl-500', label: '1/2 kg', price: 8500 },
        { id: 'ddl-1000', label: '1 kg', price: 16000 },
      ],
      optionGroups: [],
    },
    {
      id: 'prod-brownie',
      slug: 'brownie',
      name: 'Brownie',
      description: 'Brownie de chocolate, húmedo por dentro.',
      categoryId: 'cat-budines',
      image: {
        path: 'products/brownie.webp',
        alt: 'Cuadrados de chocolate con textura densa',
      },
      variants: [{ id: 'brownie-unidad', label: 'Unidad', price: 2200 }],
      optionGroups: [],
    },
    {
      id: 'prod-cheesecake',
      slug: 'cheesecake',
      name: 'Cheesecake',
      description: 'Cheesecake cremoso con base de galletitas.',
      categoryId: 'cat-tartas',
      image: {
        path: 'products/cheesecake.webp',
        alt: 'Tarta cremosa de queso con base crocante',
      },
      variants: [{ id: 'cheesecake-entero', label: 'Entero', price: 15000 }],
      optionGroups: [],
      soldOut: true,
    },
    {
      id: 'prod-caja-regalo',
      slug: 'caja-de-regalo',
      name: 'Caja de regalo',
      description: 'Surtido de dulces para regalar, en caja.',
      categoryId: 'cat-dulces',
      image: {
        path: 'products/caja-de-regalo.webp',
        alt: 'Caja con surtido de dulces para regalo',
      },
      variants: [{ id: 'caja-surtido', label: 'Surtido', price: 14000 }],
      optionGroups: [
        {
          id: 'caja-extras',
          label: 'Para regalo',
          type: 'multiple',
          required: false,
          choices: [{ id: 'caja-tarjeta', label: 'Incluir tarjeta' }],
        },
      ],
      details: { Contenido: 'Surtido de la casa', 'Ideal para': 'Regalos' },
      featured: true,
    },
  ],
  pricingRules: [
    {
      id: 'promo-alfajor-unidad',
      match: { variantIds: ['alfajor-unidad'] },
      tiers: [
        { minQty: 4, unitPrice: 850 },
        { minQty: 8, unitPrice: 800 },
      ],
    },
  ],
}
