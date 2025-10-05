// api/[...path].js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('../backend/routes/user.routes');
const habitRoutes = require('../backend/routes/habit.routes');
const achievementRoutes = require('../backend/routes/achievement.routes');
const milestoneRoutes = require('../backend/routes/milestone.routes');
const leaderboardRoutes = require('../backend/routes/leaderboard');

const app = express();
app.use(cors({ origin: true, credentials: true, allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

// enkratna povezava na Mongo (re-use med invokacijami)
let dbReady = false;
async function ensureDb() {
  if (dbReady) return;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  await mongoose.connect(process.env.MONGO_URI);
  dbReady = true;
}
app.use(async (_req, res, next) => { try { await ensureDb(); next(); } catch (e) { console.error(e); res.status(500).json({ message:'DB connect error' }); } });

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

module.exports = app;
