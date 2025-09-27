import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { protectRoles } from '@/access/protectRoles'
import { checkRole } from '@/access/checkRole'
import { User } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  defaultPopulate: {
    slug: true,
    name: true,
  },
  auth: true,
  fields: [
    {
       name: 'active',
       type: 'checkbox',
       defaultValue: false,
     },
     {
       name: 'name',
       type: 'text'
     },
     {
       name: 'avatar',
       type: 'upload',
       relationTo: 'media'
     },
     {
       name: 'roles',
       type: 'select',
       hasMany: true,
       saveToJWT: true,
       options: [
         {label: 'Admin', value: 'admin'},
         {label: 'Editor', value: 'editor'},
         {label: 'Staff', value: 'staff'},
         {label: 'User', value: 'user'},
       ],
       hooks: {
         beforeChange: [protectRoles]
       },
       access: {
         update: ({ req: { user } }) => checkRole(['admin'], user as User),
       }
     },
   ],
   timestamps: true,
}
