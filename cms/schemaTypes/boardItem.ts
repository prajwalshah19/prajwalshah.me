import { defineField, defineType } from 'sanity'

export const boardItem = defineType({
  name: 'boardItem',
  title: 'Board Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'photo' },
          { title: 'Book', value: 'book' },
          { title: 'Quote', value: 'quote' },
          { title: 'Song', value: 'song' },
          { title: 'Place', value: 'place' },
          { title: 'Blurb', value: 'blurb' },
          { title: 'Link', value: 'link' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Optional. Used by photo / book / song / place / link tiles.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'creator',
      title: 'Creator',
      type: 'string',
      description: 'Author, artist, source — depends on type.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      description: 'Short commentary or context.',
    }),
    defineField({
      name: 'body',
      title: 'Body (short)',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Short rich text shown inside tiles (blurb / long-form quote). For long-form writing use the Markdown field below.',
    }),
    defineField({
      name: 'markdown',
      title: 'Markdown (long-form)',
      type: 'text',
      rows: 16,
      description:
        'Long-form content rendered on the detail page (/board/:slug). Supports headings, code blocks, tables, etc. Same engine as articles.',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Optional. Opens in a new tab.',
    }),
    defineField({
      name: 'date',
      title: 'Date Added',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured (pin to top)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type', media: 'image' },
  },
})
