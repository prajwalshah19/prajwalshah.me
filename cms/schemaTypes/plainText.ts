// studio-praj-portfolio/schemaTypes/plainLink.ts
import { defineField, defineType } from 'sanity'

export const plainText = defineType({
  name: 'plainText',
  title: 'Plain Text',
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
      type: 'string', 
      validation: (rule) => rule.required(),
    }),
  ],
})
