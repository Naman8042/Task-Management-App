"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LayoutList, PlusCircle, LogOut, User, Settings } from "lucide-react"; 


export default function Sidebar() {
  const pathname = usePathname();
  const { data: session} = useSession();
  const userEmail = session?.user?.email;

  // IMPROVEMENT: Use the 'exact' flag to control strict matching
  const linkClasses = (path: string, exact: boolean = false) => {
    // 1. Check for active state:
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    
    return `flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
      isActive 
        ? "bg-indigo-600 text-white shadow-md" 
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;
  };

  const logoutClasses = 
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20";


  return (
    <>
      {/* 1. MOBILE BOTTOM NAVIGATION (Simplified logic for mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 
                      flex w-full bg-white border-t border-gray-200 
                      sm:hidden p-2 justify-around">

        {/* Mobile Link - View Tasks (EXACT MATCH) */}
        <Link href="/dashboard" className={`flex flex-col items-center p-1.5 transition-colors ${
          pathname === "/dashboard" ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-indigo-600"
        }`}>
          <LayoutList size={22} />
          <span className="text-xs">Tasks</span>
        </Link>

        {/* Mobile Link - Add Task (EXACT MATCH) */}
        <Link href="/dashboard/addtask" className={`flex flex-col items-center p-1.5 transition-colors ${
          pathname === "/dashboard/addtask" ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-indigo-600"
        }`}>
          <PlusCircle size={22} />
          <span className="text-xs">Add</span>
        </Link>
        
        {/* Mobile Link - Settings (STARTS WITH MATCH) */}
        <Link href="/settings/profile" className={`flex flex-col items-center p-1.5 transition-colors ${
          pathname.startsWith("/settings") ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-indigo-600"
        }`}>
          <Settings size={22} />
          <span className="text-xs">Settings</span>
        </Link>

        {/* Mobile Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex flex-col items-center p-1.5 text-gray-500 hover:text-red-600 transition-colors"
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
          {/* Use EXACT MATCH for the dashboard root page */}
          <Link href="/dashboard" className={linkClasses("/dashboard", true)}> 
            <LayoutList size={20} />
            <span>View Tasks</span>
          </Link>

          {/* Use EXACT MATCH for the add task page */}
          <Link href="/dashboard/addtask" className={linkClasses("/dashboard/addtask", true)}>
            <PlusCircle size={20} />
            <span>Add Task</span>
          </Link>
          
          {/* Use STARTS WITH MATCH for the settings section */}
          <Link href="/settings/profile" className={linkClasses("/settings")}> 
            <Settings size={20} />
            <span>Settings</span>
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
            
            {/* Logout Button */}
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