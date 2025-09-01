import type { Block } from "payload"

export const CategoryHero: Block = {
  slug: "categoryHero",
  interfaceName: "CategoryHeroBlock",
  labels: {
    singular: "Category Hero",
    plural: "Category Heroes",
  },
  fields: [
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "showProductCount",
      type: "checkbox",
      defaultValue: true,
      label: "Show Product Count",
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "centered",
      options: [
        {
          label: "Centered",
          value: "centered",
        },
        {
          label: "Left Aligned",
          value: "left",
        },
        {
          label: "Right Aligned",
          value: "right",
        },
      ],
    },
  ],
}
