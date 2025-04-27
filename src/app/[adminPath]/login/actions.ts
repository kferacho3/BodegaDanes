'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/* ──────────────────────────────────────────────────────────
   Read & normalise env-vars once, at module load-time
   (trims accidental whitespace that can sneak into
    AWS Amplify Console inputs)                               */
const ENV_EMAIL    = (process.env.ADMIN_EMAIL    ?? '').trim().toLowerCase();
const ENV_PASSWORD = (process.env.ADMIN_PASSWORD ?? '').trim();
const ENV_PASSKEY  = (process.env.ADMIN_PASSKEY  ?? '').trim();

/** Returns true when the submitted credentials match the env-vars */
function isValid(form: FormData): boolean {
  const email    = String(form.get('email')    ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '').trim();
  const key      = String(form.get('key')      ?? '').trim();

  return (
    email    === ENV_EMAIL &&
    password === ENV_PASSWORD &&
    key      === ENV_PASSKEY
  );
}

export async function loginAction(formData: FormData) {
  const adminPath = String(formData.get('adminPath') ?? '').replace(/^\/+/, '');

  if (isValid(formData)) {
    /* write an http-only cookie the middleware can trust */
    const store = await cookies();
    store.set('bd_admin', 'true', {
      httpOnly : true,
      secure   : process.env.NODE_ENV === 'production',
      sameSite : 'lax',
      path     : '/',
      // 8-hour session
      maxAge   : 60 * 60 * 8,
    });

    redirect(`/${adminPath}`);
  }

  /* failed login ➜ back to form with error flag */
  redirect(`/${adminPath}/login?err=1`);
}
