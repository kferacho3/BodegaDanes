"use client";

import Link from "next/link";

export default function BookServiceSection() {
  return (
    <section
      id="book"
      className="py-16 px-4 md:px-0 bg-gradient-to-br from-chalk-red-dark to-charcoal text-silver-light"
    >
      <div className="mx-auto max-w-4xl text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Book?</h2>
        <p>
          Private events, pop‑ups, corporate lunches—choose a date and service,
          pay a small booking fee, and the rest is handled day‑of.
        </p>

        <Link
          href="/book"
          className="inline-block bg-silver-light text-charcoal font-bold px-8 py-3 rounded-full hover:bg-silver-light/90 transition"
        >
          Book&nbsp;Now
        </Link>
      </div>
    </section>
  );
}
