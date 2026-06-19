"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/app/admin/toast";
import PageHeader from "@/app/admin/page-header";
import Modal from "@/app/components/modal";
import LoadingSpinner from "@/app/components/loading-spinner";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  skills: string | null;
  status: string;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const statusDots: Record<string, string> = {
  pending: "bg-amber-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

export default function AdminVolunteers() {
  const { showToast } = useToast();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/volunteers?${params}`);
      const data = await res.json();
      setVolunteers(Array.isArray(data) ? data : data.volunteers ?? []);
    } catch {
      showToast("error", "Error", "Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, showToast]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  async function updateStatus(volunteer: Volunteer, status: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/admin/volunteers/${volunteer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      showToast("success", "Status Updated", `"${volunteer.name}" has been ${status}.`);
      setModal({ type: "success", title: "Volunteer Updated", message: `"${volunteer.name}" has been ${status}.` });
      fetchVolunteers();
    } catch {
      showToast("error", "Error", `Failed to ${status} volunteer`);
    }
  }

  const filtered = volunteers.filter((v) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !v.name.toLowerCase().includes(q) &&
        !v.email.toLowerCase().includes(q) &&
        !(v.skills ?? "").toLowerCase().includes(q)
      )
        return false;
    }
    if (statusFilter === "pending") return v.status === "pending";
    if (statusFilter === "approved") return v.status === "approved";
    if (statusFilter === "rejected") return v.status === "rejected";
    return true;
  });

  return (
    <div className="p-8">
      <PageHeader title="Volunteer Management" description="Review and manage volunteer applications." />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search volunteers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {(["all", "pending", "approved", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${
                  statusFilter === s ? "bg-primary text-white shadow-md" : "text-zinc-500 hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">
              {search || statusFilter !== "all" ? "No matching volunteers" : "No volunteers yet"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {search || statusFilter !== "all" ? "Try a different search or filter." : "Volunteer applications will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[1fr_1fr_1fr_110px_130px_110px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Name</span>
              <span>Email</span>
              <span>Skills</span>
              <span className="text-center">Status</span>
              <span className="text-center">Created</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((volunteer, i) => (
              <div
                key={volunteer.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-slide-up grid grid-cols-[1fr_1fr_1fr_110px_130px_110px] gap-4 px-6 py-4 text-sm transition-colors hover:bg-zinc-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">{volunteer.name}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-zinc-600">{volunteer.email}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-zinc-600" title={volunteer.skills ?? ""}>
                    {volunteer.skills || <span className="text-zinc-300 italic">None listed</span>}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[volunteer.status] ?? "bg-zinc-50 text-zinc-600"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDots[volunteer.status] ?? "bg-zinc-400"}`} />
                    {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-center text-xs text-zinc-400">
                  {new Date(volunteer.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center justify-end gap-1">
                  {volunteer.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus(volunteer, "approved")}
                        className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-green-50 hover:text-green-500"
                        title="Approve"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => updateStatus(volunteer, "rejected")}
                        className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                        title="Reject"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">
                      {volunteer.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {volunteers.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400">
          Showing {filtered.length} of {volunteers.length} volunteer{volunteers.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Success/Error Modal */}
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
