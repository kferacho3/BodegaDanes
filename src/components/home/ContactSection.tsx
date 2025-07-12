// components/home/ContactSection.tsx

"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      // Auto-close success modal after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      // Clear error after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
      aria-label="Contact us"
    >
      {/* Multi-layered background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal" />
        
        {/* Chalk texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url('/textures/chalk-black.png')`,
            backgroundSize: '500px 500px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-chalk-red/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left side - Contact info & branding */}
          <div 
            className={`space-y-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Section label */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16" />
              <span className="text-gold font-display text-sm uppercase tracking-wider">Get in Touch</span>
            </div>

            {/* Heading with chalk texture */}
            <h2>
              <span 
                className="text-4xl sm:text-5xl lg:text-6xl font-header leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: `url('/textures/chalk-white.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(1.2)',
                  textShadow: '0 0 30px rgba(255,255,255,0.3)'
                }}
              >
                Let&apos;s Create Your
              </span>
              <br />
              <span 
                className="text-4xl sm:text-5xl lg:text-6xl font-header leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: `url('/textures/chalk-gold.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(1.3)',
                }}
              >
                Perfect Event
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-silver-light/80 leading-relaxed max-w-md">
              Have questions about our services? Ready to bring the bodega experience to your next event? 
              Drop us a line and we&apos;ll get back to you within 24 hours.
            </p>

            {/* Contact methods */}
            <div className="space-y-4">
              {[
                { icon: "📧", label: "Email", value: "info@bodegadanes.com", href: "mailto:info@bodegadanes.com" },
                { icon: "📱", label: "Phone", value: "(404) 555-0123", href: "tel:+14045550123" },
                { icon: "📍", label: "Service Area", value: "Atlanta Metro & Beyond", href: null }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 transition-all duration-500 delay-${index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-silver-light/60 text-sm">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-gold hover:text-gold/80 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-silver-light">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4 pt-4">
              {["Instagram", "Facebook", "Twitter"].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="w-10 h-10 bg-silver-light/10 hover:bg-silver-light/20 rounded-full flex items-center justify-center text-silver-light hover:text-gold transition-all duration-300"
                  aria-label={`Follow us on ${social}`}
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Right side - Contact form */}
          <div 
            className={`relative transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Form container with chalk board effect */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Chalk board texture */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url('/textures/chalk-Menuboard.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Form wrapper */}
              <div className="relative bg-charcoal-light/80 backdrop-blur-sm p-8 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-silver-light/80 mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal/50 border border-silver-dark/30 rounded-xl text-silver-light placeholder-silver-dark/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-300"
                    />
                  </div>

                  {/* Email input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-silver-light/80 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal/50 border border-silver-dark/30 rounded-xl text-silver-light placeholder-silver-dark/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-300"
                    />
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-silver-light/80 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your event..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal/50 border border-silver-dark/30 rounded-xl text-silver-light placeholder-silver-dark/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-chalk-red hover:bg-chalk-red-dark disabled:bg-chalk-red/50 text-silver-light font-header text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">
                      {status === "sending" ? "Sending..." : "Send Message"}
                    </span>
                    {status !== "sending" && (
                      <svg 
                        className="relative z-10 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-chalk-red-dark to-chalk-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                </form>

                {/* Error message */}
                {status === "error" && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-center">
                      Oops! Something went wrong. Please try again later.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-chalk-red/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Success modal */}
      {status === "success" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative bg-charcoal-light rounded-3xl p-8 max-w-md w-full shadow-2xl transform scale-100 animate-bounce-in">
            {/* Chalk texture */}
            <div 
              className="absolute inset-0 opacity-20 rounded-3xl"
              style={{
                backgroundImage: `url('/textures/chalk-gold.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            <div className="relative text-center space-y-6">
              {/* Success icon */}
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                              </div>
              
              {/* Success message */}
              <div className="space-y-2">
                <h3 className="text-2xl font-header text-silver-light">Message Sent!</h3>
                <p className="text-silver-light/80">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
              
              {/* Auto-close indicator */}
              <div className="relative h-1 bg-charcoal/30 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gold rounded-full animate-progress-bar" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}