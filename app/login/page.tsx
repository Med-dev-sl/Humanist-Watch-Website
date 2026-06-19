"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal, { LoadingOverlay } from "@/app/components/modal";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [userName, setUserName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      setErrorModal(true);
      return;
    }

    setUserName(email.split("@")[0]);
    setLoading(false);
    setSuccessModal(true);
  }

  function handleSuccessClose() {
    setSuccessModal(false);
    router.push("/admin");
  }

  return (
    <>
      <LoadingOverlay open={loading} message="Verifying credentials..." />

      <Modal
        open={successModal}
        type="success"
        title="Welcome back!"
        message={`You are now signed in as ${userName}. Redirecting to dashboard...`}
        onClose={handleSuccessClose}
      />

      <Modal
        open={errorModal}
        type="error"
        title="Login Failed"
        message={error || "Invalid email or password. Please try again."}
        onClose={() => setErrorModal(false)}
      />

      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col items-center gap-4">
              <Image
                src="/Huwasal%20Logo.png"
                alt="Humanist Watch Salone"
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
                priority
              />
              <div className="text-center">
                <h1 className="font-heading text-xl font-semibold text-primary">Sign In</h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Welcome back to Humanist Watch Salone
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && !errorModal && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
