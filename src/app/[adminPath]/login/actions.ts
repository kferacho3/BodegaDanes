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

  // --- Debugging Logs ---
  // Check your AWS Amplify build/runtime logs after deploying this change
  // to see what values the server is seeing for form data and env variables.
  console.log('--- Login Attempt Debug ---');
  console.log('Submitted Email (trimmed, lower):', email);
  console.log('Submitted Password (trimmed):', password);
  console.log('Submitted Passkey (trimmed):', key);
  console.log('Env ADMIN_EMAIL (trimmed, lower):', envEmail);
  console.log('Env ADMIN_PASSWORD (trimmed):', envPassword);
  console.log('Env ADMIN_PASSKEY (trimmed):', envPasskey);
  console.log('--- End Debug ---');
  // -----------------------


  return (
    email    === envEmail &&
    password === envPassword &&
    key      === envPasskey
  );
}

export async function loginAction(formData: FormData) {
  // Ensure adminPath is a string and remove leading slashes
  const adminPath = String(formData.get('adminPath') ?? '').replace(/^\/+/, '');

  if (isValid(formData)) {
    /* write an http-only session cookie for the middleware */
    const store = await cookies();
    store.set('bd_admin', 'true', {
      httpOnly : true,
      secure   : process.env.NODE_ENV === 'production', // Use secure cookie in production
      sameSite : 'lax', // Use lax same-site policy
      path     : '/', // Cookie is valid for the entire site
      maxAge   : 60 * 60 * 8, // Cookie expires after 8 hours (in seconds)
    });

    // Redirect to the admin path on successful login
    redirect(`/${adminPath}`);
  }

  /* failed login → back to form with ?err=1 */
  // Redirect back to the login page with an error flag on failure
  redirect(`/${adminPath}/login?err=1`);
}
