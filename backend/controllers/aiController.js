const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

exports.askAI = async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return res.status(500).json({ 
      message: 'AI API Key not configured. Please add your API key to the backend .env file.' 
    });
  }

  try {
    // Detect key type
    if (apiKey.startsWith('hf_')) {
      // Use Hugging Face Inference Providers (OpenAI-compatible router)
      const response = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        { 
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [
            { role: 'system', content: 'You are a helpful Learning Assistant for LearnFlow LMS. Answer user questions about their studies, progress, and course content accurately and professionally.' },
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
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful Learning Assistant for LearnFlow LMS. Answer user questions about their studies, progress, and course content accurately and professionally." },
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
