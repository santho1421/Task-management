import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, ArrowLeft, ArrowRight, Clock, PlayCircle, CheckCircle2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { taskService } from '../services/taskService';

const Kanban = () => {
  const { openNewTaskModal, openEditTaskModal, refreshTrigger, triggerRefresh } = useOutletContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await taskService.getTasks();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error('Failed to load tasks for Kanban:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [refreshTrigger]);

  const handleMoveStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      triggerRefresh();
    } catch (err) {
      console.error('Error updating task in Kanban:', err);
      alert('Failed to update status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete);
      setTaskToDelete(null);
      triggerRefresh();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  const columns = [
    {
      id: 'Pending',
      title: 'Pending',
      icon: Clock,
      color: 'var(--status-pending)',
      bgLight: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      nextStatus: 'In Progress',
      prevStatus: null,
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      icon: PlayCircle,
      color: 'var(--status-inprogress)',
      bgLight: 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
      nextStatus: 'Completed',
      prevStatus: 'Pending',
    },
    {
      id: 'Completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: 'var(--status-completed)',
      bgLight: 'rgba(34, 197, 94, 0.08)',
      borderColor: 'rgba(34, 197, 94, 0.25)',
      nextStatus: null,
      prevStatus: 'In Progress',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kanban Workflow</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Visualize your workflow across stages and transition tasks seamlessly
          </p>
        </div>

        <button onClick={openNewTaskModal} className="btn btn-primary">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board 3-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {columns.map((column) => {
          const colTasks = tasks.filter((t) => t.status === column.id);
          const ColIcon = column.icon;

          return (
            <div
              key={column.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${column.borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '500px',
                padding: '1.25rem',
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.875rem',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ColIcon size={18} color={column.color} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{column.title}</h4>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: column.bgLight,
                      color: column.color,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${column.borderColor}`,
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks in Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      padding: '2.5rem 1rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      border: '1px dashed var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No tasks in {column.title}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="card"
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      {/* Priority and Category */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {task.category || 'General'}
                        </span>
                        <span
                          className={`badge ${
                            task.priority === 'High' ? 'badge-high' :
                            task.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                          }`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                          {task.title}
                        </h5>
                        {task.description && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Due Date & Action Bar */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--border)',
                          paddingTop: '0.5rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {/* Move Left */}
                          {column.prevStatus && (
                            <button
                              onClick={() => handleMoveStatus(task.id, column.prevStatus)}
                              className="btn-icon"
                              title={`Move to ${column.prevStatus}`}
                              style={{ padding: '0.25rem' }}
                            >
                              <ArrowLeft size={14} />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => openEditTaskModal(task)}
                            className="btn-icon"
                            title="Edit"
                            style={{ padding: '0.25rem' }}
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setTaskToDelete(task.id)}
                            className="btn-icon"
                            title="Delete"
                            style={{ padding: '0.25rem', color: '#F87171' }}
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Move Right */}
                          {column.nextStatus && (
                            <button
                              onClick={() => handleMoveStatus(task.id, column.nextStatus)}
                              className="btn-icon"
                              title={`Move to ${column.nextStatus}`}
                              style={{ padding: '0.25rem' }}
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Kanban;
