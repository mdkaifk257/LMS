'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User, Mail, Calendar, Shield, Camera } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Header Cover */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-3xl bg-white dark:bg-gray-900 p-2 shadow-2xl relative group">
              <div className="w-full h-full rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl text-blue-600 font-bold overflow-hidden">
                {user.name.charAt(0)}
              </div>
              <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                <Camera className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-10 px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{user.name}</h1>
              <p className="text-blue-600 font-semibold">{user.role} Account</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-200 transition">
                Edit Profile
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                Contact Support
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Email Address</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Full Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Membership Type</p>
                  <p className="text-gray-900 dark:text-white font-medium">Standard {user.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Member Since</p>
                  <p className="text-gray-900 dark:text-white font-medium">March 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
