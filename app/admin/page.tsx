import PageHeader from "@/app/admin/page-header";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <PageHeader title="Dashboard" description="Welcome to the admin panel." />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500">Total Users</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500">Programs</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500">Blog Posts</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500">Donations</p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
}
