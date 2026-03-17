export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Admin';
}

export interface Subject {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
}

export interface Section {
  id: number;
  subject_id: number;
  title: string;
  order_index: number;
}

export interface Video {
  id: number;
  section_id: number;
  title: string;
  youtube_url: string;
  duration: number;
  order_index: number;
}

export interface Enrollment {
  enrollment_id: number;
  id: number; // Subject ID
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  total_videos: number;
  completed_videos: number;
  enrolled_at: string;
}

export interface VideoProgress {
  id: number;
  video_id: number;
  section_id: number;
  watched_seconds: number;
  completed: boolean;
  last_watched_at: string;
}
