import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type BrandArgs = {
  logo: Media
}

export const luxeBrands: (args: BrandArgs) => any[] = ({ logo }) => {
  return [
    {
      name: 'Aria Elegance',
      slug: 'aria-elegance',
      description:
        'Sophisticated contemporary fashion for the modern woman. Known for clean lines, luxurious fabrics, and timeless designs.',
      logo: logo.id,
      website: 'https://aria-elegance.com',
      isActive: true,
      contact: {
        email: 'info@aria-elegance.com',
        phone: '+254 20 123 4567',
        address: {
          street: '456 Fashion Avenue',
          city: 'Nairobi',
          country: 'Kenya',
        },
      },
      meta: {
        title: 'Aria Elegance - Contemporary Fashion Brand',
        description:
          'Discover sophisticated contemporary fashion at Aria Elegance. Luxurious fabrics, timeless designs.',
        image: logo.id,
      },
    },
    {
      name: 'Midnight Rose',
      slug: 'midnight-rose',
      description:
        'Romantic and feminine clothing line featuring flowing silhouettes, delicate details, and premium materials.',
      logo: logo.id,
      website: 'https://midnight-rose.co.ke',
      isActive: true,
      contact: {
        email: 'hello@midnight-rose.co.ke',
        phone: '+254 71 987 6543',
        address: {
          street: '78 Rose Garden Lane',
          city: 'Nairobi',
          country: 'Kenya',
        },
      },
      meta: {
        title: 'Midnight Rose - Romantic Fashion Collection',
        description:
          'Feminine clothing with flowing silhouettes and delicate details. Premium materials and romantic designs.',
        image: logo.id,
      },
    },
    {
      name: 'Urban Luxe',
      slug: 'urban-luxe',
      description:
        'Street-inspired luxury fashion that blends comfort with high-end style. Perfect for the modern urbanite.',
      logo: logo.id,
      website: 'https://urban-luxe.ke',
      isActive: true,
      contact: {
        email: 'contact@urban-luxe.ke',
        phone: '+254 72 456 7890',
        address: {
          street: '234 City Center Plaza',
          city: 'Nairobi',
          country: 'Kenya',
        },
      },
      meta: {
        title: 'Urban Luxe - Street-Inspired Luxury Fashion',
        description:
          'Luxury streetwear combining comfort with high-end style for modern urbanites.',
        image: logo.id,
      },
    },
    {
      name: 'Celestial Couture',
      slug: 'celestial-couture',
      description:
        'Avant-garde fashion house creating artistic pieces that blur the line between fashion and art.',
      logo: logo.id,
      website: 'https://celestial-couture.com',
      isActive: true,
      contact: {
        email: 'atelier@celestial-couture.com',
        phone: '+254 20 789 0123',
        address: {
          street: '12 Artisan Quarter',
          city: 'Nairobi',
          country: 'Kenya',
        },
      },
      meta: {
        title: 'Celestial Couture - Avant-Garde Fashion House',
        description:
          'Artistic fashion pieces that blur the line between fashion and art. Avant-garde designs.',
        image: logo.id,
      },
    },
    {
      name: 'Serenity Silk',
      slug: 'serenity-silk',
      description:
        'Luxury silk specialists creating ethereal garments with focus on natural fibers and sustainable practices.',
      logo: logo.id,
      website: 'https://serenity-silk.co.ke',
      isActive: true,
      contact: {
        email: 'info@serenity-silk.co.ke',
        phone: '+254 73 234 5678',
        address: {
          street: '89 Silk Road',
          city: 'Nairobi',
          country: 'Kenya',
        },
      },
      meta: {
        title: 'Serenity Silk - Luxury Silk Specialists',
        description:
          'Ethereal silk garments focusing on natural fibers and sustainable fashion practices.',
        image: logo.id,
      },
    },
    {
      name: 'Noir Atelier',
      slug: 'noir-atelier',
      description:
        'Minimalist luxury brand specializing in black and monochromatic pieces with architectural silhouettes.',
      logo: logo.id,
      website: 'https://noir-atelier.com',
      isActive: true,
      contact: {
        email: 'studio@noir-atelier.com',
        phone: '+254 74 345 6789',
        address: {
          street: '567 Design District',
          city: 'Nairobi',
          country: 'Kenya',
        },
      },
      meta: {
        title: 'Noir Atelier - Minimalist Luxury Fashion',
        description:
          'Minimalist luxury specializing in monochromatic pieces with architectural silhouettes.',
        image: logo.id,
      },
    },
  ]
}
