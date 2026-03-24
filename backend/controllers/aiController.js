const OpenAI = require('openai');
const axios = require('axios');
const { pool } = require('../config/db');
require('dotenv').config();

exports.askAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return res.status(500).json({ 
      message: 'AI API Key not configured. Please add your API key to the backend .env file.' 
    });
  }

  try {
    // 1. Fetch User Context from database
    const [userRows] = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
    const userName = userRows.length > 0 ? userRows[0].name : 'Student';

    // Fetch progress: Enrolled subjects, total videos, and completed videos
    const [progressRows] = await pool.query(`
      SELECT s.title, 
             COUNT(v.id) as total_videos, 
             SUM(CASE WHEN vp.completed = 1 THEN 1 ELSE 0 END) as completed_videos
      FROM subjects s
      JOIN enrollments e ON s.id = e.subject_id
      LEFT JOIN sections sec ON s.id = sec.subject_id
      LEFT JOIN videos v ON sec.id = v.section_id
      LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
      WHERE e.user_id = ?
      GROUP BY s.id
    `, [userId, userId]);

    // Format progress context
    let progressContext = "";
    if (progressRows.length > 0) {
      progressContext = "\nUser Enrolled Courses and Progress:\n" + progressRows.map(row => 
        `- ${row.title}: ${row.completed_videos || 0}/${row.total_videos} videos completed`
      ).join('\n');
    } else {
      progressContext = "\nUser is not currently enrolled in any courses.";
    }

    const systemPrompt = `You are a helpful Learning Assistant for LearnFlow LMS (Powered by Kodnest). 
    User Name: ${userName}
    ${progressContext}
    
    About Kodnest: Kodnest is a premier technical training and placement institute based in Bangalore, India. They specialize in simplifying complex technical concepts for students and helping them get placed in top companies.
    
    Answer user questions about their studies, progress, and course content accurately and professionally based on the context provided above. 
    If they ask about their progress, use the specific numbers provided. If they ask for study help, be encouraging and use their name.`;

    // 2. Call AI Service
    if (apiKey.startsWith('hf_')) {
      // Use Hugging Face Inference Providers (OpenAI-compatible router)
      const response = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        { 
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      
      const aiResponse = response.data.choices[0].message.content;
      return res.json({ response: aiResponse });
    } else {
      // Use OpenAI API
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Upgraded from 3.5-turbo
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      });

      return res.json({ response: completion.choices[0].message.content });
    }
  } catch (error) {
    if (error.response) {
      console.error('AI Service Error (Response):', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('AI Service Error (Request):', error.request);
    } else {
      console.error('AI Service Error (Message):', error.message);
    }
    res.status(500).json({ message: 'Error communicating with AI service. Please check your API key and try again.' });
  }
};
