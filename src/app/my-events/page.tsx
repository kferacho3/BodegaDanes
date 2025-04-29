// src/app/my-events/page.tsx

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

/**
 * Next.js 15 Server Component page:
 * ‣ `searchParams` must be declared as a Promise of your params shape.
 * ‣ We `await` it inside the async component.
 */
interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-md py-12 space-y-8 text-silver-light">
      <h1 className="text-center font-header text-3xl">My Events</h1>

      {error === 'notfound' && (
        <p className="text-center text-red-400">
          No booking found. Please double-check your details.
        </p>
      )}

      {/* Render the lookup form; it's a synchronous Server Component */}
      <EventLookupForm />
    </main>
  );
}

/**
 * Synchronous Server Component for the lookup form.
 * Only the nested `action` is a `use server` function.
 */
function EventLookupForm() {
  async function action(formData: FormData) {
    'use server';

    const identity = formData.get('identity') as string;
    const code     = formData.get('code')     as string;

    // Try to find the booking by email OR customerId
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
      // Redirect back to lookup with error flag
      return redirect('/my-events?error=notfound');
    }

    // On success, navigate to the detail page
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
      <button
        type="submit"
        className="w-full rounded-full bg-chalk-red py-2 text-white"
      >
        View event
      </button>
    </form>
  );
}
