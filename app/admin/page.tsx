import Icon from "@/app/components/mui-icon";

const stats = [
  { label: "Total Users", value: "0", icon: "group", color: "from-blue-500 to-blue-600" },
  { label: "Programs", value: "0", icon: "assignment", color: "from-emerald-500 to-emerald-600" },
  { label: "Blog Posts", value: "0", icon: "article", color: "from-amber-500 to-amber-600" },
  { label: "Donations", value: "0", icon: "payments", color: "from-violet-500 to-violet-600" },
  { label: "Team Members", value: "0", icon: "badge", color: "from-rose-500 to-rose-600" },
  { label: "Volunteers", value: "0", icon: "handshake", color: "from-cyan-500 to-cyan-600" },
];

export default function AdminDashboard() {
  return (
    <div className="animate-slide-left p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back. Here is an overview of your organization.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group animate-slide-up rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                <p className="mt-2 font-heading text-4xl font-bold text-primary">{stat.value}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon name={stat.icon} className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-100">
              <div
                className={`h-full w-0 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 group-hover:w-3/4`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="animate-slide-up rounded-2xl border bg-white p-6 shadow-sm" style={{ animationDelay: "400ms" }}>
          <h2 className="font-heading text-lg font-semibold text-primary">Recent Activity</h2>
          <p className="mt-4 text-center text-sm text-zinc-400">No recent activity to display.</p>
        </div>
        <div className="animate-slide-up rounded-2xl border bg-white p-6 shadow-sm" style={{ animationDelay: "500ms" }}>
          <h2 className="font-heading text-lg font-semibold text-primary">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["New Post", "Add User", "Create Program", "View Reports"].map((action) => (
              <button
                key={action}
                className="rounded-xl border border-primary/10 bg-primary/[0.03] px-4 py-3 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
