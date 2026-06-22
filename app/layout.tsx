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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
