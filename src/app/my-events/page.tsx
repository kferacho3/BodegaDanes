import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default function MyEventsPage(){
  return(
    <main className="mx-auto max-w-md py-12 space-y-8 text-silver-light">
      <h1 className="text-center font-header text-3xl">My Events</h1>
      <EventLookupForm/>
    </main>
  );
}

async function EventLookupForm(){
  async function action(fd:FormData){
    'use server';
    const emailOrId = fd.get('identity') as string;
    const code      = fd.get('code')     as string;

    const booking = await prisma.booking.findFirst({
      where:{
        confirmationCode:code,
        OR:[
          { customerEmail:emailOrId },
          { customerId   :emailOrId },
        ],
      },
    });
    if(!booking) redirect('/my-events?error=notfound');

    redirect(`/my-events/${code}?id=${encodeURIComponent(emailOrId)}`);
  }

  return(
    <form action={action} className="space-y-4">
      <input name="identity" placeholder="e-mail or customer-id" required
             className="w-full rounded bg-black/30 p-2"/>
      <input name="code"     placeholder="confirmation code" required
             className="w-full rounded bg-black/30 p-2 uppercase"/>
      <button className="w-full rounded-full bg-chalk-red py-2">View event</button>
    </form>
  );
}
