import type { JWT } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import type { NextRequest } from 'next/server';

export default withAuth(
  () => {},
  {
    callbacks: {
      authorized({ token, req }: { token: JWT | null; req: NextRequest }) {
        if (!req.nextUrl.pathname.startsWith('/admin')) return true;
        return token?.role === 'ADMIN';
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
