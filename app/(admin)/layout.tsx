import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen">
      <div className="fixed w-52">
        <Sidebar />
      </div>
      <div className="ml-52 flex flex-1 flex-col overflow-y-auto p-4">
        <div className="flex flex-col min-h-[calc(100vh-32px)] bg-white rounded-2xl p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
