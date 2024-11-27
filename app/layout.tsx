import { Toaster } from "@/components/shadcn/toaster";
import "./globals.css";
import { DialogProvider } from "@/hooks/use-dialog";
import DialogManager from "@/components/dialog-manager";

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
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-slate-100 text-black">
        <DialogProvider>
          <div className="min-h-screen w-full">{children}</div>
          <DialogManager />
        </DialogProvider>
        <Toaster />
      </body>
    </html>
  );
}
