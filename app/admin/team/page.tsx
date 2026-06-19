import PageHeader from "@/app/admin/page-header";

export default function Page() {
  return (
    <div className="p-8">
      <PageHeader title="Team Members" description="Manage staff and board members." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No team members yet</p>
        <p className="mt-1 text-sm text-zinc-400">Team profiles will appear here once added.</p>
      </div>
    </div>
  );
}
