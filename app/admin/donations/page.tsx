"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/app/admin/toast";
import PageHeader from "@/app/admin/page-header";
import Modal from "@/app/components/modal";
import LoadingSpinner from "@/app/components/loading-spinner";

type User = {
  id: string;
  name: string;
  email: string;
};

type Donation = {
  id: string;
  amount: number;
  currency: string;
  name: string | null;
  email: string | null;
  message: string | null;
  anonymous: boolean;
  read: boolean;
  createdAt: string;
  userId: string | null;
  user: User | null;
};

export default function AdminDonations() {
  const { showToast } = useToast();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/donations`);
      const data = await res.json();
      setDonations(Array.isArray(data) ? data : data.donations ?? []);
    } catch {
      showToast("error", "Error", "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  async function toggleRead(donation: Donation) {
    try {
      const res = await fetch("/api/admin/donations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: donation.id, read: !donation.read }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setDonations((prev) =>
        prev.map((d) => (d.id === donation.id ? { ...d, read: !d.read } : d))
      );
      showToast("success", "Updated", donation.read ? "Marked as unread" : "Marked as read");
    } catch {
      showToast("error", "Error", "Failed to update donation");
    }
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  }

  function getDonorName(donation: Donation) {
    if (donation.anonymous) return "Anonymous";
    return donation.name ?? donation.user?.name ?? "Anonymous";
  }

  const totalUnread = donations.filter((d) => !d.read).length;

  const filtered = donations.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    if ((d.message ?? "").toLowerCase().includes(q)) return true;
    if ((d.name ?? "").toLowerCase().includes(q)) return true;
    if ((d.email ?? "").toLowerCase().includes(q)) return true;
    const donor = getDonorName(d);
    if (donor.toLowerCase().includes(q)) return true;
    return false;
  });

  return (
    <div className="p-8">
      <PageHeader
        title="Donation Management"
        description={`Track donations and fundraising. ${totalUnread > 0 ? `${totalUnread} unread donation${totalUnread !== 1 ? "s" : ""}.` : ""}`}
      />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search donations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">
              {search ? "No matching donations" : "No donations yet"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {search ? "Try a different search." : "Donation records will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[100px_140px_1fr_120px_100px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Status</span>
              <span>Amount</span>
              <span>Donor</span>
              <span>Date</span>
              <span className="text-center">Action</span>
            </div>
            {filtered.map((donation, i) => (
              <div
                key={donation.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`animate-slide-up grid grid-cols-[100px_140px_1fr_120px_100px] gap-4 px-6 py-4 text-sm transition-colors hover:bg-zinc-50 ${!donation.read ? "bg-primary/[0.02]" : ""}`}
              >
                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    donation.read
                      ? "bg-zinc-100 text-zinc-500"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${donation.read ? "bg-zinc-400" : "bg-blue-500 animate-pulse"}`} />
                    {donation.read ? "Read" : "New"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-primary">{formatAmount(donation.amount, donation.currency)}</span>
                </div>
                <div className="min-w-0 flex flex-col items-start justify-center">
                  <span className="truncate text-zinc-600">{getDonorName(donation)}</span>
                  {(donation.email || donation.user?.email) && (
                    <span className="truncate text-[11px] text-zinc-400">{donation.email ?? donation.user?.email}</span>
                  )}
                  {donation.message && (
                    <span className="mt-0.5 truncate text-[11px] italic text-zinc-400" title={donation.message}>
                      &ldquo;{donation.message}&rdquo;
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-zinc-400">
                  {new Date(donation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleRead(donation)}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                      donation.read
                        ? "bg-zinc-100 text-zinc-500 hover:bg-blue-100 hover:text-blue-700"
                        : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {donation.read ? "Unread" : "Read"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {donations.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400">
          Showing {filtered.length} of {donations.length} donation{donations.length !== 1 ? "s" : ""}
          {totalUnread > 0 && ` (${totalUnread} unread)`}
        </p>
      )}

      <Modal
        open={!!modal}
        type={modal?.type ?? "success"}
        title={modal?.title ?? ""}
        message={modal?.message ?? ""}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
