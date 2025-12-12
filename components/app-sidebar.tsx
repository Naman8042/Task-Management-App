"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LayoutList, PlusCircle, LogOut, User } from "lucide-react"; // Import User icon



// Updated component signature to accept userEmail
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session} = useSession();
  
  // Extract the email
  const userEmail = session?.user?.email;

  // Unified function for link styling
  const linkClasses = (path: string) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
      pathname === path 
        ? "bg-indigo-600 text-white shadow-md" // Primary color for active state
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  // Style for the logout button (looks like a link)
  const logoutClasses = 
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200 text-gray-700  hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20";


  return (
    <>
      {/* 1. MOBILE BOTTOM NAVIGATION (Logout icon/label is already implemented) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 
                      flex w-full bg-white border-t border-gray-200 
                      sm:hidden p-2 justify-around">

        {/* Mobile Link - View Tasks */}
        <Link href="/dashboard" className={`flex flex-col items-center  p-1.5 transition-colors ${
          pathname === "/dashboard" ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-indigo-600"
        }`}>
          <LayoutList size={22} />
          <span className="text-xs">Tasks</span>
        </Link>

        {/* Mobile Link - Add Task */}
        <Link href="/dashboard/addtask" className={`flex flex-col items-center p-1.5 transition-colors ${
          pathname === "/dashboard/addtask" ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-indigo-600"
        }`}>
          <PlusCircle size={22} />
          <span className="text-xs">Add</span>
        </Link>

        {/* Mobile Logout Button (Icon and label are present) */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex flex-col items-center p-1.5 text-gray-500  transition-colors"
        >
          <LogOut size={22} />
          <span className="text-xs">Logout</span>
        </button>
      </nav>

      
      {/* 2. DESKTOP/TABLET SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-64 
                      bg-white text-black flex-col border-r border-gray-200 
                      hidden sm:flex dark:bg-gray-900 dark:border-gray-800">
        
        {/* Sidebar Header */}
        <div className="p-6 text-2xl font-extrabold text-indigo-600">FocusFlow</div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className={linkClasses("/dashboard")}>
            <LayoutList size={20} />
            <span>View Tasks</span>
          </Link>

          <Link href="/dashboard/addtask" className={linkClasses("/dashboard/addtask")}>
            <PlusCircle size={20} />
            <span>Add Task</span>
          </Link>
        </nav>

        {/* 3. LOGOUT AREA WITH USER EMAIL */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            
            {/* Display User Email */}
            {userEmail && (
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <User size={18} className="text-indigo-500"/>
                    <span className="truncate" title={userEmail}>
                        {userEmail}
                    </span>
                </div>
            )}
            
            {/* Logout Button (Icon is present) */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={logoutClasses}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}