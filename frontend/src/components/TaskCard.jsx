import React from 'react';
import { Calendar, Tag, AlertCircle, Edit2, Trash2, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  // Check if overdue: due date is earlier than today and task is not completed
  const isOverdue = () => {
    if (!task.due_date || task.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    return dueDate < today;
  };

  const overdue = isOverdue();

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper for status badge styling
  const getStatusClass = (status) => {
    if (overdue) return 'badge-overdue';
    switch (status) {
      case 'Completed': return 'badge-completed';
      case 'In Progress': return 'badge-inprogress';
      case 'Pending': default: return 'badge-pending';
    }
  };

  // Helper for priority badge styling
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': default: return 'badge-low';
    }
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.25rem',
        position: 'relative',
      }}
    >
      {/* Top Header: Category and Badges */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Tag size={12} />
            {task.category || 'General'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className={`badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`badge ${getStatusClass(task.status)}`}>
              {overdue ? 'Overdue' : task.status}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </h4>

        {/* Description */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Info & Action Bar */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {/* Due Date Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: overdue ? 'var(--danger)' : 'var(--text-muted)',
          }}
        >
          {overdue ? <AlertCircle size={14} color="var(--danger)" /> : <Calendar size={14} />}
          <span>{formatDate(task.due_date)}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {/* Quick status cycle button */}
          {onStatusChange && (
            <button
              onClick={() => {
                const nextStatus = 
                  task.status === 'Pending' ? 'In Progress' :
                  task.status === 'In Progress' ? 'Completed' : 'Pending';
                onStatusChange(task.id, nextStatus);
              }}
              className="btn-icon"
              title={`Move to next status (${task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Pending'})`}
            >
              {task.status === 'Pending' && <PlayCircle size={16} color="var(--primary)" />}
              {task.status === 'In Progress' && <CheckCircle2 size={16} color="var(--success)" />}
              {task.status === 'Completed' && <Clock size={16} color="var(--warning)" />}
            </button>
          )}

          {/* Edit button */}
          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(task.id)}
            className="btn-icon"
            style={{ color: '#F87171' }}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
