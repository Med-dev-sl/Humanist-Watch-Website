import PageHeader from "@/app/admin/page-header";

export default function Page() {
  return (
    <div className="p-8">
      <PageHeader title="Volunteer Management" description="Manage volunteer applications." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No volunteers yet</p>
        <p className="mt-1 text-sm text-zinc-400">Volunteer applications will appear here.</p>
      </div>
    </div>
  );
}
