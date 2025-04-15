import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Ticket {
  code: string;
  date: string;
  service: string;
}

export default function Confirmation() {
  const params = useSearchParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    fetch(`/api/booking/confirmation?session_id=${sessionId}`)
      .then((r) => r.json())
      .then(setTicket);
  }, [params]);

  if (!ticket) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/textures/chalk-black.png')] bg-repeat text-silver-light p-8">
      <div className="max-w-md w-full rounded-xl border border-silver-dark/30 bg-charcoal/70 p-8 text-center space-y-6">
        <Image
          src="/logos/BodegaDanesHomeSymbol.png"
          alt="Bodega Danes"
          width={70}
          height={70}
          className="mx-auto"
        />
        <h1 className="font-header text-3xl">Booking Confirmed!</h1>
        <p className="text-lg font-bold">{ticket.service}</p>
        <p>{ticket.date}</p>
        <p className="text-2xl font-mono">{ticket.code}</p>
        <p className="opacity-70">
          An e‑mail receipt has been sent. We’ll reach out 48 h before your
          event with final details.
        </p>
      </div>
    </main>
  );
}
