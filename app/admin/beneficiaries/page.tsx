import PageHeader from "@/app/admin/page-header";

export default function Page() {
  return (
    <div className="p-8">
      <PageHeader title="Beneficiaries" description="Manage beneficiary records." />
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-medium text-primary">No beneficiaries yet</p>
        <p className="mt-1 text-sm text-zinc-400">Beneficiary records will appear here once added.</p>
      </div>
    </div>
  );
}
