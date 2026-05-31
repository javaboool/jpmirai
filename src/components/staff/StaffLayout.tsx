import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined
  if (!user || (role !== 'staff' && role !== 'admin')) redirect('/sign-in')
  return <>{children}</>
}
