import api from './api';

// Titles of legacy default demo tasks to permanently purge
const DEMO_TITLES = [
  'Setup TaskFlow SaaS Architecture',
  'Connect Firebase & Google OAuth',
  'Organize Tasks with Kanban Workflow',
];

// Helper to get local tasks (strictly user-created only)
const getLocalTasks = () => {
  const stored = localStorage.getItem('taskflow_local_tasks');
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    // Filter out any leftover demo tasks
    const cleanTasks = (parsed || []).filter((t) => !DEMO_TITLES.includes(t.title));
    if (cleanTasks.length !== parsed.length) {
      localStorage.setItem('taskflow_local_tasks', JSON.stringify(cleanTasks));
    }
    return cleanTasks;
  } catch (e) {
    return [];
  }
};

const saveLocalTasks = (tasks) => {
  // Ensure no demo tasks are ever saved
  const cleanTasks = (tasks || []).filter((t) => !DEMO_TITLES.includes(t.title));
  localStorage.setItem('taskflow_local_tasks', JSON.stringify(cleanTasks));
};

// Task CRUD API services
export const taskService = {
  // Get all tasks with optional search, filter, and sort query parameters
  getTasks: async (params = {}) => {
    try {
      const response = await api.get('/tasks', { params });
      if (response.data && response.data.tasks) {
        // Also ensure demo tasks are not returned
        const tasks = response.data.tasks.filter((t) => !DEMO_TITLES.includes(t.title));
        return { ...response.data, count: tasks.length, tasks };
      }
    } catch (err) {
      console.warn('Backend tasks endpoint unavailable, using local store:', err.message);
    }

    // Local filtering and sorting on clean user tasks
    let tasks = getLocalTasks();
    const { search, status, priority, sortBy } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      tasks = tasks.filter(
        (t) => (t.title && t.title.toLowerCase().includes(q)) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (status && status.trim()) {
      tasks = tasks.filter((t) => t.status === status.trim());
    }

    if (priority && priority.trim()) {
      tasks = tasks.filter((t) => t.priority === priority.trim());
    }

    if (sortBy === 'due_date_asc') {
      tasks.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));
    } else if (sortBy === 'due_date_desc') {
      tasks.sort((a, b) => (b.due_date || '').localeCompare(a.due_date || ''));
    } else if (sortBy === 'title_asc') {
      tasks.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'created_at_desc') {
      tasks.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    }

    return { success: true, count: tasks.length, tasks };
  },

  // Get a single task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      if (response.data && response.data.task) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend getTaskById unavailable, using local store:', err.message);
    }

    const tasks = getLocalTasks();
    const task = tasks.find((t) => t.id === Number(id) || t.id === id);
    return { success: true, task: task || null };
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      if (response.data && response.data.task) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend createTask unavailable, using local store:', err.message);
    }

    const tasks = getLocalTasks();
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'General',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      due_date: taskData.due_date || null,
      created_at: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    saveLocalTasks(tasks);
    return { success: true, task: newTask };
  },

  // Update an existing task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      if (response.data && response.data.task) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend updateTask unavailable, using local store:', err.message);
    }

    const tasks = getLocalTasks();
    const index = tasks.findIndex((t) => t.id === Number(id) || t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      saveLocalTasks(tasks);
      return { success: true, task: tasks[index] };
    }
    return { success: false, message: 'Task not found' };
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend deleteTask unavailable, using local store:', err.message);
    }

    let tasks = getLocalTasks();
    tasks = tasks.filter((t) => t.id !== Number(id) && t.id !== id);
    saveLocalTasks(tasks);
    return { success: true, message: 'Task deleted successfully' };
  },
};
