"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/app/admin/page-header";
import LoadingSpinner from "@/app/components/loading-spinner";

type AuditLog = {
  id: string;
  userId: string | null;
  userEmail: string | null;
  name: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
};

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (entityFilter) params.set("entity", entityFilter);
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : data.logs ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [search, entityFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const entities = [...new Set(logs.map((l) => l.entity))];

  return (
    <div className="p-8">
      <PageHeader title="Audit Logs" description="Track all system actions and changes." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-primary placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
          />
        </div>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary/40 focus:shadow-lg focus:shadow-primary/5"
        >
          <option value="">All Entities</option>
          {entities.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <button onClick={fetchLogs} className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
          Refresh
        </button>
      </div>

      <div className="animate-fade-in overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-primary">No audit logs yet</p>
            <p className="mt-1 text-sm text-zinc-400">System actions will be recorded here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            <div className="grid grid-cols-[90px_130px_150px_1fr_140px] gap-4 bg-zinc-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>Action</span>
              <span>Entity</span>
              <span>User</span>
              <span>Details</span>
              <span>Date</span>
            </div>
            {logs.map((log, i) => (
              <div
                key={log.id}
                style={{ animationDelay: `${i * 30}ms` }}
                className="animate-slide-up grid grid-cols-[90px_130px_150px_1fr_140px] gap-4 px-6 py-3.5 text-sm transition-colors hover:bg-zinc-50"
              >
                <div className="flex items-center">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${actionColors[log.action] ?? "bg-zinc-100 text-zinc-600"}`}>
                    {log.action}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="capitalize text-zinc-600">{log.entity}</span>
                </div>
                <div className="min-w-0 flex items-center">
                  <span className="truncate text-zinc-500">{log.userEmail ?? log.name ?? "System"}</span>
                </div>
                <div className="min-w-0 flex items-center">
                  <span className="truncate text-zinc-600" title={log.details ?? ""}>{log.details ?? "—"}</span>
                </div>
                <div className="flex items-center text-xs text-zinc-400">
                  {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
