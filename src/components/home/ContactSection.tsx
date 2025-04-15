"use client";

import Image from "next/image";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-charcoal text-silver-light px-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header with Icon */}
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="w-14 h-14 rounded-full bg-[url('/textures/chalk-gold.png')] bg-cover bg-center p-0 shadow-md">
            <div className="relative w-full h-full">
              <Image
                src="https://bodegadanes.s3.us-east-2.amazonaws.com/home/contact/BodegaDanesContactIcon.webp"
                alt="Contact Icon"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-header ">Get in Touch</h2>
        </div>

        {/* Contact Form */}
        <form
          className="grid gap-4"
          action="https://formspree.io/f/mwkgyyqz"
          method="POST"
        >
          <input
            required
            name="name"
            placeholder="Name"
            className="p-3 rounded bg-silver-light/10"
          />
          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-silver-light/10"
          />
          <textarea
            required
            name="message"
            placeholder="How can we help?"
            rows={4}
            className="p-3 rounded bg-silver-light/10"
          />
          <button
            type="submit"
            className="bg-chalk-red px-6 py-3 rounded font-semibold hover:bg-chalk-red-dark"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
