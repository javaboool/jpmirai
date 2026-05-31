import type { CollectionConfig } from 'payload'

export const ConsultationLogs: CollectionConfig = {
  slug: 'consultation-logs',
  admin: { useAsTitle: 'livekit_room' },
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
