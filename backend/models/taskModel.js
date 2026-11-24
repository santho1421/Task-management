const { pool } = require('../config/db');

/**
 * Task Model: Handles MySQL queries for the 'tasks' table
 */
const taskModel = {
  // Create a new task for a specific user
  create: async ({ userId, title, description, category, priority, status, dueDate }) => {
    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, category, priority, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        description || '',
        category || 'General',
        priority || 'Medium',
        status || 'Pending',
        dueDate || null,
      ]
    );

    return taskModel.findById(result.insertId, userId);
  },

  // Retrieve tasks for a specific user with optional search, filters, and sorting
  findAll: async (userId, { search, status, priority, sortBy } = {}) => {
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    // Search query by title or description
    if (search && search.trim()) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    // Status filter
    if (status && status.trim()) {
      sql += ' AND status = ?';
      params.push(status.trim());
    }

    // Priority filter
    if (priority && priority.trim()) {
      sql += ' AND priority = ?';
      params.push(priority.trim());
    }

    // Sorting
    switch (sortBy) {
      case 'due_date_asc':
        sql += ' ORDER BY due_date IS NULL, due_date ASC, id DESC';
        break;
      case 'due_date_desc':
        sql += ' ORDER BY due_date DESC, id DESC';
        break;
      case 'created_at_asc':
        sql += ' ORDER BY created_at ASC';
        break;
      case 'created_at_desc':
        sql += ' ORDER BY created_at DESC';
        break;
      case 'title_asc':
        sql += ' ORDER BY title ASC';
        break;
      case 'priority_desc':
        sql += ` ORDER BY FIELD(priority, 'High', 'Medium', 'Low'), due_date ASC`;
        break;
      default:
        sql += ' ORDER BY due_date IS NULL, due_date ASC, created_at DESC';
        break;
    }

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  // Find a specific task by ID belonging to user
  findById: async (id, userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  // Update a task record
  update: async (id, userId, fields) => {
    const allowedFields = ['title', 'description', 'category', 'priority', 'status', 'due_date'];
    const updates = [];
    const params = [];

    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) {
      return taskModel.findById(id, userId);
    }

    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;
    params.push(id, userId);

    await pool.query(sql, params);
    return taskModel.findById(id, userId);
  },

  // Delete a task record
  delete: async (id, userId) => {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Compute summary stats dynamically for a user
  getStats: async (userId) => {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inProgress,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending
       FROM tasks
       WHERE user_id = ?`,
      [userId]
    );

    const stats = rows[0] || { total: 0, completed: 0, inProgress: 0, pending: 0 };
    const total = parseInt(stats.total, 10) || 0;
    const completed = parseInt(stats.completed, 10) || 0;
    const inProgress = parseInt(stats.inProgress, 10) || 0;
    const pending = parseInt(stats.pending, 10) || 0;

    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionPercentage,
    };
  },

  // Fetch recent tasks for user
  getRecent: async (userId, limit = 5) => {
    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 5, 20));
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, safeLimit]
    );
    return rows;
  },
};

module.exports = taskModel;
