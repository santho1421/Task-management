const taskModel = require('../models/taskModel');

/**
 * Task Controller: Handles CRUD business logic for tasks
 */

// Create a new task
// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, due_date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const newTask = await taskModel.create({
      userId: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: due_date || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks for the logged-in user
// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy } = req.query;

    const tasks = await taskModel.findAll(req.user.id, {
      search,
      status,
      priority,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single task by ID
// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findById(id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized.',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing task
// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await taskModel.findById(id, req.user.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized.',
      });
    }

    const updatedTask = await taskModel.update(id, req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await taskModel.findById(id, req.user.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized.',
      });
    }

    await taskModel.delete(id, req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
