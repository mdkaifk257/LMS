'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoId: number;
  youtubeUrl: string;
  duration: number;
  initialProgress: number;
  onProgressUpdate: (progress: number, completed: boolean) => void;
}

export default function VideoPlayer({ videoId, youtubeUrl, duration, initialProgress, onProgressUpdate }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const progressRef = useRef(initialProgress);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const yId = extractYoutubeId(youtubeUrl || '');

  // Simulation of progress since standard iframe embed doesn't easily expose current time without YT Iframe API
  // Building a custom wrapper or assuming generic progress for the demo
  useEffect(() => {
    setProgress(initialProgress);
    progressRef.current = initialProgress;
  }, [videoId, initialProgress]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        progressRef.current += 5; // Simulate 5s passing
        setProgress(progressRef.current);
        
        const isCompleted = progressRef.current >= duration * 0.9;
        onProgressUpdate(progressRef.current, isCompleted);
        
        if (progressRef.current >= duration) {
           setIsPlaying(false);
           clearInterval(intervalRef.current);
        }
      }, 5000); // Update every 5 seconds
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration, onProgressUpdate]);

  return (
    <div className="w-full flex justify-center flex-col relative group">
      <div className="aspect-w-16 aspect-h-9 relative w-full h-[600px] bg-black rounded-lg overflow-hidden group">
         {yId ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${yId}?autoplay=0&controls=1&rel=0&modestbranding=1&start=${Math.floor(initialProgress)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
         ) : (
            <div className="w-full h-full flex items-center justify-center text-white">Invalid Video URL</div>
         )}
         
         {/* Demo Controls Overlay */}
         <div className="absolute top-4 right-4 bg-gray-900/80 p-4 rounded-lg text-white text-sm backdrop-blur-sm shadow-xl border border-gray-700 transition-opacity">
            <h4 className="font-bold mb-2 text-blue-400">Activity Simulator</h4>
            <div className="flex items-center space-x-2 mb-2">
              <button onClick={() => setIsPlaying(!isPlaying)} className={`px-3 py-1.5 rounded transition ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {isPlaying ? 'Pause Sim' : 'Start Watch Sim'}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-300">
               Time: {progress}s / {duration}s<br/>
               Status: {progress >= duration * 0.9 ? 'Completed' : 'In Progress'}
            </div>
            <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (progress / duration) * 100)}%` }}></div>
            </div>
         </div>
      </div>
    </div>
  );
}
