import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ADMIN = (process.env.ADMIN_PATH ?? '').replace(/^\/+/, '');   // e.g. admin-123…

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ses = req.cookies.get('bd_admin')?.value;

  const isAdminRoot   = pathname === `/${ADMIN}`;
  const isAdminChild  = pathname.startsWith(`/${ADMIN}/`);
  const isLoginPage   = pathname === `/${ADMIN}/login`;

  if (ADMIN && (isAdminRoot || isAdminChild)) {
    /* 1 · not logged‑in → everywhere except the login page 👉 login */
    if (!ses && !isLoginPage) {
      const url = req.nextUrl.clone();
      url.pathname = `/${ADMIN}/login`;
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    /* 2 · already logged‑in but visiting the login page 👉 dashboard */
    if (ses === 'true' && isLoginPage) {
      return NextResponse.redirect(new URL(`/${ADMIN}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico).*)'],
};
