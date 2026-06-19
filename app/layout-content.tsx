"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
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
