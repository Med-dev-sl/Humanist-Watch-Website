"use client";

import { useState } from "react";
import SlideIn from "@/app/components/slide-in";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Contact Us
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Get In Touch
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              Have a question or want to learn more about our work? Reach out to us.
            </p>
          </div>
        </SlideIn>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Contact Info */}
          <SlideIn direction="left">
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6">
              <div className="animate-slide-up flex items-start gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/50">Address</h3>
                  <p className="mt-1 text-base font-medium text-primary">29 Swaray Street, Kenema, Sierra Leone</p>
                </div>
              </div>

              <div className="animate-slide-up flex items-start gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/5" style={{ animationDelay: "0.1s" }}>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/50">Phone</h3>
                  <p className="mt-1 text-base font-medium text-primary">+232 78 641 484</p>
                </div>
              </div>

              <div className="animate-slide-up flex items-start gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/5" style={{ animationDelay: "0.2s" }}>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/50">Email</h3>
                  <p className="mt-1 text-base font-medium text-primary">info@huwasal.com</p>
                </div>
              </div>
            </div>
          </SlideIn>

          {/* Contact Form */}
          <SlideIn direction="right">
            <div className="min-w-0 flex-1">
              {submitted ? (
                <div className="animate-scale-in flex flex-col items-center gap-4 rounded-2xl border border-primary/10 bg-white p-12 text-center shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary">Message Sent!</h3>
                  <p className="text-sm text-zinc-500">
                    Thank you for reaching out. We will get back to you as soon as possible.
                  </p>
                  <button onClick={() => setSubmitted(false)}
                    className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-primary/10 bg-white p-6 sm:p-8 shadow-lg">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        Phone
                      </label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+232 XX XXX XXX"
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        Subject
                      </label>
                      <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?"
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your inquiry..." required
                        className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                    </div>
                  </div>

                  {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                  <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={saving}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60">
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                          Send Message
                        </span>
                      )}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
