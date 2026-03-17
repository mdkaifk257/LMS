import Link from 'next/link';
import { BookOpen, Award, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Master new skills with</span>{' '}
          <span className="block text-blue-600 dark:text-blue-500 xl:inline">LearnFlow LMS</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          The ultimate platform for modern learning. Access high-quality courses, track your progress, and achieve your goals.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Get Started
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
               <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                 <BookOpen className="h-6 w-6" />
               </div>
               <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Structured Learning</h3>
               <p className="mt-2 text-base text-gray-500">Curated courses broken down into easy-to-digest sections and video lessons.</p>
            </div>
            <div className="text-center">
               <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                 <Award className="h-6 w-6" />
               </div>
               <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Track Progress</h3>
               <p className="mt-2 text-base text-gray-500">Automatically save your video progress and resume exactly where you left off.</p>
            </div>
            <div className="text-center">
               <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                 <Users className="h-6 w-6" />
               </div>
               <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Expert Instructors</h3>
               <p className="mt-2 text-base text-gray-500">Learn from industry professionals with high-quality YouTube embedded content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force redeploy: 2026-03-17T16:31:19.583Z
