// src/app/my-events/page.tsx

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

/**
 * Server Component: can be async, fetch data, call prisma, etc.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { error } = searchParams;

  return (
    <main className="mx-auto max-w-md py-12 space-y-8 text-silver-light">
      <h1 className="text-center font-header text-3xl">My Events</h1>

      {error === 'notfound' && (
        <p className="text-center text-red-400">
          No booking found. Please double-check your details.
        </p>
      )}

      {/* Server Component form with a server action */}
      <EventLookupForm />
    </main>
  );
}

/**
 * Server Component (not async) that renders the lookup form.
 * Uses a `use server` action to handle the submission.
 */
function EventLookupForm() {
  'use server';

  async function action(formData: FormData) {
    const identity = formData.get('identity') as string;
    const code     = formData.get('code')     as string;

    const booking = await prisma.booking.findFirst({
      where: {
        confirmationCode: code,
        OR: [
          { customerEmail: identity },
          { customerId:    identity },
        ],
      },
    });

    if (!booking) {
      // Redirect back with an error flag
      redirect('/my-events?error=notfound');
    }

    // Navigate to the detail page
    redirect(`/my-events/${code}?id=${encodeURIComponent(identity)}`);
  }

  return (
    <form action={action} className="space-y-4">
      <input
        name="identity"
        type="text"
        placeholder="E-mail or Customer ID"
        required
        className="w-full rounded bg-black/30 p-2"
      />
      <input
        name="code"
        type="text"
        placeholder="Confirmation Code"
        required
        className="w-full rounded bg-black/30 p-2 uppercase"
      />
      <button className="w-full rounded-full bg-chalk-red py-2 text-white">
        View event
      </button>
    </form>
  );
}
