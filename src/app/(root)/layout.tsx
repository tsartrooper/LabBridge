import { Sidebar } from "@/components/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard 💵 | Real-time bidding platform",
  description: "Bidding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="md:block hidden">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}