require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB ulanish
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB ulandi:', process.env.MONGO_URI))
  .catch(err => console.error('❌ MongoDB xato:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚀 EduBot server ishlayapti!',
    mongodb: mongoose.connection.readyState === 1 ? 'ulandi' : 'ulanmadi',
    time: new Date().toLocaleString('uz-UZ')
  });
});

// Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🎓 EduBot server ishga tushdi!`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🔧 Health: http://localhost:${PORT}/api/health\n`);
});
