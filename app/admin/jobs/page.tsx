import PageHeader from "@/app/admin/page-header";

export default function Page() {
  return (
    <div className="p-8">
      <PageHeader title="Jobs" description="Manage job openings and applications." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No job openings yet</p>
        <p className="mt-1 text-sm text-zinc-400">Job listings will appear here once created.</p>
      </div>
    </div>
  );
}
