'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Subject, Section, Video } from '../../../types';
import Cookies from 'js-cookie';
import PaymentModal from '../../../components/PaymentModal';

import React from 'react';

export default function CourseDetails({ params }: { params: Promise<{ subjectId: string }> }) {
  const router = useRouter();
  const { subjectId } = React.use(params);
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [sections, setSections] = useState<(Section & { videos: Video[] })[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, sectionsRes] = await Promise.all([
           api.get(`/subjects/${subjectId}`),
           api.get(`/sections/subject/${subjectId}`)
        ]);
        setSubject(subjectRes.data);
        
        const sectionsData = sectionsRes.data;
        const sectionsWithVideos = await Promise.all(sectionsData.map(async (sec: Section) => {
           const videosRes = await api.get(`/videos/section/${sec.id}`, {
             headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } // Need auth for videos usually
           }).catch(() => ({ data: [] })); // Fallback if not logged in
           return { ...sec, videos: videosRes.data };
        }));
        setSections(sectionsWithVideos);

        // Check if enrolled
        if (Cookies.get('accessToken')) {
           const enrollmentsRes = await api.get('/enrollments/my-enrollments');
           const enrolled = enrollmentsRes.data.some((e: any) => e.id === Number(subjectId));
           setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchData();
  }, [subjectId]);

  const handleEnroll = async () => {
    if (!Cookies.get('accessToken')) {
       router.push('/login');
       return;
    }
    
    if (subject && subject.price > 0) {
      setShowPaymentModal(true);
    } else {
      await processEnrollment();
    }
  };

  const handleConfirmPayment = async () => {
    setShowPaymentModal(false);
    await processEnrollment();
  };

  const processEnrollment = async () => {
    setEnrolling(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.post('/enrollments', { subject_id: subjectId });
      setIsEnrolled(true);
      router.push(`/learn/${subjectId}`);
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      alert(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (!subject) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img src={subject.thumbnail || 'https://via.placeholder.com/800x600'} alt={subject.title} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{subject.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{subject.description}</p>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{subject.price}</span>
            </div>

            {isEnrolled ? (
              <button onClick={() => router.push(`/learn/${subjectId}`)} className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition">
                Continue to Subject
              </button>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {enrolling ? 'Processing...' : subject.price > 0 ? 'Buy Now' : 'Enroll Now'}
              </button>
            )}
            
            {enrolling && (
              <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 animate-pulse font-medium">
                Simulating secure payment gateway...
              </p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
            <ul className="space-y-2">
               {section.videos.length > 0 ? section.videos.map(video => (
                 <li key={video.id} className="flex items-center text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                   <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                   {video.title}
                 </li>
               )) : <li className="text-sm text-gray-400">Lessons hidden until enrolled.</li>}
            </ul>
          </div>
        ))}
      </div>

      {subject && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
          courseTitle={subject.title}
          price={subject.price}
        />
      )}
    </div>
  );
}
