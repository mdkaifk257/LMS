'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Subject } from '../../types';

export default function CoursesCatalog() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get('/subjects');
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Subject Catalog</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Discover our hand-picked courses to level up your skills.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
            <img src={subject.thumbnail || 'https://via.placeholder.com/400x200'} alt={subject.title} className="w-full h-48 object-cover" />
            <div className="p-5 flex-grow flex flex-col">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{subject.title}</h5>
              <p className="mb-4 font-normal text-gray-700 dark:text-gray-400 line-clamp-3 flex-grow">{subject.description}</p>
              
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹{subject.price}</span>
                {subject.price === 0 && <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE</span>}
              </div>
              
              <Link href={`/courses/${subject.id}`} className="mt-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full">
                View Details
              </Link>
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
             No subjects available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
