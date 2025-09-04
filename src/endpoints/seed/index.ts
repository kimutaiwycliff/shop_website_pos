import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { luxeBrands } from './brands-seed'
import { luxeProducts } from './products-seed'
import { luxeCustomers } from './customers-seed'
import { luxeOrders } from './orders-seed'
import { luxeInventory } from './inventory-seed'
import { luxeTransactions } from './transactions-seed'
import { luxeCartItems } from './cart-seed'
import { luxeCategories } from './categories-seed'

const collections: CollectionSlug[] = [
  // Delete dependent collections first to avoid foreign key constraint violations
  'cart',
  'transactions', 
  'inventory',
  'orders',
  'products',
  'customers',
  'brands',
  'form-submissions',
  'posts',
  'pages',
  'forms',
  'search',
  'categories',
  'media', // Media last due to foreign key references
]
const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  // await Promise.all(
  //   globals.map((global) =>
  //     payload.updateGlobal({
  //       slug: global,
  //       data: {
  //         navItems: [],
  //       },
  //       depth: 0,
  //       context: {
  //         disableRevalidate: true,
  //       },
  //     }),
  //   ),
  // )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc, ...categoryDocs] =
    await Promise.all([
      payload.create({
        collection: 'users',
        data: {
          name: 'Demo Author',
          email: 'demo-author@example.com',
          password: 'password',
        },
      }),
      payload.create({
        collection: 'media',
        data: image1,
        file: image1Buffer,
      }),
      payload.create({
        collection: 'media',
        data: image2,
        file: image2Buffer,
      }),
      payload.create({
        collection: 'media',
        data: image2,
        file: image3Buffer,
      }),
      payload.create({
        collection: 'media',
        data: imageHero1,
        file: hero1Buffer,
      }),

      // Create categories for boutique
      ...luxeCategories().map((categoryData) =>
        payload.create({
          collection: 'categories',
          data: categoryData,
        }),
      ),
    ])

  payload.logger.info(`— Seeding boutique brands...`)

  // Create brands
  const brandDocs = await Promise.all(
    luxeBrands({ logo: image1Doc }).map((brandData) =>
      payload.create({
        collection: 'brands',
        data: brandData,
      }),
    ),
  )

  payload.logger.info(`— Seeding boutique products...`)

  // Create products
  const productDocs = await Promise.all(
    luxeProducts({ image: image1Doc, categories: categoryDocs, brands: brandDocs }).map(
      (productData) =>
        payload.create({
          collection: 'products',
          data: productData,
        }),
    ),
  )

  payload.logger.info(`— Seeding customers...`)

  // Create customers
  const customerDocs = await Promise.all(
    luxeCustomers().map((customerData) =>
      payload.create({
        collection: 'customers',
        data: customerData,
      }),
    ),
  )

  payload.logger.info(`— Seeding orders...`)

  // Create orders
  const orderDocs = await Promise.all(
    luxeOrders({ customers: customerDocs, products: productDocs }).map((orderData) =>
      payload.create({
        collection: 'orders',
        data: orderData,
      }),
    ),
  )

  payload.logger.info(`— Seeding inventory...`)

  // Create inventory
  await Promise.all(
    luxeInventory({ products: productDocs }).map((inventoryData) =>
      payload.create({
        collection: 'inventory',
        data: inventoryData,
      }),
    ),
  )

  payload.logger.info(`— Seeding transactions...`)

  // Create transactions
  await Promise.all(
    luxeTransactions({ orders: orderDocs }).map((transactionData) =>
      payload.create({
        collection: 'transactions',
        data: transactionData,
      }),
    ),
  )

  payload.logger.info(`— Seeding cart items...`)

  // Create cart items
  await Promise.all(
    luxeCartItems({ customers: customerDocs, products: productDocs }).map((cartData) =>
      payload.create({
        collection: 'cart',
        data: cartData,
      }),
    ),
  )

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Shop',
              url: '/shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Brands',
              url: '/brands',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        copyright: '© 2024 Luxe Boutique. All rights reserved.',
        navItems: [
          {
            title: 'Privacy Policy',
            link: {
              type: 'custom',
              label: 'Privacy Policy',
              url: '/privacy',
            },
          },
          {
            title: 'Terms & Conditions',
            link: {
              type: 'custom',
              label: 'Terms & Conditions',
              url: '/terms',
            },
          },
          {
            title: 'Admin',
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            title: 'Source Code',
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
