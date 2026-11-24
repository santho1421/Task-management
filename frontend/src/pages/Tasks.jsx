import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, ListFilter, CheckSquare, AlertCircle } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { taskService } from '../services/taskService';

const Tasks = () => {
  const { openNewTaskModal, openEditTaskModal, refreshTrigger, triggerRefresh } = useOutletContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('due_date_asc');
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks when filters or refreshTrigger change
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await taskService.getTasks({
          search: searchQuery,
          status: statusFilter,
          priority: priorityFilter,
          sortBy: sortBy,
        });
        setTasks(data.tasks || []);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchQuery, statusFilter, priorityFilter, sortBy, refreshTrigger]);

  // Handle status update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      triggerRefresh();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Could not update task status.');
    }
  };

  // Handle delete confirmation
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('due_date_asc');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Task Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {tasks.length} task{tasks.length === 1 ? '' : 's'} matching your criteria
          </p>
        </div>

        <button onClick={openNewTaskModal} className="btn btn-primary">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      {/* Tasks Grid or Loading/Empty state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--secondary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}
          >
            <CheckSquare size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No tasks found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem' }}>
            {searchQuery || statusFilter || priorityFilter
              ? 'No tasks match the selected filters. Try clearing or modifying your filter criteria.'
              : 'You have not added any tasks yet. Create your first task to start organizing your workflow!'}
          </p>
          {searchQuery || statusFilter || priorityFilter ? (
            <button onClick={handleClearFilters} className="btn btn-secondary">
              Clear All Filters
            </button>
          ) : (
            <button onClick={openNewTaskModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Create First Task</span>
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditTaskModal}
              onDelete={(id) => setTaskToDelete(id)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Tasks;
