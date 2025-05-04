'use client';

import { cn } from '@/lib/cn';
import Link from 'next/link';
interface Props {
  title: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
  className?: string;
}

export default function WidgetCard({
  title,
  href,
  icon,
  count,
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-6 shadow-lg transition hover:bg-black/50',
        className
      )}
    >
      <div className="text-4xl opacity-60">{icon}</div>

      <div>
        <h3 className="font-header text-xl">{title}</h3>
        {typeof count === 'number' && (
          <p className="mt-1 text-3xl font-bold">{count}</p>
        )}
      </div>
    </Link>
  );
}
