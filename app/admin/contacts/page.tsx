"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/app/admin/toast";
import PageHeader from "@/app/admin/page-header";
import Modal from "@/app/components/modal";
import LoadingSpinner from "@/app/components/loading-spinner";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminContacts() {
  const { showToast } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

  const [detailContact, setDetailContact] = useState<Contact | null>(null);
  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (readFilter !== "all") params.set("read", readFilter === "read" ? "true" : "false");
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/contacts?${params}`);
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : data.contacts ?? []);
    } catch {
      showToast("error", "Error", "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [readFilter, search, showToast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function toggleRead(contact: Contact) {
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !contact.read }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      showToast("success", "Status Updated", `Message from "${contact.name}" marked as ${!contact.read ? "read" : "unread"}.`);
      fetchContacts();
    } catch {
      showToast("error", "Error", "Failed to update contact status");
    }
  }

  const filtered = contacts.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.email.toLowerCase().includes(q) &&
        !(c.subject ?? "").toLowerCase().includes(q) &&
        !c.message.toLowerCase().includes(q)
      )
        return false;
    }
    if (readFilter === "read") return c.read;
    if (readFilter === "unread") return !c.read;
    return true;
  });

  return (
    <div className="p-8">
      <PageHeader title="Contact Management" description="View and manage contact form submissions." />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {(["all", "unread", "read"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setReadFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${
                  readFilter === s ? "bg-primary text-white shadow-md" : "text-zinc-500 hover:text-primary"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">
              {search || readFilter !== "all" ? "No matching messages" : "No messages yet"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {search || readFilter !== "all" ? "Try a different search or filter." : "Contact submissions will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[1fr_1fr_1fr_100px_130px_100px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Name</span>
              <span>Email</span>
              <span>Subject</span>
              <span className="text-center">Status</span>
              <span className="text-center">Created</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((contact, i) => (
              <div
                key={contact.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-slide-up grid grid-cols-[1fr_1fr_1fr_100px_130px_100px] gap-4 px-6 py-4 text-sm transition-colors hover:bg-zinc-50 cursor-pointer"
                onClick={() => setDetailContact(contact)}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">{contact.name}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-zinc-600">{contact.email}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-zinc-600" title={contact.subject ?? ""}>
                    {contact.subject || <span className="text-zinc-300 italic">No subject</span>}
                  </p>
                  <p className="truncate text-xs text-zinc-400" title={contact.message}>
                    {contact.message}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      contact.read ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${contact.read ? "bg-green-500" : "bg-amber-500"}`} />
                    {contact.read ? "Read" : "Unread"}
                  </span>
                </div>
                <div className="flex items-center justify-center text-xs text-zinc-400">
                  {new Date(contact.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRead(contact); }}
                    className={`rounded-lg p-2 transition-all duration-300 ${
                      contact.read
                        ? "text-zinc-400 hover:bg-amber-50 hover:text-amber-500"
                        : "text-zinc-400 hover:bg-green-50 hover:text-green-500"
                    }`}
                    title={contact.read ? "Mark as unread" : "Mark as read"}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400">
          Showing {filtered.length} of {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Detail Modal */}
      {detailContact && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
          <div className="animate-scale-in relative w-full max-w-lg rounded-2xl border bg-white shadow-2xl mx-4">
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-primary">Message Details</h2>
                <p className="text-xs text-zinc-400 mt-0.5">From {detailContact.name}</p>
              </div>
              <button
                onClick={() => setDetailContact(null)}
                className="rounded-xl p-2 text-zinc-400 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 px-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Name</p>
                  <p className="mt-0.5 text-sm font-medium text-primary">{detailContact.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{detailContact.email}</p>
                </div>
                {detailContact.phone && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Phone</p>
                    <p className="mt-0.5 text-sm text-zinc-600">{detailContact.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Status</p>
                  <span
                    className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      detailContact.read ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${detailContact.read ? "bg-green-500" : "bg-amber-500"}`} />
                    {detailContact.read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Subject</p>
                <p className="mt-0.5 text-sm font-medium text-primary">{detailContact.subject || <span className="text-zinc-300 italic">No subject</span>}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Message</p>
                <div className="mt-1 rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                  {detailContact.message}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Submitted</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {new Date(detailContact.createdAt).toLocaleString("en-US", {
                    month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => {
                  toggleRead(detailContact);
                  setDetailContact(null);
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
                  detailContact.read
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {detailContact.read ? "Mark as Unread" : "Mark as Read"}
              </button>
              <button
                onClick={() => setDetailContact(null)}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
