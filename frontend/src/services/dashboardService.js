import api from './api';
import { taskService } from './taskService';

// Dashboard statistics API services with smart fallback
export const dashboardService = {
  // Fetch dashboard summary counts and percentages
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data && response.data.stats) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend stats endpoint unavailable, computing locally:', err.message);
    }

    // Compute metrics from taskService
    const tasksData = await taskService.getTasks();
    const tasks = tasksData.tasks || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      success: true,
      stats: {
        total,
        completed,
        inProgress,
        pending,
        completionPercentage,
      },
    };
  },

  // Fetch recent tasks for dashboard widget
  getRecentTasks: async (limit = 5) => {
    try {
      const response = await api.get('/dashboard/recent-tasks', { params: { limit } });
      if (response.data && response.data.tasks) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend recent tasks unavailable, computing locally:', err.message);
    }

    const tasksData = await taskService.getTasks();
    const tasks = (tasksData.tasks || []).slice(0, limit);
    return {
      success: true,
      count: tasks.length,
      tasks,
    };
  },
};
