import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EventDetail({params,searchParams}:{params:{code:string},searchParams:{id?:string}}){
  const id = searchParams.id;
  if(!id) notFound();

  const booking = await prisma.booking.findFirst({
    where:{
      confirmationCode:params.code,
      OR:[ { customerEmail:id }, { customerId:id } ],
    },
  });
  if(!booking) notFound();

  return(
    <main className="mx-auto max-w-lg py-12 space-y-6 text-silver-light">
      <h1 className="text-center font-header text-3xl">Your Event</h1>
      <p><b>Date:</b> {booking.date.toISOString().slice(0,10)}</p>
      <p><b>Service:</b> {booking.serviceId}</p>
      <p><b>Confirmation #:</b> {booking.confirmationCode}</p>
      {/* TODO: editable form here */}
    </main>
  );
}
