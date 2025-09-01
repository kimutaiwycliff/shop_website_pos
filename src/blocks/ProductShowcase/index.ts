import type { Block } from "payload"

export const ProductShowcase: Block = {
  slug: "productShowcase",
  interfaceName: "ProductShowcaseBlock",
  labels: {
    singular: "Product Showcase",
    plural: "Product Showcases",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Section Title",
    },
    {
      name: "subtitle",
      type: "textarea",
      label: "Section Subtitle",
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        {
          label: "Grid Layout",
          value: "grid",
        },
        {
          label: "Featured Layout",
          value: "featured",
        },
        {
          label: "Carousel Layout",
          value: "carousel",
        },
      ],
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      required: true,
    },
    {
      name: "showPricing",
      type: "checkbox",
      defaultValue: true,
      label: "Show Product Pricing",
    },
    {
      name: "showDescription",
      type: "checkbox",
      defaultValue: true,
      label: "Show Product Descriptions",
    },
  ],
}
