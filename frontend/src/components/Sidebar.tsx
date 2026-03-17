'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, LayoutDashboard, Settings, User, Bot, Sparkles } from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const isActive = (path: string) => pathname.startsWith(path);

  if (!role) return null; // Don't show sidebar if not logged in

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link href={role === 'Admin' ? '/admin' : '/dashboard'} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive(role === 'Admin' ? '/admin' : '/dashboard') ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
              <LayoutDashboard className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>
          
          {role === 'Student' && (
            <>
              <li>
                <Link href="/courses" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/courses') ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                  <BookOpen className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Browse Courses</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/profile') ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                  <User className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">My Profile</span>
                </Link>
              </li>
              <li className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Help & AI</div>
                
                <Link href="/ai-assistant" className={`flex items-center p-2 rounded-lg transition-all duration-300 group ${isActive('/ai-assistant') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                   <div className={`p-1 rounded-lg transition-all ${isActive('/ai-assistant') ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-110 animate-pulse' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Bot className="w-4 h-4" />
                   </div>
                   <span className="ms-3 font-bold">AI Assistant</span>
                   {isActive('/ai-assistant') && <Sparkles className="w-3 h-3 ml-2 text-yellow-500 animate-bounce" />}
                </Link>

                <Link href="/support" className={`flex items-center p-2 rounded-lg transition-all group ${isActive('/support') ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                   <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Settings className="w-4 h-4" />
                   </div>
                   <span className="ms-3">Support Center</span>
                </Link>
              </li>
            </>
          )}

          {role === 'Admin' && (
            <li>
              <Link href="/admin/courses" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/admin/courses') ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                <Settings className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Manage Courses</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}
