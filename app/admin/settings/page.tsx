"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/app/admin/toast";
import PageHeader from "@/app/admin/page-header";
import Modal from "@/app/components/modal";
import LoadingSpinner from "@/app/components/loading-spinner";

type OrgData = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  mission: string | null;
  missionImage: string | null;
  vision: string | null;
  visionImage: string | null;
  aboutUs: string | null;
  aboutImage: string | null;
  whoWeAre: string | null;
  whoWeAreImage: string | null;
  whatWeDo: string | null;
  whatWeDoImage: string | null;
  history: string | null;
  historyImage: string | null;
};

const tabs = ["General", "About", "Who We Are", "What We Do", "History", "Mission & Vision"];

export default function AdminSettings() {
  const { showToast } = useToast();
  const [org, setOrg] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const [imageUpload, setImageUpload] = useState<{ field: string; file: File | null; preview: string | null }>({
    field: "", file: null, preview: null,
  });

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setOrg(data);
    } catch {
      showToast("error", "Error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  function update(field: string, value: string) {
    if (!org) return;
    setOrg({ ...org, [field]: value });
  }

  async function handleImageUpload(field: string) {
    const fileInput = document.getElementById(`img-${field}`) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "org");
    const res = await fetch("/api/upload", { method: "POST", body: uploadData });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error ?? "Upload failed");
    update(field, result.url);
    setImageUpload({ field: "", file: null, preview: null });
  }

  async function handleSave() {
    if (!org) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setOrg(data);
      showToast("success", "Saved", "Settings updated successfully.");
      setModal({ type: "success", title: "Settings Saved", message: "All content has been updated." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      showToast("error", "Error", msg);
    } finally {
      setSaving(false);
    }
  }

  function ImageField({ field, label }: { field: string; label: string }) {
    const value = org?.[field as keyof OrgData] as string | null;
    return (
      <div className="col-span-2 sm:col-span-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>
        <label className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all duration-300 ${value ? "border-primary/20 bg-primary/[0.02]" : "border-zinc-200 bg-zinc-50 hover:border-primary/30"}`}>
          <input id={`img-${field}`} type="file" accept="image/*" className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageUpload({ field, file, preview: URL.createObjectURL(file) });
                handleImageUpload(field);
              }
            }} />
          {value ? (
            <div className="relative w-full">
              <img src={value} alt="" className="mx-auto max-h-24 rounded-lg object-contain" />
              <span className="mt-1 block text-center text-xs text-zinc-400 group-hover:text-primary transition-colors">Click to change</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <svg className="h-6 w-6 text-zinc-300 group-hover:text-primary/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <span className="text-xs font-medium text-zinc-400 group-hover:text-primary transition-colors">Upload {label}</span>
            </div>
          )}
        </label>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="p-8">
        <PageHeader title="Site Settings" description="Manage organization content." />
        <p className="text-zinc-500">Failed to load settings.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader title="Site Settings" description="Manage organization content — About, Who We Are, What We Do, History, Mission & Vision." />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-zinc-200 bg-white p-1.5 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${activeTab === i ? "bg-primary text-white shadow-md" : "text-zinc-500 hover:text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* General */}
        {activeTab === 0 && (
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Organization Name</label>
                <input type="text" value={org.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Tagline</label>
                <input type="text" value={org.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Website</label>
                <input type="text" value={org.website ?? ""} onChange={(e) => update("website", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                <input type="email" value={org.email ?? ""} onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Phone</label>
                <input type="text" value={org.phone ?? ""} onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Address</label>
                <input type="text" value={org.address ?? ""} onChange={(e) => update("address", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
                <textarea rows={4} value={org.description ?? ""} onChange={(e) => update("description", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <ImageField field="logo" label="Logo" />
              <ImageField field="favicon" label="Favicon" />
              <div className="col-span-2">
                <h3 className="mb-3 text-sm font-semibold text-primary">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  {["facebook", "twitter", "instagram", "linkedin", "youtube"].map((s) => (
                    <div key={s}>
                      <label className="mb-1 block text-xs font-medium capitalize text-zinc-500">{s}</label>
                      <input type="text" value={(org[s as keyof OrgData] as string) ?? ""} onChange={(e) => update(s, e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        {activeTab === 1 && (
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">About Us Content</label>
                <textarea rows={12} value={org.aboutUs ?? ""} onChange={(e) => update("aboutUs", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <ImageField field="aboutImage" label="About Photo" />
            </div>
          </div>
        )}

        {/* Who We Are */}
        {activeTab === 2 && (
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Who We Are Content</label>
                <textarea rows={12} value={org.whoWeAre ?? ""} onChange={(e) => update("whoWeAre", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <ImageField field="whoWeAreImage" label="Photo" />
            </div>
          </div>
        )}

        {/* What We Do */}
        {activeTab === 3 && (
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">What We Do Content</label>
                <textarea rows={12} value={org.whatWeDo ?? ""} onChange={(e) => update("whatWeDo", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <ImageField field="whatWeDoImage" label="Photo" />
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 4 && (
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">History Content</label>
                <textarea rows={12} value={org.history ?? ""} onChange={(e) => update("history", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <ImageField field="historyImage" label="History Photo" />
            </div>
          </div>
        )}

        {/* Mission & Vision */}
        {activeTab === 5 && (
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Mission</label>
                <textarea rows={6} value={org.mission ?? ""} onChange={(e) => update("mission", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Vision</label>
                <textarea rows={6} value={org.vision ?? ""} onChange={(e) => update("vision", e.target.value)}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5" />
              </div>
              <ImageField field="missionImage" label="Mission Photo" />
              <ImageField field="visionImage" label="Vision Photo" />
            </div>
          </div>
        )}

        {/* Save Footer */}
        <div className="flex items-center justify-end border-t bg-zinc-50/50 px-6 py-4">
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
            ) : (
              <span className="relative z-10">Save All Settings</span>
            )}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </div>
      </div>

      <Modal open={!!modal} type={modal?.type ?? "success"} title={modal?.title ?? ""} message={modal?.message ?? ""} onClose={() => setModal(null)} />
    </div>
  );
}
