// studio-praj-portfolio/schemaTypes/article.ts
import { defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
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
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'comingSoon',
      title: 'Coming soon',
      type: 'boolean',
      initialValue: false,
      description: 'Show the title with Coming soon until the article is ready.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'A short excerpt or summary of the article',
      validation: (rule) => rule.custom((value, context) =>
        context.document?.comingSoon || value?.length ? true : 'Add an excerpt',
      ),
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'date',
      validation: (rule) => rule.custom((value, context) =>
        context.document?.comingSoon || value ? true : 'Add a publication date',
      ),
    }),
    defineField({
      name: 'link',
      title: 'Article Link',
      type: 'string',
      validation: (rule) => rule.custom((value, context) =>
        context.document?.comingSoon || value ? true : 'Add an article link',
      ),
    }),
    defineField({
      name: 'content',
      title: 'Article Content',
      type: 'text',
      validation: (rule) => rule.custom((value, context) =>
        context.document?.comingSoon || value ? true : 'Add article content',
      ),
    }),
  ],
})
