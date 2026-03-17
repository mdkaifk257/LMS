USE lms_production;

-- Insert Admin User (password is 'password123' bcrypt hashed)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@lms.com', '$2a$10$HN6VlQvJ1.VkDrNepqGPVqinsp3CQe/QilByoK6SHq', 'Admin'),
('Student User', 'student@lms.com', '$2a$10$HN6VlQvJ1.VkDrNepqGPVqinsp3CQe/QilByoK6SHq', 'Student');

-- Insert Subjects
INSERT INTO subjects (title, description, thumbnail, price) VALUES 
('Full Stack Web Development', 'Learn to build complete web applications from scratch.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 1499.00),
('Data Structures & Algorithms', 'Master problem solving with deep understanding of DS&A.', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd', 999.00),
('Python Mastery', 'The complete guide to Python for beginners and experts.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', 1299.00),
('React Native Mobile Dev', 'Build cross-platform mobile apps for iOS and Android.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 1599.00),
('System Design Interview', 'Master large scale system architecture for top tech companies.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 1999.00);

-- Insert Sections for Subject 1 (Web Dev)
INSERT INTO sections (subject_id, title, order_index) VALUES 
(1, 'HTML & CSS Basics', 1),
(1, 'JavaScript Essentials', 2),
(1, 'React & Next.js', 3);

-- Insert Sections for Subject 2 (DS&A)
INSERT INTO sections (subject_id, title, order_index) VALUES 
(2, 'Introduction to Algorithms', 1),
(2, 'Arrays & Strings', 2),
(2, 'Trees & Graphs', 3);

-- Insert Sections for Subject 3 (Python)
INSERT INTO sections (subject_id, title, order_index) VALUES 
(3, 'Python Basics', 1),
(3, 'Advanced Python', 2);

-- Insert Sections for Subject 4 (React Native)
INSERT INTO sections (subject_id, title, order_index) VALUES 
(4, 'Environment Setup', 1),
(4, 'Core Components', 2);

-- Insert Sections for Subject 5 (System Design)
INSERT INTO sections (subject_id, title, order_index) VALUES 
(5, 'Scalability Basics', 1),
(5, 'Database Sharding', 2);

-- Insert Videos for Subject 1, Section 1 (HTML/CSS)
INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES 
(1, 'Introduction to HTML', 'https://www.youtube.com/embed/pQN-pnXPaVg', 600, 1),
(1, 'CSS Styling Basics', 'https://www.youtube.com/embed/1Rs2ND1ryYc', 900, 2);

-- Insert Videos for Subject 1, Section 2 (JS)
INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES 
(2, 'JavaScript Variables & Types', 'https://www.youtube.com/embed/W6NZfCO5SIk', 720, 1),
(2, 'Functions & Scopes', 'https://www.youtube.com/embed/VfGW0Qiy2I0', 800, 2);

-- Insert Videos for Subject 2, Section 1 (DS&A Intro)
INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES 
(4, 'Big O Notation', 'https://www.youtube.com/embed/v4cd1O4zkGw', 1200, 1),
(4, 'Time & Space Complexity', 'https://www.youtube.com/embed/9TlHvipP5yA', 1100, 2);

-- Insert Videos for Subject 3, Section 1 (Python Basics)
INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES 
(7, 'Python Installation', 'https://www.youtube.com/embed/YYXdXT2l-Gg', 300, 1),
(7, 'Print & Variables', 'https://www.youtube.com/embed/Z1Yd7upQsXY', 450, 2);

-- Videos for Subject 4 (React Native)
INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES 
(9, 'Setting up expo', 'https://www.youtube.com/embed/0-S5a0eXPoc', 600, 1),
(10, 'View and Text components', 'https://www.youtube.com/embed/0-S5a0eXPoc', 800, 1);

-- Videos for Subject 5 (System Design)
INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES 
(11, 'Horizontal vs Vertical Scaling', 'https://www.youtube.com/embed/SqcXVCg_S_Y', 900, 1);

-- Insert Enrollments (Student User enrolled in Subject 1)
INSERT INTO enrollments (user_id, subject_id) VALUES 
(2, 1);

-- Insert Video Progress for Student in 'Introduction to HTML'
INSERT INTO video_progress (user_id, video_id, watched_seconds, completed) VALUES 
(2, 1, 120, FALSE);
