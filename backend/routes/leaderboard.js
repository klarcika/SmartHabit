const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const data = await Habit.aggregate([
      {
        $group: {
          _id: "$user",
          totalHabits: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "clerkId", 
          as: "userData"
        }
      },
      {
        $unwind: "$userData"
      },
      {
        $project: {
          name: "$userData.name",
          email: "$userData.email",
          totalHabits: 1
        }
      },
      {
        $sort: { totalHabits: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error("Napaka pri leaderboardu:", error);
    res.status(500).json({ message: "Napaka pri pridobivanju leaderboarda." });
  }
});

module.exports = router;
