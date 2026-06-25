import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getStats() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    verifyToken(token);
  } catch {
    return null;
  }

  const [
    userCount,
    programCount,
    blogCount,
    eventCount,
    teamCount,
    partnerCount,
    beneficiaryCount,
    jobCount,
    contactCount,
    volunteerCount,
    donationCount,
    galleryCount,
    unreadDonations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.program.count(),
    prisma.blogPost.count(),
    prisma.event.count(),
    prisma.teamMember.count(),
    prisma.partner.count(),
    prisma.beneficiary.count(),
    prisma.job.count(),
    prisma.contact.count(),
    prisma.volunteer.count(),
    prisma.donation.count(),
    prisma.gallery.count(),
    prisma.donation.count({ where: { read: false } }),
  ]);

  const totalDonations = await prisma.donation.aggregate({ _sum: { amount: true } });

  return {
    users: userCount,
    programs: programCount,
    blog: blogCount,
    events: eventCount,
    team: teamCount,
    partners: partnerCount,
    beneficiaries: beneficiaryCount,
    jobs: jobCount,
    contacts: contactCount,
    volunteers: volunteerCount,
    donations: donationCount,
    donationTotal: totalDonations._sum.amount ?? 0,
    galleries: galleryCount,
    unreadDonations,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Users", value: stats?.users ?? 0, icon: "👥", color: "from-violet-500 to-violet-600" },
    { label: "Programs", value: stats?.programs ?? 0, icon: "📋", color: "from-blue-500 to-blue-600" },
    { label: "Blog Posts", value: stats?.blog ?? 0, icon: "📝", color: "from-emerald-500 to-emerald-600" },
    { label: "Events", value: stats?.events ?? 0, icon: "📅", color: "from-amber-500 to-amber-600" },
    { label: "Team Members", value: stats?.team ?? 0, icon: "👤", color: "from-cyan-500 to-cyan-600" },
    { label: "Partners", value: stats?.partners ?? 0, icon: "🤝", color: "from-indigo-500 to-indigo-600" },
    { label: "Beneficiaries", value: stats?.beneficiaries ?? 0, icon: "❤️", color: "from-rose-500 to-rose-600" },
    { label: "Jobs", value: stats?.jobs ?? 0, icon: "💼", color: "from-teal-500 to-teal-600" },
    { label: "Contact Messages", value: stats?.contacts ?? 0, icon: "✉️", color: "from-orange-500 to-orange-600" },
    { label: "Volunteers", value: stats?.volunteers ?? 0, icon: "🙋", color: "from-pink-500 to-pink-600" },
    { label: "Galleries", value: stats?.galleries ?? 0, icon: "🖼️", color: "from-purple-500 to-purple-600" },
    { label: "Donations", value: stats?.donations ?? 0, icon: "💰", color: "from-green-500 to-green-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">System overview and statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="group relative overflow-hidden rounded-xl border border-primary/10 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <div className={`absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br ${card.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10`} />
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-primary">{card.value}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-zinc-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Donation Summary */}
      {stats && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-lg">
          <div className="border-b border-primary/10 bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Donation Summary</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Donations</p>
              <p className="mt-1 text-2xl font-bold text-primary">{stats.donations}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Amount</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.donationTotal)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Unread</p>
              <p className={`mt-1 text-2xl font-bold ${stats.unreadDonations > 0 ? "text-red-500" : "text-primary"}`}>
                {stats.unreadDonations}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-lg">
        <div className="border-b border-primary/10 bg-gradient-to-r from-primary/[0.03] to-transparent px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/admin/programs" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.02] p-4 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">📋</span>
            Manage Programs
          </a>
          <a href="/admin/blog" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.02] p-4 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">📝</span>
            Manage Blog
          </a>
          <a href="/admin/events" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.02] p-4 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">📅</span>
            Manage Events
          </a>
          <a href="/admin/users" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.02] p-4 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">👥</span>
            Manage Users
          </a>
          <a href="/admin/settings" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.02] p-4 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">⚙️</span>
            Site Settings
          </a>
          <a href="/admin/audit-logs" className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/[0.02] p-4 text-sm font-medium text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.05] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">📋</span>
            View Audit Logs
          </a>
        </div>
      </div>
    </div>
  );
}
