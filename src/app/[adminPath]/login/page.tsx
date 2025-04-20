import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

interface Props {
  params: { adminPath: string };
}

export default function LoginPage({ params }: Props) {
  async function login(formData: FormData) {
    'use server';

    const ok =
      formData.get('email')    === process.env.ADMIN_EMAIL &&
      formData.get('password') === process.env.ADMIN_PASSWORD &&
      formData.get('key')      === process.env.ADMIN_PASSKEY;

    if (ok) {
      (await cookies()).set('bd_admin', 'true', {
        httpOnly: true,
        secure  : process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path    : '/',
      });
      redirect(`/${params.adminPath}`);
    }

    redirect(`/${params.adminPath}/login?err=1`);
  }

  return (
    <form action={login} className="mx-auto mt-20 max-w-sm space-y-4 p-6">
      <h1 className="text-center text-2xl font-header">Provider&nbsp;Login</h1>

      <input name="email"     type="email"    placeholder="Email"    className="w-full rounded bg-silver-light/10 p-2" required />
      <input name="password"  type="password" placeholder="Password" className="w-full rounded bg-silver-light/10 p-2" required />
      <input name="key"       placeholder="Passkey"                  className="w-full rounded bg-silver-light/10 p-2" required />

      <button className="w-full rounded bg-chalk-red py-2 text-silver-light">
        Sign&nbsp;in
      </button>

      {typeof window !== 'undefined' && window.location.search.includes('err') && (
        <p className="text-center text-red-500 text-sm">Invalid&nbsp;credentials</p>
      )}
    </form>
  );
}
