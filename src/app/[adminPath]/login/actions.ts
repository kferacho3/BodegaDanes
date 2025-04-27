'use server';

/** ▸ Make sure this code is bundled for the Node runtime, not Edge  */
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/** Validate credentials against the ENV values (trimmed) */
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
    const store = await cookies();
    store.set('bd_admin', 'true', {
      httpOnly : true,
      secure   : process.env.NODE_ENV === 'production',
      sameSite : 'lax',
      path     : '/',
      maxAge   : 60 * 60 * 8,   // 8 h
    });

    redirect(`/${adminPath}`);
  }

  redirect(`/${adminPath}/login?err=1`);
}
