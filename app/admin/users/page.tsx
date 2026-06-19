import PageHeader from "@/app/admin/page-header";

export default function AdminUsers() {
  return (
    <div className="p-8">
      <PageHeader title="Users" description="Manage system users and their roles." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No users yet</p>
        <p className="mt-1 text-sm text-zinc-400">Users will appear here once added.</p>
      </div>
    </div>
  );
}
