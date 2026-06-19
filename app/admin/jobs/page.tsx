"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/app/admin/toast";
import PageHeader from "@/app/admin/page-header";
import Modal from "@/app/components/modal";
import LoadingSpinner from "@/app/components/loading-spinner";

type Job = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  location: string | null;
  type: string;
  deadline: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  location: string;
  type: string;
  deadline: string;
  published: boolean;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  location: "",
  type: "full-time",
  deadline: "",
  published: false,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminJobs() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/jobs?${params}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : data.jobs ?? []);
    } catch {
      showToast("error", "Error", "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, search, showToast]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (formOpen && editing) {
      setForm({
        title: editing.title,
        slug: editing.slug,
        description: editing.description ?? "",
        content: editing.content ?? "",
        location: editing.location ?? "",
        type: editing.type ?? "full-time",
        deadline: editing.deadline ? editing.deadline.split("T")[0] : "",
        published: editing.published,
      });
      setFormErrors({});
    } else if (formOpen && !editing) {
      setForm(emptyForm);
      setFormErrors({});
    }
  }, [formOpen, editing]);

  function openCreate() { setEditing(null); setForm(emptyForm); setFormErrors({}); setFormOpen(true); }

  function openEdit(job: Job) { setEditing(job); setFormOpen(true); }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.slug.trim()) errors.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = "Slug must be lowercase with hyphens";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        deadline: form.deadline || null,
      };
      const url = editing ? `/api/admin/jobs/${editing.id}` : "/api/admin/jobs";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setFormOpen(false);
      showToast("success", editing ? "Updated" : "Created", `Job "${form.title}" ${editing ? "updated" : "created"} successfully.`);
      setModal({ type: "success", title: editing ? "Job Updated" : "Job Created", message: `"${form.title}" has been ${editing ? "updated" : "created"}.` });
      fetchJobs();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      showToast("error", "Error", msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteTarget(null);
      showToast("success", "Deleted", `Job "${deleteTarget.title}" deleted.`);
      setModal({ type: "success", title: "Job Deleted", message: `"${deleteTarget.title}" has been removed.` });
      fetchJobs();
    } catch {
      showToast("error", "Error", "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleStatus(job: Job) {
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: job.title, slug: job.slug, description: job.description,
          content: job.content, location: job.location, type: job.type,
          deadline: job.deadline, published: !job.published,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      showToast("success", "Status Updated", `"${job.title}" is now ${!job.published ? "Published" : "Draft"}.`);
      fetchJobs();
    } catch {
      showToast("error", "Error", "Failed to update status");
    }
  }

  const filtered = jobs.filter((j) => {
    if (search) {
      const q = search.toLowerCase();
      if (!j.title.toLowerCase().includes(q) && !(j.description ?? "").toLowerCase().includes(q) && !(j.location ?? "").toLowerCase().includes(q)) return false;
    }
    if (statusFilter === "published") return j.published;
    if (statusFilter === "draft") return !j.published;
    return true;
  });

  const typeBadge = (type: string) => {
    const styles: Record<string, string> = {
      "full-time": "bg-blue-50 text-blue-700",
      "part-time": "bg-purple-50 text-purple-700",
      contract: "bg-orange-50 text-orange-700",
    };
    return styles[type] ?? "bg-zinc-50 text-zinc-600";
  };

  return (
    <div className="p-8">
      <PageHeader title="Jobs" description="Manage job openings and applications." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
          </div>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {(["all", "published", "draft"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${statusFilter === s ? "bg-primary text-white shadow-md" : "text-zinc-500 hover:text-primary"}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {["all", "full-time", "part-time", "contract"].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${typeFilter === t ? "bg-primary text-white shadow-md" : "text-zinc-500 hover:text-primary"}`}>{t.replace("-", " ")}</button>
            ))}
          </div>
        </div>
        <button onClick={openCreate}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25">
          <span className="relative z-10 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Job
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">{search || statusFilter !== "all" || typeFilter !== "all" ? "No matching jobs" : "No job openings yet"}</p>
            <p className="mt-1 text-sm text-zinc-400">{search || statusFilter !== "all" || typeFilter !== "all" ? "Try a different search or filter." : "Create your first job listing to get started."}</p>
            {!search && statusFilter === "all" && typeFilter === "all" && (
              <button onClick={openCreate} className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">Create Job</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[1fr_100px_100px_130px_80px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Title</span><span className="text-center">Type</span><span className="text-center">Status</span><span className="text-center">Created</span><span className="text-right">Actions</span>
            </div>
            {filtered.map((job, i) => (
              <div key={job.id} style={{ animationDelay: `${i * 40}ms` }}
                className="animate-slide-up grid grid-cols-[1fr_100px_100px_130px_80px] gap-4 px-6 py-4 text-sm transition-colors hover:bg-zinc-50">
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">{job.title}</p>
                  <p className="truncate text-xs text-zinc-400">/{job.slug} {job.location && `— ${job.location}`}</p>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeBadge(job.type)}`}>{job.type.replace("-", " ")}</span>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={() => toggleStatus(job)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${job.published ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${job.published ? "bg-green-500" : "bg-amber-500"}`} />
                    {job.published ? "Published" : "Draft"}
                  </button>
                </div>
                <div className="flex items-center justify-center text-xs text-zinc-400">
                  {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(job)} className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-primary/5 hover:text-primary" title="Edit">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.219l-4.5 1.28 1.28-4.5L16.862 3.488z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(job)} className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500" title="Delete">
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
      {jobs.length > 0 && <p className="mt-4 text-xs text-zinc-400">Showing {filtered.length} of {jobs.length} job{jobs.length !== 1 ? "s" : ""}</p>}

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
          <div className="animate-scale-in relative w-full max-w-2xl rounded-2xl border bg-white shadow-2xl mx-4">
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-primary">{editing ? "Edit Job" : "Create Job"}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{editing ? "Update the job details below." : "Fill in the details to create a new job listing."}</p>
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={form.title}
                    onChange={(e) => { setForm({ ...form, title: e.target.value }); if (!editing) setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) })); else setForm(f => ({ ...f, title: e.target.value })); setFormErrors(e => ({ ...e, title: undefined })); }}
                    placeholder="Job title"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${formErrors.title ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"}`} />
                  {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Slug <span className="text-red-400">*</span></label>
                  <input type="text" value={form.slug}
                    onChange={(e) => { setForm({ ...form, slug: slugify(e.target.value) }); setFormErrors(e => ({ ...e, slug: undefined })); }}
                    placeholder="job-slug"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${formErrors.slug ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"}`} />
                  {formErrors.slug && <p className="mt-1 text-xs text-red-500">{formErrors.slug}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Freetown, Sierra Leone"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of the role..."
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Content</label>
                  <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Full job description, requirements, and how to apply..."
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                </div>
                <div className="col-span-2">
                  <label className="flex cursor-pointer items-center gap-3">
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
              <button onClick={handleSave} disabled={saving}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : <span className="relative z-10">{editing ? "Update Job" : "Create Job"}</span>}
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
                <h2 className="font-heading text-lg font-semibold text-primary">Delete Job</h2>
                <p className="mt-2 text-sm text-zinc-500">Are you sure you want to delete <span className="font-semibold text-primary">&ldquo;{deleteTarget.title}&rdquo;</span>? This action cannot be undone.</p>
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
