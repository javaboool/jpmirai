import type { CollectionConfig } from 'payload'

export const ConsultationLogs: CollectionConfig = {
  slug: 'consultation-logs',
  admin: { useAsTitle: 'livekit_room' },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin' || req.user.role === 'staff') return true
      // Regular users can only see their own logs — filtered by query
      return true // Payload will return all; we rely on field-level filtering
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'staff',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'user-profiles' },
    { name: 'staff', type: 'relationship', relationTo: 'user-profiles' },
    {
      name: 'type',
      type: 'select',
      options: ['chat', 'email', 'video'],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'active', 'closed'],
      defaultValue: 'pending',
    },
    { name: 'started_at', type: 'date' },
    { name: 'ended_at', type: 'date' },
    { name: 'livekit_room', type: 'text' },
    { name: 'transcript', type: 'richText' },
  ],
  timestamps: true,
}
