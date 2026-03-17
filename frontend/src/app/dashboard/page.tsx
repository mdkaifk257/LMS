'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Enrollment } from '../../types';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/my-enrollments');
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      }
    };

    const userStr = Cookies.get('user');
    if (!userStr) {
      router.push('/login');
    } else {
      fetchEnrollments();
    }
  }, [router]);

  const totalLessons = enrollments.reduce((acc, curr) => acc + curr.total_videos, 0);
  const completedLessons = enrollments.reduce((acc, curr) => acc + curr.completed_videos, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Welcome back! Track your progress and jump back into learning.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/courses" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105">
            Browse New Courses
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: '', color: 'bg-blue-500' },
          { label: 'Total Lessons', value: totalLessons, icon: '', color: 'bg-purple-500' },
          { label: 'Completed', value: completedLessons, icon: '', color: 'bg-green-500' },
          { label: 'Success Rate', value: `${totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%`, icon: '', color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition hover:shadow-2xl">
            <div className={`${stat.color} p-3 rounded-xl text-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          <span className="mr-2"></span> Keep Learning
        </h2>
        
        {enrollments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-lg text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4"></div>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-6 font-medium">Your learning journey starts here!</p>
            <Link href="/courses" className="text-white bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold shadow-lg transition">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((course) => (
              <div key={course.enrollment_id} className="group bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl shadow-lg overflow-hidden flex flex-col transition hover:shadow-2xl hover:-translate-y-1">
                <div className="relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {course.total_videos} Lessons
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h5 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.title}</h5>
                  <p className="mb-5 font-normal text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed">{course.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {Math.round((course.completed_videos / course.total_videos) * 100) || 0}% Complete
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {course.completed_videos} / {course.total_videos} lessons
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-6 dark:bg-gray-700">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-1000 shadow-sm" 
                        style={{ width: `${course.total_videos > 0 ? (course.completed_videos / course.total_videos) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <Link href={`/learn/${course.id}`} className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-center text-white bg-blue-600 rounded-2xl hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full transition shadow-md">
                      Resume Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
