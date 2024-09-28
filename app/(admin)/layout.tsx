import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
