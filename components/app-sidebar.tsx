"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutList, PlusCircle, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition ${
      pathname === path ? "bg-black text-white" : "hover:bg-black hover:text-white"
    }`;

  return (
    <>
    
         <nav className="flex p-2 px-6 space-x-2 sm:hidden w-full bg-white border-t border-gray-300 justify-between">
      <Link href="/dashboard" className={linkClasses("/dashboard")}>
        View Tasks
      </Link>

      <Link href="/dashboard/addtask" className={linkClasses("/dashboard/addtask")}>
        Add Task
      </Link>
    </nav>

    
    
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
           onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>

    </>  );
}
