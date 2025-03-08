import { defineField, defineType } from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text content (supports bold, italic, etc.)',
      validation: (rule) => rule.required(),
    }),
  ],
})
