"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname.startsWith("/admin");

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  );
}
