import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/signin');

  return (
    <html>
      <body className="min-h-screen bg-gradient-to-b from-black via-black to-neptune-light/5 text-steam">
        <header className="mx-auto max-w-6xl p-6">
          <h1 className="font-header text-3xl">Bodega Danes Admin</h1>
        </header>
        <main className="mx-auto max-w-6xl px-6 pb-20">{children}</main>
      </body>
    </html>
  );
}
