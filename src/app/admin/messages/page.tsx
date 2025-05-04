import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <h2 className="mb-4 font-header text-2xl">Customer Messages</h2>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border border-white/10 bg-black/40 p-4"
          >
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span>
                <b>{m.name}</b> &lt;{m.email}&gt;
              </span>
              <span className="opacity-75">
                {format(m.createdAt, 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
            {m.subject && <p className="mt-1 font-bold">{m.subject}</p>}
            <p className="whitespace-pre-wrap">{m.body}</p>

            <div className="mt-3 flex gap-2">
              <a
                href={`mailto:${m.email}?subject=Re:%20${encodeURIComponent(
                  m.subject ?? 'Your inquiry'
                )}`}
                className="rounded-full bg-neptune px-3 py-1 text-xs font-bold"
              >
                Reply
              </a>
              {!m.replied && (
                <form
                  action={async () => {
                    'use server';
                    await prisma.message.update({
                      where: { id: m.id },
                      data: { replied: true },
                    });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-full bg-silver-dark px-3 py-1 text-xs"
                  >
                    Mark Replied
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
