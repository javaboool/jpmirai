import type { CollectionConfig } from 'payload'

export const UserProfiles: CollectionConfig = {
  slug: 'user-profiles',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'clerk_user_id', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text' },
    {
      name: 'preferred_locale',
      type: 'select',
      options: ['ja', 'en', 'zh'],
      defaultValue: 'ja',
    },
    { name: 'phone', type: 'text' },
    { name: 'nationality', type: 'text' },
    { name: 'company', type: 'text' },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Staff', value: 'staff' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'user',
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Staff-only notes, not visible to user' },
    },
  ],
  timestamps: true,
}
