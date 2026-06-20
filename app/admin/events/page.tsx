"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/app/admin/toast";
import PageHeader from "@/app/admin/page-header";
import Modal from "@/app/components/modal";
import LoadingSpinner from "@/app/components/loading-spinner";

type Event = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  location: string | null;
  date: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormData = {
  name: string;
  slug: string;
  description: string;
  image: string;
  location: string;
  date: string;
  published: boolean;
};

const emptyForm: FormData = { name: "", slug: "", description: "", image: "", location: "", date: "", published: false };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminEvents() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/events?${params}`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events ?? []);
    } catch {
      showToast("error", "Error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, showToast]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    if (formOpen && editing) {
      setForm({
        name: editing.name, slug: editing.slug, description: editing.description ?? "",
        image: editing.image ?? "", location: editing.location ?? "",
        date: editing.date ? editing.date.split("T")[0] : "", published: editing.published,
      });
      setImagePreview(editing.image); setImageFile(null); setFormErrors({});
    } else if (formOpen && !editing) {
      setForm(emptyForm); setImagePreview(null); setImageFile(null); setFormErrors({});
    }
  }, [formOpen, editing]);

  function openCreate() { setEditing(null); setForm(emptyForm); setImagePreview(null); setImageFile(null); setFormErrors({}); setFormOpen(true); }
  function openEdit(event: Event) { setEditing(event); setFormOpen(true); }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.slug.trim()) errors.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = "Slug must be lowercase with hyphens";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      let image = form.image;
      if (imageFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("folder", "events");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error ?? "Upload failed");
        image = uploadResult.url;
        setUploading(false);
      }
      const payload = { ...form, image, date: form.date || null };
      const url = editing ? `/api/admin/events/${editing.id}` : "/api/admin/events";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setFormOpen(false);
      showToast("success", editing ? "Updated" : "Created", `Event "${form.name}" ${editing ? "updated" : "created"} successfully.`);
      setModal({ type: "success", title: editing ? "Event Updated" : "Event Created", message: `"${form.name}" has been ${editing ? "updated" : "created"}.` });
      fetchEvents();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      showToast("error", "Error", msg);
    } finally {
      setSaving(false); setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteTarget(null);
      showToast("success", "Deleted", `Event "${deleteTarget.name}" deleted.`);
      setModal({ type: "success", title: "Event Deleted", message: `"${deleteTarget.name}" has been removed.` });
      fetchEvents();
    } catch { showToast("error", "Error", "Delete failed"); }
    finally { setDeleting(false); }
  }

  async function toggleStatus(event: Event) {
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: event.name, slug: event.slug, description: event.description, image: event.image, location: event.location, date: event.date, published: !event.published }),
      });
      if (!res.ok) throw new Error("Update failed");
      showToast("success", "Status Updated", `"${event.name}" is now ${!event.published ? "Published" : "Draft"}.`);
      fetchEvents();
    } catch { showToast("error", "Error", "Failed to update status"); }
  }

  const filtered = events.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !(e.description ?? "").toLowerCase().includes(q) && !(e.location ?? "").toLowerCase().includes(q)) return false;
    }
    if (statusFilter === "published") return e.published;
    if (statusFilter === "draft") return !e.published;
    return true;
  });

  return (
    <div className="p-8">
      <PageHeader title="Events" description="Manage events and activities." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
          </div>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {(["all", "published", "draft"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${statusFilter === s ? "bg-primary text-white shadow-md" : "text-zinc-500 hover:text-primary"}`}>{s}</button>
            ))}
          </div>
        </div>
        <button onClick={openCreate}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25">
          <span className="relative z-10 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Event
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>

      <div className="animate-fade-in overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">{search || statusFilter !== "all" ? "No matching events" : "No events yet"}</p>
            <p className="mt-1 text-sm text-zinc-400">{search || statusFilter !== "all" ? "Try a different search or filter." : "Create your first event to get started."}</p>
            {!search && statusFilter === "all" && (
              <button onClick={openCreate} className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">Create Event</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[1fr_100px_120px_130px_80px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Name</span><span className="text-center">Status</span><span className="text-center">Date</span><span className="text-center">Created</span><span className="text-right">Actions</span>
            </div>
            {filtered.map((event, i) => (
              <div key={event.id} style={{ animationDelay: `${i * 40}ms` }}
                className="animate-slide-up grid grid-cols-[1fr_100px_120px_130px_80px] gap-4 px-6 py-4 text-sm transition-colors hover:bg-zinc-50">
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">{event.name}</p>
                  <p className="truncate text-xs text-zinc-400">{event.location && `${event.location} — `}/{event.slug}</p>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={() => toggleStatus(event)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${event.published ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${event.published ? "bg-green-500" : "bg-amber-500"}`} />
                    {event.published ? "Published" : "Draft"}
                  </button>
                </div>
                <div className="flex items-center justify-center text-xs text-zinc-500">
                  {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </div>
                <div className="flex items-center justify-center text-xs text-zinc-400">
                  {new Date(event.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(event)} className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-primary/5 hover:text-primary" title="Edit">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.219l-4.5 1.28 1.28-4.5L16.862 3.488z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(event)} className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500" title="Delete">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {events.length > 0 && <p className="mt-4 text-xs text-zinc-400">Showing {filtered.length} of {events.length} event{events.length !== 1 ? "s" : ""}</p>}

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
          <div className="animate-scale-in relative w-full max-w-2xl rounded-2xl border bg-white shadow-2xl mx-4">
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-primary">{editing ? "Edit Event" : "Create Event"}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{editing ? "Update the event details below." : "Fill in the details to create a new event."}</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="rounded-xl p-2 text-zinc-400 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Name <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); if (!editing) setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) })); setFormErrors(e => ({ ...e, name: undefined })); }}
                    placeholder="Event name"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${formErrors.name ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"}`} />
                  {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Slug <span className="text-red-400">*</span></label>
                  <input type="text" value={form.slug}
                    onChange={(e) => { setForm({ ...form, slug: slugify(e.target.value) }); setFormErrors(e => ({ ...e, slug: undefined })); }}
                    placeholder="event-slug"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${formErrors.slug ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"}`} />
                  {formErrors.slug && <p className="mt-1 text-xs text-red-500">{formErrors.slug}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Venue or city"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Event description..."
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Photo</label>
                  <label className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${imagePreview ? "border-primary/20 bg-primary/[0.02]" : "border-zinc-200 bg-zinc-50 hover:border-primary/30 hover:bg-primary/[0.02]"}`}>
                    <input type="file" accept="image/*" className="sr-only"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setForm({ ...form, image: "" }); const reader = new FileReader(); reader.onload = (ev) => setImagePreview(ev.target?.result as string); reader.readAsDataURL(file); } }} />
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 rounded-lg object-contain" />
                        <span className="mt-2 block text-center text-xs text-zinc-400 group-hover:text-primary transition-colors">Click to change photo</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="h-8 w-8 text-zinc-300 group-hover:text-primary/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                        <span className="text-sm font-medium text-zinc-400 group-hover:text-primary transition-colors">Upload photo</span>
                        <span className="text-xs text-zinc-300">PNG, JPG, WebP up to 10MB</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">&nbsp;</label>
                  <label className="flex cursor-pointer items-center gap-3 pt-4">
                    <div className="relative">
                      <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-zinc-200 transition-all duration-300 peer-checked:bg-primary" />
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm font-medium text-primary">Publish immediately</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t bg-zinc-50/50 px-6 py-4">
              <button onClick={() => setFormOpen(false)} className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60">
                {saving || uploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    {uploading ? "Uploading..." : "Saving..."}
                  </span>
                ) : <span className="relative z-10">{editing ? "Update Event" : "Create Event"}</span>}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-sm rounded-2xl border bg-white p-8 shadow-2xl mx-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-primary">Delete Event</h2>
                <p className="mt-2 text-sm text-zinc-500">Are you sure you want to delete <span className="font-semibold text-primary">&ldquo;{deleteTarget.name}&rdquo;</span>? This action cannot be undone.</p>
              </div>
              <div className="mt-2 flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-50">Cancel</button>
                <button onClick={handleDelete} disabled={deleting}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-60">
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!modal} type={modal?.type ?? "success"} title={modal?.title ?? ""} message={modal?.message ?? ""} onClose={() => setModal(null)} />
    </div>
  );
}
