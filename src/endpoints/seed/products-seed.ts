import type { Media, Category, Brand } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type ProductArgs = {
  image: Media
  categories: Category[]
  brands: Brand[]
}

export const luxeProducts: (args: ProductArgs) => any[] = ({ image, categories, brands }) => {
  // Add validation to ensure all required references exist
  if (!image || !categories || !brands) {
    throw new Error('Missing required dependencies for products seed')
  }
  
  // Helper function to safely get brand ID
  const getBrandId = (brandName: string) => {
    const brand = brands.find((b) => b.name === brandName)
    if (!brand) {
      console.warn(`Brand not found: ${brandName}`)
      return null
    }
    return brand.id
  }
  
  // Helper function to safely get category IDs
  const getCategoryIds = (categoryNames: string[]) => {
    return categoryNames
      .map(name => {
        const category = categories.find((c) => c.title === name)
        if (!category) {
          console.warn(`Category not found: ${name}`)
          return null
        }
        return category.id
      })
      .filter(Boolean)
  }
  
  return [
    {
      title: 'Ethereal Silk Blazer',
      slug: 'ethereal-silk-blazer',
      categories: getCategoryIds(['Outerwear']),
      brand: getBrandId('Serenity Silk'),
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A sophisticated silk blazer crafted from the finest mulberry silk. Features a tailored fit with subtle draping that flatters every silhouette. Perfect for transitioning from day to evening wear.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', text: 'Features' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• 100% Mulberry Silk\n• Tailored fit with relaxed shoulders\n• Fully lined\n• Two front pockets\n• Single-button closure\n• Dry clean only',
                },
              ],
            },
          ],
        },
      },
      images: [
        {
          image: image.id,
          alt: 'Ethereal silk blazer in champagne color, front view',
          isPrimary: true,
        },
      ],
      colors: [
        {
          colorName: 'Champagne',
          colorCode: '#F7E7CE',
        },
        {
          colorName: 'Midnight Navy',
          colorCode: '#2C3E50',
        },
        {
          colorName: 'Sage Green',
          colorCode: '#9CAF88',
        },
      ],
      sizes: [
        {
          sizeName: 'Extra Small',
          sizeCode: 'XS',
          inStock: true,
          stockQuantity: 5,
        },
        {
          sizeName: 'Small',
          sizeCode: 'S',
          inStock: true,
          stockQuantity: 8,
        },
        {
          sizeName: 'Medium',
          sizeCode: 'M',
          inStock: true,
          stockQuantity: 12,
        },
        {
          sizeName: 'Large',
          sizeCode: 'L',
          inStock: true,
          stockQuantity: 7,
        },
        {
          sizeName: 'Extra Large',
          sizeCode: 'XL',
          inStock: true,
          stockQuantity: 3,
        },
      ],
      price: 28500,
      originalPrice: 35000,
      costPrice: 18000,
      inStock: 35,
      currency: 'KES',
      sku: 'SER-BLZ-ETH-001',
      barcode: '123456789012',
      weight: 0.8,
      dimensions: {
        length: 70,
        width: 50,
        height: 5,
      },
      shippingClass: 'fragile',
      shippingNotes: 'Handle with care. Fragile silk material.',
      meta: {
        title: 'Ethereal Silk Blazer - Serenity Silk Collection',
        description:
          'Sophisticated mulberry silk blazer with tailored fit. Perfect for day to evening wear.',
        image: image.id,
      },
      _status: 'published',
    },
    {
      title: 'Midnight Rose Maxi Dress',
      slug: 'midnight-rose-maxi-dress',
      categories: getCategoryIds(['Dresses']),
      brand: getBrandId('Midnight Rose'),
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A romantic flowing maxi dress featuring delicate floral embroidery and an empire waist. Crafted from premium chiffon for an ethereal, feminine silhouette.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', text: 'Details' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• Premium chiffon fabric\n• Hand-embroidered floral details\n• Empire waist design\n• Full-length flowing skirt\n• Adjustable tie-back closure\n• Lined bodice',
                },
              ],
            },
          ],
        },
      },
      images: [
        {
          image: image.id,
          alt: 'Midnight Rose maxi dress with floral embroidery',
          isPrimary: true,
        },
      ],
      colors: [
        {
          colorName: 'Dusty Rose',
          colorCode: '#D4A5A5',
        },
        {
          colorName: 'Ivory Cream',
          colorCode: '#FFF8DC',
        },
        {
          colorName: 'Lavender Mist',
          colorCode: '#E6E6FA',
        },
      ],
      sizes: [
        {
          sizeName: 'Small',
          sizeCode: 'S',
          inStock: true,
          stockQuantity: 6,
        },
        {
          sizeName: 'Medium',
          sizeCode: 'M',
          inStock: true,
          stockQuantity: 9,
        },
        {
          sizeName: 'Large',
          sizeCode: 'L',
          inStock: true,
          stockQuantity: 8,
        },
        {
          sizeName: 'Extra Large',
          sizeCode: 'XL',
          inStock: true,
          stockQuantity: 4,
        },
      ],
      price: 18900,
      originalPrice: 24500,
      costPrice: 12000,
      inStock: 27,
      currency: 'KES',
      sku: 'MID-DRS-MAX-001',
      barcode: '123456789013',
      weight: 0.6,
      dimensions: {
        length: 140,
        width: 45,
        height: 3,
      },
      shippingClass: 'standard',
      meta: {
        title: 'Midnight Rose Maxi Dress - Romantic Flowing Design',
        description:
          'Romantic maxi dress with floral embroidery and empire waist in premium chiffon.',
        image: image.id,
      },
      _status: 'published',
    },
    {
      title: 'Urban Luxe Leather Jacket',
      slug: 'urban-luxe-leather-jacket',
      categories: getCategoryIds(['Outerwear']),
      brand: getBrandId('Urban Luxe'),
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A statement leather jacket that embodies urban sophistication. Crafted from premium Italian leather with architectural details and modern hardware.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', text: 'Specifications' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• Premium Italian leather\n• Asymmetrical zipper closure\n• Quilted shoulder panels\n• Four exterior pockets\n• Fully lined interior\n• Gunmetal hardware',
                },
              ],
            },
          ],
        },
      },
      images: [
        {
          image: image.id,
          alt: 'Urban Luxe leather jacket in black with modern details',
          isPrimary: true,
        },
      ],
      colors: [
        {
          colorName: 'Jet Black',
          colorCode: '#000000',
        },
        {
          colorName: 'Cognac Brown',
          colorCode: '#8B4513',
        },
        {
          colorName: 'Charcoal Gray',
          colorCode: '#36454F',
        },
      ],
      sizes: [
        {
          sizeName: 'Small',
          sizeCode: 'S',
          inStock: true,
          stockQuantity: 4,
        },
        {
          sizeName: 'Medium',
          sizeCode: 'M',
          inStock: true,
          stockQuantity: 7,
        },
        {
          sizeName: 'Large',
          sizeCode: 'L',
          inStock: true,
          stockQuantity: 6,
        },
        {
          sizeName: 'Extra Large',
          sizeCode: 'XL',
          inStock: true,
          stockQuantity: 3,
        },
      ],
      price: 45000,
      originalPrice: 52000,
      costPrice: 28000,
      inStock: 20,
      currency: 'KES',
      sku: 'URB-JCK-LTH-001',
      barcode: '123456789014',
      weight: 1.8,
      dimensions: {
        length: 65,
        width: 55,
        height: 8,
      },
      shippingClass: 'express',
      shippingNotes: 'High-value item. Signature required.',
      meta: {
        title: 'Urban Luxe Leather Jacket - Premium Italian Leather',
        description:
          'Statement leather jacket in premium Italian leather with architectural details.',
        image: image.id,
      },
      _status: 'published',
    },
    {
      title: 'Celestial Sculptural Top',
      slug: 'celestial-sculptural-top',
      categories: getCategoryIds(['Tops']),
      brand: getBrandId('Celestial Couture'),
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'An avant-garde sculptural top that challenges conventional fashion boundaries. Features geometric cutouts and architectural draping that creates an artistic silhouette.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', text: 'Artistic Elements' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• Geometric cutout design\n• Architectural draping\n• High-performance technical fabric\n• Statement shoulder structure\n• Concealed back closure\n• Limited edition piece',
                },
              ],
            },
          ],
        },
      },
      images: [
        {
          image: image.id,
          alt: 'Celestial sculptural top with geometric design',
          isPrimary: true,
        },
      ],
      colors: [
        {
          colorName: 'Pure White',
          colorCode: '#FFFFFF',
        },
        {
          colorName: 'Deep Black',
          colorCode: '#000000',
        },
        {
          colorName: 'Silver Metallic',
          colorCode: '#C0C0C0',
        },
      ],
      sizes: [
        {
          sizeName: 'Small',
          sizeCode: 'S',
          inStock: true,
          stockQuantity: 2,
        },
        {
          sizeName: 'Medium',
          sizeCode: 'M',
          inStock: true,
          stockQuantity: 3,
        },
        {
          sizeName: 'Large',
          sizeCode: 'L',
          inStock: true,
          stockQuantity: 2,
        },
      ],
      price: 32000,
      originalPrice: 40000,
      costPrice: 20000,
      inStock: 7,
      currency: 'KES',
      sku: 'CEL-TOP-SCU-001',
      barcode: '123456789015',
      weight: 0.5,
      dimensions: {
        length: 60,
        width: 40,
        height: 4,
      },
      shippingClass: 'fragile',
      shippingNotes: 'Artwork piece. Handle with extreme care.',
      meta: {
        title: 'Celestial Sculptural Top - Avant-Garde Fashion Art',
        description: 'Avant-garde sculptural top with geometric cutouts and architectural draping.',
        image: image.id,
      },
      _status: 'published',
    },
    {
      title: 'Aria Cashmere Cardigan',
      slug: 'aria-cashmere-cardigan',
      categories: getCategoryIds(['Knitwear']),
      brand: getBrandId('Aria Elegance'),
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A luxuriously soft cashmere cardigan that epitomizes elegant comfort. Features a relaxed fit with ribbed detailing and horn buttons for a sophisticated finish.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', text: 'Luxury Details' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• 100% Pure Cashmere\n• Relaxed contemporary fit\n• Ribbed cuffs and hem\n• Natural horn buttons\n• Two front pockets\n• Hand wash recommended',
                },
              ],
            },
          ],
        },
      },
      images: [
        {
          image: image.id,
          alt: 'Aria cashmere cardigan in soft beige',
          isPrimary: true,
        },
      ],
      colors: [
        {
          colorName: 'Soft Beige',
          colorCode: '#F5F5DC',
        },
        {
          colorName: 'Camel',
          colorCode: '#C19A6B',
        },
        {
          colorName: 'Charcoal',
          colorCode: '#36454F',
        },
        {
          colorName: 'Cream',
          colorCode: '#FFFDD0',
        },
      ],
      sizes: [
        {
          sizeName: 'Small',
          sizeCode: 'S',
          inStock: true,
          stockQuantity: 8,
        },
        {
          sizeName: 'Medium',
          sizeCode: 'M',
          inStock: true,
          stockQuantity: 12,
        },
        {
          sizeName: 'Large',
          sizeCode: 'L',
          inStock: true,
          stockQuantity: 10,
        },
        {
          sizeName: 'Extra Large',
          sizeCode: 'XL',
          inStock: true,
          stockQuantity: 5,
        },
      ],
      price: 24000,
      originalPrice: 30000,
      costPrice: 15000,
      inStock: 35,
      currency: 'KES',
      sku: 'ARI-CAR-CAS-001',
      barcode: '123456789016',
      weight: 0.7,
      dimensions: {
        length: 65,
        width: 50,
        height: 6,
      },
      shippingClass: 'standard',
      meta: {
        title: 'Aria Cashmere Cardigan - Pure Luxury Comfort',
        description: '100% pure cashmere cardigan with relaxed fit and sophisticated details.',
        image: image.id,
      },
      _status: 'published',
    },
    {
      title: 'Noir Minimalist Trousers',
      slug: 'noir-minimalist-trousers',
      categories: getCategoryIds(['Bottoms']),
      brand: getBrandId('Noir Atelier'),
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Perfectly tailored minimalist trousers that embody understated luxury. Features a straight-leg silhouette with clean lines and premium wool construction.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', text: 'Minimalist Design' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• Premium wool blend\n• Straight-leg cut\n• High-waisted design\n• Side zip closure\n• No visible branding\n• Tailored fit',
                },
              ],
            },
          ],
        },
      },
      images: [
        {
          image: image.id,
          alt: 'Noir minimalist trousers in black',
          isPrimary: true,
        },
      ],
      colors: [
        {
          colorName: 'Black',
          colorCode: '#000000',
        },
        {
          colorName: 'Charcoal',
          colorCode: '#36454F',
        },
        {
          colorName: 'Navy',
          colorCode: '#000080',
        },
      ],
      sizes: [
        {
          sizeName: 'Size 26',
          sizeCode: '26',
          inStock: true,
          stockQuantity: 4,
        },
        {
          sizeName: 'Size 28',
          sizeCode: '28',
          inStock: true,
          stockQuantity: 8,
        },
        {
          sizeName: 'Size 30',
          sizeCode: '30',
          inStock: true,
          stockQuantity: 10,
        },
        {
          sizeName: 'Size 32',
          sizeCode: '32',
          inStock: true,
          stockQuantity: 7,
        },
        {
          sizeName: 'Size 34',
          sizeCode: '34',
          inStock: true,
          stockQuantity: 5,
        },
      ],
      price: 19500,
      originalPrice: 25000,
      costPrice: 12000,
      inStock: 34,
      currency: 'KES',
      sku: 'NOI-TRO-MIN-001',
      barcode: '123456789017',
      weight: 0.9,
      dimensions: {
        length: 100,
        width: 40,
        height: 3,
      },
      shippingClass: 'standard',
      meta: {
        title: 'Noir Minimalist Trousers - Understated Luxury',
        description: 'Perfectly tailored minimalist trousers in premium wool with clean lines.',
        image: image.id,
      },
      _status: 'published',
    },
  ]
}
