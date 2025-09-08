import Sidebar from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex sm:flex-row flex-col bg-white text-black sm:ml-64">
      <Sidebar />
      {children}
    </div>
  );
}
