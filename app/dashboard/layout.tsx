import Sidebar from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-white text-black sm:ml-64">
      <Sidebar />
      {children}
    </div>
  );
}
