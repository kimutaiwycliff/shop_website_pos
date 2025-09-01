import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import admin from '@/access/admin';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: admin,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'subLinks',
          type: 'array',
          label: 'Child Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            condition: (_, siblingData) => {
              // Only show subLinks if the parent link has a URL
              return Boolean(siblingData?.link?.type === 'custom' && siblingData?.link?.url) || 
                     (siblingData?.link?.type === 'reference' && siblingData?.link?.reference?.value);
            },
          },
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
