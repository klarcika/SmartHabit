const Achievement = require('../models/Achievement');
const Habit = require('../models/Habit');

const createAchievement = async (req, res) => {
  const { habit, value } = req.body;
  const userId = req.clerkId;

  if (!habit || !value) {
    return res.status(400).json({ message: 'Manjkajo podatki: habit ali value' });
  }

  try {
    const habitDoc = await Habit.findOne({ _id: habit, user: userId });
    if (!habitDoc) {
      return res.status(404).json({ message: 'Navada ni bila najdena ali ne pripada uporabniku' });
    }

    const newAchievement = await Achievement.create({
      habit,
      value,
      date: new Date()
    });

    await Habit.findByIdAndUpdate(habit, { $inc: { points: value } });

    res.status(201).json(newAchievement);
  } catch (err) {
    console.error('Napaka pri ustvarjanju napredka:', err);
    res.status(500).json({ message: 'Napaka pri ustvarjanju napredka' });
  }
};

const getAllAchievements = async (req, res) => {
  const userId = req.clerkId;

  try {
    const achievements = await Achievement.find().populate({
      path: 'habit',
      select: 'user name category frequency goal points active createdAt'
    });

    const userAchievements = achievements.filter(a => 
      a.habit && a.habit.user.toString() === userId
    );

    res.json(userAchievements);
  } catch (err) {
    console.error('Napaka pri pridobivanju napredkov:', err);
    res.status(500).json({ message: 'Napaka pri pridobivanju napredkov' });
  }
};

const getAchievement = async (req, res) => {
  const { id } = req.params;
  const userId = req.clerkId;

  try {
    const achievement = await Achievement.findById(id).populate({
      path: 'habit',
      select: 'user name category frequency goal points active createdAt'
    });

    if (!achievement || achievement.habit?.user?.toString() !== userId) {
      return res.status(404).json({ message: 'Napredek ni najden ali ne pripada uporabniku' });
    }

    res.json(achievement);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri pridobivanju napredka' });
  }
};

const updateAchievement = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const userId = req.clerkId;

  try {
    const achievement = await Achievement.findById(id).populate({
      path: 'habit',
      select: 'user name category frequency goal points active createdAt'
    });

    if (!achievement || achievement.habit?.user?.toString() !== userId) {
      return res.status(404).json({ message: 'Napredek ni najden ali ne pripada uporabniku' });
    }

    const oldValue = achievement.value;
    const diff = value - oldValue;

    achievement.value = value;
    await achievement.save();

    await Habit.findByIdAndUpdate(achievement.habit._id, { $inc: { points: diff } });

    res.json(achievement);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri posodabljanju napredka' });
  }
};

const deleteAchievement = async (req, res) => {
  const { id } = req.params;
  const userId = req.clerkId;

  try {
    const achievement = await Achievement.findById(id).populate({
      path: 'habit',
      select: 'user name category frequency goal points active createdAt'
    });

    if (!achievement || achievement.habit?.user?.toString() !== userId) {
      return res.status(404).json({ message: 'Napredek ni najden ali ne pripada uporabniku' });
    }

    const value = achievement.value;

    await Achievement.findByIdAndDelete(id);
    await Habit.findByIdAndUpdate(achievement.habit._id, { $inc: { points: -value } });

    res.json({ message: 'Napredek izbrisan' });
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri brisanju napredka' });
  }
};

module.exports = {
  createAchievement,
  getAllAchievements,
  getAchievement,
  updateAchievement,
  deleteAchievement
};
