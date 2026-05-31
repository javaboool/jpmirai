import type { CollectionConfig } from 'payload'

export const Notices: CollectionConfig = {
  slug: 'notices',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedAt', type: 'date', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
