// studio-praj-portfolio/schemaTypes/project.ts
import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Project Link',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text description of the project',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      type: 'string',
      description: 'Date range (e.g. "Jan 2021 - Present")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Tags associated with the project',
    }),
  ],
})
