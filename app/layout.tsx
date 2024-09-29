import AuthButton from "@/components/ui/button/sign-out";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3001";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ChartQ Admin",
  description: "A website for administrators of ChartQ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-slate-100 text-black">
        <div className="min-h-screen w-full">{children}</div>
      </body>
    </html>
  );
}
