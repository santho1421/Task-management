import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import { taskService } from '../services/taskService';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // Reactive: recalculate main content margin on resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
      } else {
        await taskService.createTask(formData);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error saving task:', err);
      alert(err.response?.data?.message || 'Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area — offset by sidebar width on desktop */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: isDesktop ? '260px' : '0',
          minWidth: 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenNewTaskModal={handleOpenNewTask}
        />

        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <Outlet
            context={{
              openNewTaskModal: handleOpenNewTask,
              openEditTaskModal: handleOpenEditTask,
              refreshTrigger,
              triggerRefresh: () => setRefreshTrigger((prev) => prev + 1),
            }}
          />
        </main>
      </div>

      {/* Global Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        task={editingTask}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DashboardLayout;
