import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, meta } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
  }

  // Handle product-specific fields
  if (collection === 'products') {
    const productDoc = originalDoc as any
    modifiedDoc.sku = productDoc.sku
    modifiedDoc.barcode = productDoc.barcode
    modifiedDoc.price = productDoc.price
    modifiedDoc.originalPrice = productDoc.originalPrice
    modifiedDoc.status = productDoc.status
    modifiedDoc.inStock = productDoc.inStock

    // Set search priority based on product status and availability
    let priority = 1
    if (productDoc.status === 'published' && productDoc.inStock > 0) {
      priority = 3 // Highest priority for available products
    } else if (productDoc.status === 'published') {
      priority = 2 // Medium priority for published but out of stock
    }
    modifiedDoc.searchPriority = priority

    // Handle brand information
    if (productDoc.brand && typeof productDoc.brand === 'object') {
      modifiedDoc.brand = {
        name: productDoc.brand.name,
        slug: productDoc.brand.slug,
      }
    }
  }

  // Handle brand-specific fields
  if (collection === 'brands') {
    const brandDoc = originalDoc as any
    modifiedDoc.searchPriority = brandDoc.isActive ? 2 : 1
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}
