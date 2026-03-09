require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB ulandi');

  await User.deleteMany({});

  const users = [
    { name: 'Admin', email: 'admin@edubot.uz', password: 'Admin123!', role: 'admin', xp: 9999, streak: 30 },
    { name: 'O\'qituvchi Aziz', email: 'teacher@edubot.uz', password: 'Teacher123!', role: 'teacher', xp: 5000, streak: 15 },
    { name: 'Akmaljon', email: 'student@edubot.uz', password: 'Student123!', role: 'student', xp: 1250, streak: 7 },
    { name: 'Sardor', email: 'sardor@edubot.uz', password: 'Student123!', role: 'student', xp: 12500, streak: 30 },
    { name: 'Madina', email: 'madina@edubot.uz', password: 'Student123!', role: 'student', xp: 10200, streak: 28 }
  ];

  for (const u of users) {
    await new User(u).save();
    console.log('✅ Yaratildi:', u.email);
  }

  console.log('\n🎉 Seed tugadi!');
  console.log('👑 Admin:    admin@edubot.uz    / Admin123!');
  console.log('👨‍🏫 Teacher:  teacher@edubot.uz / Teacher123!');
  console.log('👨‍🎓 Student:  student@edubot.uz / Student123!');
  
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
