import type { Block } from 'payload'

export const DataTableBlock: Block = {
  slug: 'dataTable',
  interfaceName: 'DataTableBlock',
  labels: {
    singular: 'Data Table',
    plural: 'Data Tables',
  },
  fields: [
    {
      name: 'targetCollection',
      type: 'select',
      required: true,
      options: [
        { label: 'Customers', value: 'customers' },
        { label: 'Posts', value: 'posts' },
        { label: 'Pages', value: 'pages' },
        { label: 'Categories', value: 'categories' },
      ],
    },
    {
      name: 'filters',
      type: 'array',
      label: 'Filters',
      fields: [
        {
          name: 'column',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'options',
          type: 'array',
          required: false,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'defaultPageSize',
      type: 'number',
      required: false,
      defaultValue: 10,
    },
  ],
}
