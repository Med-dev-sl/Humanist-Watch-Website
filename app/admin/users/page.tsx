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
  role: "SUPERADMIN" | "WEBSITE_ADMINISTRATOR" | "ADMIN";
  image: string | null;
  bio: string | null;
  createdAt: string;
};

type FormData = {
  name: string;
  email: string;
  role: "SUPERADMIN" | "WEBSITE_ADMINISTRATOR" | "ADMIN";
  password: string;
  bio: string;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  role: "ADMIN",
  password: "",
  bio: "",
};

const roleColors: Record<string, string> = {
  SUPERADMIN: "bg-red-50 text-red-700",
  WEBSITE_ADMINISTRATOR: "bg-blue-50 text-blue-700",
  ADMIN: "bg-green-50 text-green-700",
};

const roleDotColors: Record<string, string> = {
  SUPERADMIN: "bg-red-500",
  WEBSITE_ADMINISTRATOR: "bg-blue-500",
  ADMIN: "bg-green-500",
};

export default function AdminUsers() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users ?? []);
    } catch {
      showToast("error", "Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (formOpen && editing) {
      setForm({
        name: editing.name,
        email: editing.email,
        role: editing.role,
        password: "",
        bio: editing.bio ?? "",
      });
      setFormErrors({});
    } else if (formOpen && !editing) {
      setForm(emptyForm);
      setFormErrors({});
    }
  }, [formOpen, editing]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setFormOpen(true);
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email format";
    if (!editing && !form.password.trim()) errors.password = "Password is required";
    else if (!editing && form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!form.role) errors.role = "Role is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, bio: form.bio };
      if (!editing) payload.password = form.password;

      const url = editing ? `/api/admin/users/${editing.id}` : "/api/admin/users";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setFormOpen(false);
      showToast("success", editing ? "Updated" : "Created", `User "${form.name}" ${editing ? "updated" : "created"} successfully.`);
      setModal({ type: "success", title: editing ? "User Updated" : "User Created", message: `"${form.name}" has been ${editing ? "updated" : "created"}.` });
      fetchUsers();
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
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      setDeleteTarget(null);
      showToast("success", "Deleted", `User "${deleteTarget.name}" deleted.`);
      setModal({ type: "success", title: "User Deleted", message: `"${deleteTarget.name}" has been removed.` });
      fetchUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      showToast("error", "Error", msg);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = users.filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="p-8">
      <PageHeader title="Users" description="Manage admin users and their roles." />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
          />
        </div>
        <button
          onClick={openCreate}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New User
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">
              {search ? "No matching users" : "No users yet"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {search ? "Try a different search." : "Create your first user to get started."}
            </p>
            {!search && (
              <button onClick={openCreate} className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                Create User
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[1fr_1.2fr_150px_160px_100px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Name</span>
              <span>Email</span>
              <span className="text-center">Role</span>
              <span className="text-center">Created</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((user, i) => (
              <div
                key={user.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-slide-up grid grid-cols-[1fr_1.2fr_150px_160px_100px] gap-4 px-6 py-4 text-sm transition-colors hover:bg-zinc-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-primary">{user.name}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-zinc-500">{user.email}</p>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${roleColors[user.role]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${roleDotColors[user.role]}`} />
                    {user.role === "WEBSITE_ADMINISTRATOR" ? "Website Admin" : user.role}
                  </span>
                </div>
                <div className="flex items-center justify-center text-xs text-zinc-400">
                  {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(user)}
                    className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-primary/5 hover:text-primary"
                    title="Edit"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.219l-4.5 1.28 1.28-4.5L16.862 3.488z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
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

      {users.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400">
          Showing {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Create/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
          <div className="animate-scale-in relative w-full max-w-2xl rounded-2xl border bg-white shadow-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-primary">
                  {editing ? "Edit User" : "Create User"}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {editing ? "Update the user details below." : "Fill in the details to create a new user."}
                </p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="rounded-xl p-2 text-zinc-400 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="Full name"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${
                      formErrors.name ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"
                    }`}
                  />
                  {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      setFormErrors({ ...formErrors, email: undefined });
                    }}
                    placeholder="user@example.com"
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${
                      formErrors.email ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"
                    }`}
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => {
                      setForm({ ...form, role: e.target.value as FormData["role"] });
                      setFormErrors({ ...formErrors, role: undefined });
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:shadow-lg focus:shadow-primary/5 ${
                      formErrors.role ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"
                    }`}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="WEBSITE_ADMINISTRATOR">Website Administrator</option>
                    <option value="SUPERADMIN">Superadmin</option>
                  </select>
                  {formErrors.role && <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>}
                </div>

                {!editing && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setFormErrors({ ...formErrors, password: undefined });
                      }}
                      placeholder="Min. 6 characters"
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:shadow-lg focus:shadow-primary/5 ${
                        formErrors.password ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-primary/40"
                      }`}
                    />
                    {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
                  </div>
                )}

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Bio</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Brief bio..."
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 placeholder-zinc-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="relative z-10">{editing ? "Update User" : "Create User"}</span>
                )}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
                <h2 className="font-heading text-lg font-semibold text-primary">Delete User</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Are you sure you want to delete <span className="font-semibold text-primary">&ldquo;{deleteTarget.name}&rdquo;</span>? This action cannot be undone.
                </p>
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
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
