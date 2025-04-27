import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Get the admin path from environment variables, removing leading slashes.
// This ensures the middleware knows the correct path to protect.
const ADMIN = (process.env.ADMIN_PATH ?? '').replace(/^\/+/, '');   // e.g. admin-123…

// Middleware function that runs on incoming requests.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // Get the pathname of the request URL
  const ses = req.cookies.get('bd_admin')?.value; // Get the session cookie value

  // Define boolean flags for easier readability
  const isAdminRoot   = pathname === `/${ADMIN}`; // Checks if the path is the exact admin root
  const isAdminChild  = pathname.startsWith(`/${ADMIN}/`); // Checks if the path starts with the admin root
  const isLoginPage   = pathname === `/${ADMIN}/login`; // Checks if the path is the admin login page

  // Check if an ADMIN path is configured and the request is for an admin route (root or child)
  if (ADMIN && (isAdminRoot || isAdminChild)) {
    /* 1 · not logged‑in → everywhere except the login page 👉 login */
    // If there's no session cookie AND the request is NOT for the login page, redirect to login.
    if (!ses && !isLoginPage) {
      const url = req.nextUrl.clone(); // Clone the current URL
      url.pathname = `/${ADMIN}/login`; // Set the new pathname to the login page
      url.searchParams.set('from', pathname); // Add a 'from' search param to redirect back after login
      return NextResponse.redirect(url); // Perform the redirect
    }

    /* 2 · already logged‑in but visiting the login page 👉 dashboard */
    // If there IS a session cookie AND the request IS for the login page, redirect to the admin root.
    if (ses === 'true' && isLoginPage) {
      return NextResponse.redirect(new URL(`/${ADMIN}`, req.url)); // Redirect to the admin root
    }
  }

  // If none of the above conditions are met (either not an admin route or already handled),
  // proceed with the request as normal.
  return NextResponse.next();
}

// Configuration for the middleware, specifying which paths it should apply to.
// This matcher excludes Next.js internal paths and the favicon.
export const config = {
  matcher: ['/((?!_next/|favicon.ico).*)'],
};
