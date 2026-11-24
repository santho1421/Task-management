const express = require('express');
const router = express.Router();
const { getStats, getRecentTasks } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// All dashboard endpoints require a valid JWT token
router.use(verifyToken);

router.get('/stats', getStats);
router.get('/recent-tasks', getRecentTasks);

module.exports = router;
