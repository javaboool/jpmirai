import type { CollectionConfig } from 'payload'

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'id',
    description: 'Runtime configuration — LiveKit, SMTP, etc. Stored in DB, no restart needed.',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'staff',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: () => false,
  },
  fields: [
    {
      name: 'livekit_api_key',
      type: 'text',
      admin: { description: 'From livekit.io dashboard' },
    },
    {
      name: 'livekit_api_secret',
      type: 'text',
      admin: {
        description: 'Keep secret — server-side only. TODO: add field encryption in production.',
      },
    },
    {
      name: 'livekit_url',
      type: 'text',
      admin: { description: 'Format: wss://xxx.livekit.cloud' },
    },
    { name: 'smtp_host', type: 'text', defaultValue: 'smtp.gmail.com' },
    { name: 'smtp_port', type: 'number', defaultValue: 587 },
    { name: 'smtp_user', type: 'text' },
    {
      name: 'smtp_pass',
      type: 'text',
      admin: { description: 'Gmail App Password. TODO: add field encryption in production.' },
    },
    {
      name: 'staff_email',
      type: 'text',
      admin: { description: 'Receives consultation email inquiries' },
    },
    { name: 'socket_port', type: 'number', defaultValue: 3001 },
    { name: 'max_call_participants', type: 'number', defaultValue: 4 },
  ],
}
