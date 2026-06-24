"use client";

import Image from "next/image";
import { useState } from "react";
import SlideIn from "@/app/components/slide-in";

export default function VolunteerSection() {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", skills: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", skills: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SlideIn>
            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
              {/* Image */}
              <div className="relative w-full max-w-md flex-shrink-0">
                <div className="animate-float aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/volunteer.png"
                    alt="Volunteer with HUWASAL"
                    width={600}
                    height={450}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border-2 border-primary/10 bg-primary/[0.02]" />
              </div>

              {/* Text */}
              <div className="max-w-lg text-center md:text-left">
                <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                  Volunteer
                </span>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                  Become a Volunteer
                </h2>
                <p className="mb-6 text-base leading-relaxed text-zinc-500">
                  Join HUWASAL in our mission to empower marginalized communities across Sierra Leone. 
                  Your time, skills, and passion can make a real difference in the lives of women, 
                  children, youth, and persons with different abilities.
                </p>
                <button
                  onClick={() => setFormOpen(true)}
                  className="group inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-dark hover:shadow-xl"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  Volunteer With Us
                </button>
              </div>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Volunteer Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
          <div className="animate-scale-in relative w-full max-w-lg rounded-2xl border bg-white shadow-2xl mx-4">
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-primary">Become a Volunteer</h2>
                <p className="mt-0.5 text-xs text-zinc-400">Fill in your details to join our team.</p>
              </div>
              <button onClick={() => { setFormOpen(false); setSubmitted(false); setError(""); }} className="rounded-xl p-2 text-zinc-400 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary">Thank You!</h3>
                <p className="text-sm text-zinc-500">
                  Your volunteer application has been submitted successfully. We will review your application and get back to you soon.
                </p>
                <button onClick={() => { setFormOpen(false); setSubmitted(false); }}
                  className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+232 XX XXX XXX"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="Your skills or expertise"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Why do you want to volunteer with us?"
                      className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                  <button type="button" onClick={() => { setFormOpen(false); setError(""); }}
                    className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
