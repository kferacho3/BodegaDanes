'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Returns true when the submitted credentials match the
 * ADMIN_* environment variables configured in Amplify.
 *
 * All values are trimmed, and the email is compared
 * case-insensitively while password & passkey remain
 * case-sensitive.
 */
function isValid(form: FormData): boolean {
  const email    = String(form.get('email')    ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '').trim();
  const key      = String(form.get('key')      ?? '').trim();

  const envEmail    = (process.env.ADMIN_EMAIL    ?? '').trim().toLowerCase();
  const envPassword = (process.env.ADMIN_PASSWORD ?? '').trim();
  const envPasskey  = (process.env.ADMIN_PASSKEY  ?? '').trim();

  return (
    email    === envEmail &&
    password === envPassword &&
    key      === envPasskey
  );
}

export async function loginAction(formData: FormData) {
  const adminPath = String(formData.get('adminPath') ?? '').replace(/^\/+/, '');

  if (isValid(formData)) {
    /* write an http-only session cookie for the middleware */
    const store = await cookies();
    store.set('bd_admin', 'true', {
      httpOnly : true,
      secure   : process.env.NODE_ENV === 'production',
      sameSite : 'lax',
      path     : '/',
      maxAge   : 60 * 60 * 8, // 8 hours
    });

    redirect(`/${adminPath}`);
  }

  /* failed login → back to form with ?err=1 */
  redirect(`/${adminPath}/login?err=1`);
}
