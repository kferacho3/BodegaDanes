// src/middleware.ts
import type { JWT } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';

export default withAuth(
  // You can leave this no-op – all logic is inside `authorized`
  () => {},
  {
    callbacks: {
      authorized({ token, req }: { token: JWT | null; req: NextRequest }) {
        // Allow everything except /admin*, which needs ADMIN role
        if (!req.nextUrl.pathname.startsWith('/admin')) return true
        return token?.role === 'ADMIN'
      },
    },
  },
)

export const config = {
  matcher: ['/admin/:path*'],
}
