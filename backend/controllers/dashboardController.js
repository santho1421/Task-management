const taskModel = require('../models/taskModel');

/**
 * Dashboard Controller: Calculates metrics and aggregates for user dashboard
 */

// Get summary statistics
// GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const stats = await taskModel.getStats(req.user.id);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get recent tasks for dashboard preview
// GET /api/dashboard/recent-tasks
const getRecentTasks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const tasks = await taskModel.getRecent(req.user.id, limit);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getRecentTasks,
};
