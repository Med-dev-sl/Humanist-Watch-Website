import PageHeader from "@/app/admin/page-header";

export default function Page() {
  return (
    <div className="p-8">
      <PageHeader title="Gallery" description="Manage photo albums and images." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No galleries yet</p>
        <p className="mt-1 text-sm text-zinc-400">Photo albums will appear here once created.</p>
      </div>
    </div>
  );
}
