const express = require('express');
const router = express.Router();
const https = require('https');
const auth = require('../middleware/auth');

// AI CHAT - Groq API
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ message: 'Xabar kiriting' });

    const systemPrompt = `Sen EduBot AI - O'zbekistonning eng daxshat AI o'qituvchisisan! 
Foydalanuvchi ismi: ${req.user.name}.
Sening vazifang: matematika, fizika, kimyo, ingliz tili va boshqa fanlardan yordam berish.
O'zbek tilida javob ber. Qisqa, aniq va tushunarli bo'l. Har doim ragbatlantiruvchi bo'l!
Agar matematika masalasi bo'lsa, bosqichma-bosqich yechim ko'rsat.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
      { role: 'user', content: message }
    ];

    const requestBody = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const reply = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) return reject(new Error(parsed.error.message));
            const text = parsed.choices?.[0]?.message?.content || 'Javob topilmadi';
            resolve(text);
          } catch (e) { reject(e); }
        });
      });
      request.on('error', reject);
      request.write(requestBody);
      request.end();
    });

    res.json({ reply });
  } catch (err) {
    console.error('Groq xato:', err.message);
    res.status(500).json({ message: 'AI xato: ' + err.message });
  }
});

module.exports = router;
