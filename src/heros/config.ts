import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'mediaType',
      type: 'select',
      options: [
        { label: 'Image Slider', value: 'slider' },
        { label: 'Single Image', value: 'single' },
        { label: 'Video Background', value: 'video' },
      ],
      defaultValue: 'single',
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        condition: (_, { type, mediaType } = {}) =>
          ['highImpact', 'mediumImpact'].includes(type) && mediaType !== 'slider',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, HeadingFeature(), FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      admin: {
        condition: (_, { type, mediaType } = {}) => type === 'highImpact' && mediaType === 'slider',
      },
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Mobile Image (Optional)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
        },
        linkGroup({
          overrides: {
            maxRows: 2,
          },
        }),
        {
          name: 'textPosition',
          type: 'select',
          label: 'Text Position',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'center',
        },
      ],
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type, mediaType } = {}) =>
            ['highImpact', 'mediumImpact'].includes(type) && mediaType !== 'slider',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type, mediaType } = {}) =>
          ['highImpact', 'mediumImpact'].includes(type) && mediaType !== 'slider',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Enable Autoplay',
      admin: {
        condition: (_, { type, mediaType } = {}) => type === 'highImpact' && mediaType === 'slider',
      },
      defaultValue: true,
    },
    {
      name: 'autoplayDelay',
      type: 'number',
      label: 'Autoplay Delay (seconds)',
      defaultValue: 5,
      admin: {
        condition: (_, { type, mediaType, autoplay } = {}) =>
          type === 'highImpact' && mediaType === 'slider' && autoplay,
      },
    },
  ],
  label: false,
}
