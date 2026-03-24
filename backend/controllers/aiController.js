const OpenAI = require('openai');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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
    
    Background Knowledge:
    - Kodnest: A premier technical training and placement institute based in Bangalore.
    - QSpiders & JSpiders: Famous technical training institutes in India (often associated with Kodnest) that specialize in software testing (QSpiders) and Java development (JSpiders), helping thousands of students get IT jobs.
    
    Answer user questions about their studies, progress, and course content accurately and professionally based on the context provided above. 
    If they ask about their progress, use the specific numbers provided. If they ask about Kodnest, QSpiders, or JSpiders, use the background knowledge to provide a helpful response. Be encouraging and use their name.`;

    // 2. Call AI Service
    console.log(`AI Request for user ${userId} (${userName}):`, message);

    if (apiKey.startsWith('AIza')) {
      // Use Google Gemini API
      console.log('Calling Google Gemini API...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }],
      });
      
      const aiResponse = result.response.text();
      console.log('Gemini Response Success');
      return res.json({ 
        response: aiResponse,
        model: 'Gemini-1.5-Flash' 
      });
    } else if (apiKey.startsWith('hf_')) {
      // ... existing HF logic ...
      // Use Hugging Face Inference Providers (OpenAI-compatible router)
      console.log('Calling Hugging Face Router...');
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
      console.log('Hugging Face Response Success');
      return res.json({ 
        response: aiResponse,
        model: 'Llama-3.1-8B' 
      });
    } else {
      // Use OpenAI API
      console.log('Calling OpenAI API (gpt-4o-mini)...');
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Upgraded from 3.5-turbo
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      });

      console.log('OpenAI Response Success');
      return res.json({ 
        response: completion.choices[0].message.content,
        model: 'GPT-4o-Mini'
      });
    }
  } catch (error) {
    console.error('--- AI CONTROLLER ERROR ---');
    let errorMessage = 'Error communicating with AI service. Please check your API key and try again.';
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      // Specific handling for Hugging Face Router 403 errors
      if (error.response.status === 403 && apiKey.startsWith('hf_')) {
        errorMessage = 'Hugging Face Authentication Failed: Your token lacks "Inference Providers" permission. Please use a Fine-grained token with the correctly assigned permissions.';
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.status) {
      // OpenAI SDK v4+ uses error.status
      console.error('SDK Status:', error.status);
      console.error('SDK Message:', error.message);
      if (error.status === 401) {
        errorMessage = 'Invalid OpenAI API Key. Please check your .env file.';
      }
    } else {
      console.error('Message:', error.message);
    }
    console.error('---------------------------');
    res.status(500).json({ message: errorMessage });
  }
};
