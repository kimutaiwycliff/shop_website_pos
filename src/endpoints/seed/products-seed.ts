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
      .map((name) => {
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
      // Updated to use variants instead of separate colors and sizes
      variants: [
        {
          color: 'Champagne',
          size: 'XS',
          sku: 'SER-BLZ-ETH-001-CH-XS',
          stock: 5,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Champagne',
          size: 'S',
          sku: 'SER-BLZ-ETH-001-CH-S',
          stock: 8,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Champagne',
          size: 'M',
          sku: 'SER-BLZ-ETH-001-CH-M',
          stock: 12,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Champagne',
          size: 'L',
          sku: 'SER-BLZ-ETH-001-CH-L',
          stock: 7,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Champagne',
          size: 'XL',
          sku: 'SER-BLZ-ETH-001-CH-XL',
          stock: 3,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Midnight Navy',
          size: 'XS',
          sku: 'SER-BLZ-ETH-001-MN-XS',
          stock: 5,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Midnight Navy',
          size: 'S',
          sku: 'SER-BLZ-ETH-001-MN-S',
          stock: 8,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Midnight Navy',
          size: 'M',
          sku: 'SER-BLZ-ETH-001-MN-M',
          stock: 12,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Midnight Navy',
          size: 'L',
          sku: 'SER-BLZ-ETH-001-MN-L',
          stock: 7,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Midnight Navy',
          size: 'XL',
          sku: 'SER-BLZ-ETH-001-MN-XL',
          stock: 3,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Sage Green',
          size: 'XS',
          sku: 'SER-BLZ-ETH-001-SG-XS',
          stock: 5,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Sage Green',
          size: 'S',
          sku: 'SER-BLZ-ETH-001-SG-S',
          stock: 8,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Sage Green',
          size: 'M',
          sku: 'SER-BLZ-ETH-001-SG-M',
          stock: 12,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Sage Green',
          size: 'L',
          sku: 'SER-BLZ-ETH-001-SG-L',
          stock: 7,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
        {
          color: 'Sage Green',
          size: 'XL',
          sku: 'SER-BLZ-ETH-001-SG-XL',
          stock: 3,
          price: 28500,
          costPrice: 18000,
          isActive: true,
        },
      ],
      price: 28500,
      originalPrice: 35000,
      costPrice: 18000,
      inStock: 35, // Will be calculated from variants
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
      // Updated to use variants instead of separate colors and sizes
      variants: [
        {
          color: 'Dusty Rose',
          size: 'S',
          sku: 'MID-DRS-MAX-001-DR-S',
          stock: 6,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Dusty Rose',
          size: 'M',
          sku: 'MID-DRS-MAX-001-DR-M',
          stock: 9,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Dusty Rose',
          size: 'L',
          sku: 'MID-DRS-MAX-001-DR-L',
          stock: 8,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Dusty Rose',
          size: 'XL',
          sku: 'MID-DRS-MAX-001-DR-XL',
          stock: 4,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Ivory Cream',
          size: 'S',
          sku: 'MID-DRS-MAX-001-IC-S',
          stock: 6,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Ivory Cream',
          size: 'M',
          sku: 'MID-DRS-MAX-001-IC-M',
          stock: 9,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Ivory Cream',
          size: 'L',
          sku: 'MID-DRS-MAX-001-IC-L',
          stock: 8,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Ivory Cream',
          size: 'XL',
          sku: 'MID-DRS-MAX-001-IC-XL',
          stock: 4,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Lavender Mist',
          size: 'S',
          sku: 'MID-DRS-MAX-001-LM-S',
          stock: 6,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Lavender Mist',
          size: 'M',
          sku: 'MID-DRS-MAX-001-LM-M',
          stock: 9,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Lavender Mist',
          size: 'L',
          sku: 'MID-DRS-MAX-001-LM-L',
          stock: 8,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Lavender Mist',
          size: 'XL',
          sku: 'MID-DRS-MAX-001-LM-XL',
          stock: 4,
          price: 18900,
          costPrice: 12000,
          isActive: true,
        },
      ],
      price: 18900,
      originalPrice: 24500,
      costPrice: 12000,
      inStock: 27, // Will be calculated from variants
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
      // Updated to use variants instead of separate colors and sizes
      variants: [
        {
          color: 'Jet Black',
          size: 'S',
          sku: 'URB-JCK-LTH-001-JB-S',
          stock: 4,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Jet Black',
          size: 'M',
          sku: 'URB-JCK-LTH-001-JB-M',
          stock: 7,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Jet Black',
          size: 'L',
          sku: 'URB-JCK-LTH-001-JB-L',
          stock: 6,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Jet Black',
          size: 'XL',
          sku: 'URB-JCK-LTH-001-JB-XL',
          stock: 3,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Cognac Brown',
          size: 'S',
          sku: 'URB-JCK-LTH-001-CB-S',
          stock: 4,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Cognac Brown',
          size: 'M',
          sku: 'URB-JCK-LTH-001-CB-M',
          stock: 7,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Cognac Brown',
          size: 'L',
          sku: 'URB-JCK-LTH-001-CB-L',
          stock: 6,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Cognac Brown',
          size: 'XL',
          sku: 'URB-JCK-LTH-001-CB-XL',
          stock: 3,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Charcoal Gray',
          size: 'S',
          sku: 'URB-JCK-LTH-001-CG-S',
          stock: 4,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Charcoal Gray',
          size: 'M',
          sku: 'URB-JCK-LTH-001-CG-M',
          stock: 7,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Charcoal Gray',
          size: 'L',
          sku: 'URB-JCK-LTH-001-CG-L',
          stock: 6,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
        {
          color: 'Charcoal Gray',
          size: 'XL',
          sku: 'URB-JCK-LTH-001-CG-XL',
          stock: 3,
          price: 45000,
          costPrice: 28000,
          isActive: true,
        },
      ],
      price: 45000,
      originalPrice: 52000,
      costPrice: 28000,
      inStock: 20, // Will be calculated from variants
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
      // Updated to use variants instead of separate colors and sizes
      variants: [
        {
          color: 'Pure White',
          size: 'S',
          sku: 'CEL-TOP-SCU-001-PW-S',
          stock: 2,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Pure White',
          size: 'M',
          sku: 'CEL-TOP-SCU-001-PW-M',
          stock: 3,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Pure White',
          size: 'L',
          sku: 'CEL-TOP-SCU-001-PW-L',
          stock: 2,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Deep Black',
          size: 'S',
          sku: 'CEL-TOP-SCU-001-DB-S',
          stock: 2,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Deep Black',
          size: 'M',
          sku: 'CEL-TOP-SCU-001-DB-M',
          stock: 3,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Deep Black',
          size: 'L',
          sku: 'CEL-TOP-SCU-001-DB-L',
          stock: 2,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Silver Metallic',
          size: 'S',
          sku: 'CEL-TOP-SCU-001-SM-S',
          stock: 2,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Silver Metallic',
          size: 'M',
          sku: 'CEL-TOP-SCU-001-SM-M',
          stock: 3,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
        {
          color: 'Silver Metallic',
          size: 'L',
          sku: 'CEL-TOP-SCU-001-SM-L',
          stock: 2,
          price: 32000,
          costPrice: 20000,
          isActive: true,
        },
      ],
      price: 32000,
      originalPrice: 40000,
      costPrice: 20000,
      inStock: 7, // Will be calculated from variants
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
      // Updated to use variants instead of separate colors and sizes
      variants: [
        {
          color: 'Soft Beige',
          size: 'S',
          sku: 'ARI-CAR-CAS-001-SB-S',
          stock: 8,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Soft Beige',
          size: 'M',
          sku: 'ARI-CAR-CAS-001-SB-M',
          stock: 12,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Soft Beige',
          size: 'L',
          sku: 'ARI-CAR-CAS-001-SB-L',
          stock: 10,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Soft Beige',
          size: 'XL',
          sku: 'ARI-CAR-CAS-001-SB-XL',
          stock: 5,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Camel',
          size: 'S',
          sku: 'ARI-CAR-CAS-001-C-S',
          stock: 8,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Camel',
          size: 'M',
          sku: 'ARI-CAR-CAS-001-C-M',
          stock: 12,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Camel',
          size: 'L',
          sku: 'ARI-CAR-CAS-001-C-L',
          stock: 10,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Camel',
          size: 'XL',
          sku: 'ARI-CAR-CAS-001-C-XL',
          stock: 5,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: 'S',
          sku: 'ARI-CAR-CAS-001-CH-S',
          stock: 8,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: 'M',
          sku: 'ARI-CAR-CAS-001-CH-M',
          stock: 12,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: 'L',
          sku: 'ARI-CAR-CAS-001-CH-L',
          stock: 10,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: 'XL',
          sku: 'ARI-CAR-CAS-001-CH-XL',
          stock: 5,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Cream',
          size: 'S',
          sku: 'ARI-CAR-CAS-001-CR-S',
          stock: 8,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Cream',
          size: 'M',
          sku: 'ARI-CAR-CAS-001-CR-M',
          stock: 12,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Cream',
          size: 'L',
          sku: 'ARI-CAR-CAS-001-CR-L',
          stock: 10,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
        {
          color: 'Cream',
          size: 'XL',
          sku: 'ARI-CAR-CAS-001-CR-XL',
          stock: 5,
          price: 24000,
          costPrice: 15000,
          isActive: true,
        },
      ],
      price: 24000,
      originalPrice: 30000,
      costPrice: 15000,
      inStock: 35, // Will be calculated from variants
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
      // Updated to use variants instead of separate colors and sizes
      variants: [
        {
          color: 'Black',
          size: '26',
          sku: 'NOI-TRO-MIN-001-B-26',
          stock: 4,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Black',
          size: '28',
          sku: 'NOI-TRO-MIN-001-B-28',
          stock: 8,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Black',
          size: '30',
          sku: 'NOI-TRO-MIN-001-B-30',
          stock: 10,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Black',
          size: '32',
          sku: 'NOI-TRO-MIN-001-B-32',
          stock: 7,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Black',
          size: '34',
          sku: 'NOI-TRO-MIN-001-B-34',
          stock: 5,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: '26',
          sku: 'NOI-TRO-MIN-001-C-26',
          stock: 4,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: '28',
          sku: 'NOI-TRO-MIN-001-C-28',
          stock: 8,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: '30',
          sku: 'NOI-TRO-MIN-001-C-30',
          stock: 10,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: '32',
          sku: 'NOI-TRO-MIN-001-C-32',
          stock: 7,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Charcoal',
          size: '34',
          sku: 'NOI-TRO-MIN-001-C-34',
          stock: 5,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Navy',
          size: '26',
          sku: 'NOI-TRO-MIN-001-N-26',
          stock: 4,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Navy',
          size: '28',
          sku: 'NOI-TRO-MIN-001-N-28',
          stock: 8,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Navy',
          size: '30',
          sku: 'NOI-TRO-MIN-001-N-30',
          stock: 10,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Navy',
          size: '32',
          sku: 'NOI-TRO-MIN-001-N-32',
          stock: 7,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
        {
          color: 'Navy',
          size: '34',
          sku: 'NOI-TRO-MIN-001-N-34',
          stock: 5,
          price: 19500,
          costPrice: 12000,
          isActive: true,
        },
      ],
      price: 19500,
      originalPrice: 25000,
      costPrice: 12000,
      inStock: 34, // Will be calculated from variants
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
