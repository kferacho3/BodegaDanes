'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/** Central helper to validate the credentials in a single place */
function isValid(form: FormData): boolean {
  const email    = String(form.get('email')    ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '').trim();
  const key      = String(form.get('key')      ?? '').trim();

  return (
    email    === (process.env.ADMIN_EMAIL    ?? '').toLowerCase() &&
    password === (process.env.ADMIN_PASSWORD ?? '')               &&
    key      === (process.env.ADMIN_PASSKEY  ?? '')
  );
}

export async function loginAction(formData: FormData) {
  const adminPath = String(formData.get('adminPath') ?? '').replace(/^\/+/, '');

  if (isValid(formData)) {
    /* ✅  Await the cookies() promise so we get the actual store */
    const cookieStore = await cookies();

    cookieStore.set('bd_admin', 'true', {
      httpOnly : true,
      secure   : process.env.NODE_ENV === 'production',
      sameSite : 'lax',
      path     : '/',
      // 8 hours
      maxAge   : 60 * 60 * 8,
    });

    redirect(`/${adminPath}`);
  }

  /* Failed login → bounce back with ?err=1 */
  redirect(`/${adminPath}/login?err=1`);
}
