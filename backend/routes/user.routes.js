const express = require('express');
const { getOrCreateUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getOrCreateUser);
router.put('/', protect, updateUser); 
router.delete('/', protect, deleteUser); 

module.exports = router;
