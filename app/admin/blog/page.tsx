import PageHeader from "@/app/admin/page-header";

export default function Page() {
  return (
    <div className="p-8">
      <PageHeader title="Blog Posts" description="Manage blog and news articles." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No blog posts yet</p>
        <p className="mt-1 text-sm text-zinc-400">Articles will appear here once published.</p>
      </div>
    </div>
  );
}
