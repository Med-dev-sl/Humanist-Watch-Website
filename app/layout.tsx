import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "@/app/layout-content";

export const metadata: Metadata = {
  title: "Humanist Watch Salone",
  description: "Humanist Watch Salone",
  icons: [{ rel: "icon", url: "/Huwasal%20Logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
