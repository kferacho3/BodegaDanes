export default function ContactSection() {
    return (
      <section id="contact" className="py-16 bg-charcoal text-silver-light px-4">
        <div className="mx-auto max-w-lg space-y-6">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
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
  