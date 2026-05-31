import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const handleI18n = createMiddleware(routing)
const isProtectedRoute = createRouteMatcher(['/*/staff(.*)', '/*/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
  return handleI18n(req)
})

export const config = {
  matcher: ['/((?!_next|_payload|api/payload|.*\\..*).*)'],
}
