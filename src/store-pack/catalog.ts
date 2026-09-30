import type { Catalog } from '@/types'

export const catalog: Catalog = {
  categories: [
    { id: 'cat-a', slug: 'categoria-a', name: 'Categoría A' },
    { id: 'cat-b', slug: 'categoria-b', name: 'Categoría B' },
  ],
  products: [
    {
      id: 'prod-1',
      slug: 'producto-alfa',
      name: 'Producto Alfa',
      description:
        'Producto de ejemplo con variantes y una opción con costo extra.',
      categoryId: 'cat-a',
      image: { path: 'demo/alfa.jpg', alt: 'Producto Alfa' },
      variantLabel: 'Tamaño',
      variants: [
        { id: 'alfa-chico', label: 'Chico', price: 4500 },
        { id: 'alfa-grande', label: 'Grande', price: 8000 },
      ],
      optionGroups: [
        {
          id: 'opcion',
          label: 'Opción obligatoria',
          type: 'single',
          required: true,
          choices: [
            { id: 'op-a', label: 'Opción A' },
            { id: 'op-b', label: 'Opción B' },
          ],
        },
        {
          id: 'extra',
          label: 'Extra',
          type: 'multiple',
          required: false,
          choices: [
            { id: 'extra-1', label: 'Agregado 1', priceDelta: 500 },
            { id: 'extra-2', label: 'Agregado 2', priceDelta: 800 },
          ],
        },
      ],
      details: { atributo: 'valor de ejemplo' },
    },
    {
      id: 'prod-2',
      slug: 'producto-beta',
      name: 'Producto Beta',
      description: 'Producto de ejemplo sin opciones, marcado como agotado.',
      categoryId: 'cat-b',
      image: { path: 'demo/beta.jpg', alt: 'Producto Beta' },
      variants: [{ id: 'beta-unico', label: 'Único', price: 6000 }],
      optionGroups: [],
      soldOut: true,
    },
    {
      id: 'prod-3',
      slug: 'producto-gamma',
      name: 'Producto Gamma',
      description:
        'Producto simple, sin variantes ni opciones — se agrega directo.',
      categoryId: 'cat-a',
      image: { path: 'demo/gamma.jpg', alt: 'Producto Gamma' },
      variants: [{ id: 'gamma-unico', label: 'Único', price: 3000 }],
      optionGroups: [],
      // soldOut: true,
    },
  ],
  pricingRules: [
    {
      id: 'promo-alfa-grande',
      match: { variantIds: ['alfa-grande'] },
      tiers: [
        { minQty: 4, unitPrice: 7500 },
        { minQty: 6, unitPrice: 7000 },
      ],
    },
  ],
}
