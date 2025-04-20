"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 bg-charcoal text-silver-light px-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header */}
        {/* … your icon and heading … */}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3 rounded bg-silver-light/10"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 rounded bg-silver-light/10"
          />
          <textarea
            name="message"
            placeholder="How can we help?"
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
            className="p-3 rounded bg-silver-light/10"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-chalk-red px-6 py-3 rounded font-semibold hover:bg-chalk-red-dark disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </form>

        {/* Popup confirmation */}
        {status === "success" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-charcoal rounded-lg p-6 text-center space-y-4">
              <p className="text-lg font-semibold">Message sent!</p>
              <button
                onClick={() => setStatus("idle")}
                className="px-4 py-2 bg-chalk-red rounded text-silver-light"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {status === "error" && (
          <p className="text-center text-red-500">
            Oops—something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
