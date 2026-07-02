import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientOps AI Dashboard",
  description:
    "A polished SaaS-style admin dashboard for client operations, project management, and future AI automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
