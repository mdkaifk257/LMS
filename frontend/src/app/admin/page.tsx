'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Subject } from '../../types';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSubject, setNewSubject] = useState({ title: '', description: '', thumbnail: '' });

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (!userStr || JSON.parse(userStr).role !== 'Admin') {
      router.push('/login');
      return;
    }
    fetchSubjects();
  }, [router]);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/subjects');
      setSubjects(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subjects', newSubject);
      setShowAdd(false);
      setNewSubject({ title: '', description: '', thumbnail: '' });
      fetchSubjects();
    } catch (e) {
      alert('Failed to add subject');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/subjects/${id}`);
        fetchSubjects();
      } catch (e) {
        alert('Failed to delete subject');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
         <button onClick={() => setShowAdd(!showAdd)} className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
           {showAdd ? 'Cancel' : 'Add New Subject'}
         </button>
      </div>

      {showAdd && (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Create Subject</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium">Title</label>
                 <input type="text" required value={newSubject.title} onChange={e => setNewSubject({...newSubject, title: e.target.value})} className="w-full mt-1 p-2 border rounded" />
              </div>
              <div>
                 <label className="block text-sm font-medium">Description</label>
                 <textarea required value={newSubject.description} onChange={e => setNewSubject({...newSubject, description: e.target.value})} className="w-full mt-1 p-2 border rounded h-24"></textarea>
              </div>
              <div>
                 <label className="block text-sm font-medium">Thumbnail URL</label>
                 <input type="url" required value={newSubject.thumbnail} onChange={e => setNewSubject({...newSubject, thumbnail: e.target.value})} className="w-full mt-1 p-2 border rounded" />
              </div>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-medium">Save Subject</button>
            </form>
         </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <div className="px-4 py-4 flex items-center sm:px-6 justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div className="flex min-w-0 gap-x-4">
                   <img src={subject.thumbnail || 'https://via.placeholder.com/100'} alt="" className="h-12 w-16 bg-gray-50 flex-none rounded-md object-cover" />
                   <div className="min-w-0 flex-auto">
                     <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">{subject.title}</p>
                     <p className="mt-1 truncate text-xs leading-5 text-gray-500">{subject.description}</p>
                   </div>
                </div>
                <div className="flex space-x-2 shrink-0">
                   <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 font-medium text-sm">Edit</button>
                   {/* Normally you'd route to a deep course manager here */}
                   <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 font-medium text-sm">Delete</button>
                </div>
              </div>
            </li>
          ))}
          {subjects.length === 0 && <li className="px-4 py-6 text-center text-gray-500">No subjects found</li>}
        </ul>
      </div>
    </div>
  );
}
