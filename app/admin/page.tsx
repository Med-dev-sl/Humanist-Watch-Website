export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Welcome to the admin panel.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Programs</p>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Blog Posts</p>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
}
