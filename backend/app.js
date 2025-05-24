const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const habitRoutes = require('./routes/habit.routes');
const achievementRoutes = require('./routes/achievement.routes');
const milestoneRoutes = require('./routes/milestone.routes');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Povezano z MongoDB'))
.catch((err) => console.error('Napaka pri povezavi z MongoDB', err));

app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/milestones', milestoneRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Strežnik teče na ${PORT}`));
