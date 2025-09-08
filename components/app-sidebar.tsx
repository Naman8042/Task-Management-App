"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, PlusCircle, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition ${
      pathname === path ? "bg-black text-white" : "hover:bg-black hover:text-white"
    }`;

  return (
    <div className="fixed left-0 h-screen w-64 bg-white text-black flex-col border-r border-black hidden sm:flex">
      {/* Sidebar Header */}
      <div className="p-6 text-2xl font-bold">Task Manager</div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className={linkClasses("/dashboard")}>
          <LayoutList size={20} />
          <span>View Tasks</span>
        </Link>

        <Link href="/dashboard/addtask" className={linkClasses("/dashboard/addtask")}>
          <PlusCircle size={20} />
          <span>Add Task</span>
        </Link>
      </nav>

      {/* Logout at Bottom */}
      <div className="p-4">
        <button
          onClick={() => console.log("Logout clicked")}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
