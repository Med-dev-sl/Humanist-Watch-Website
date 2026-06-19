import PageHeader from "@/app/admin/page-header";

export default function AdminPrograms() {
  return (
    <div className="p-8">
      <PageHeader title="Programs & Projects" description="Manage NGO programs and projects." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No programs yet</p>
        <p className="mt-1 text-sm text-zinc-400">Programs will appear here once created.</p>
      </div>
    </div>
  );
}
