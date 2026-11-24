import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  ListTodo, 
  TrendingUp, 
  Calendar, 
  Plus, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { dashboardService } from '../services/dashboardService';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const { openNewTaskModal, openEditTaskModal, refreshTrigger, triggerRefresh } = useOutletContext();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionPercentage: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch dashboard stats & tasks
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all 3 data sources in parallel for instant loading
        const [statsData, recentData, allTasksData] = await Promise.all([
          dashboardService.getStats().catch(() => ({ stats: null })),
          dashboardService.getRecentTasks(5).catch(() => ({ tasks: [] })),
          taskService.getTasks({ sortBy: 'due_date_asc', limit: 4 }).catch(() => ({ tasks: [] })),
        ]);

        if (isMounted) {
          if (statsData?.stats) {
            setStats(statsData.stats);
          }
          setRecentTasks(recentData?.tasks || []);

          const upcoming = (allTasksData?.tasks || [])
            .filter((t) => t.status !== 'Completed' && t.due_date)
            .slice(0, 4);
          setUpcomingDeadlines(upcoming);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  // Quick status update from task cards
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      triggerRefresh();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Could not update task status.');
    }
  };

  // Delete task confirmation
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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner with Quick Actions */}
      <div
        className="card"
        style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.75rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Analytics & Overview
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
            Task Productivity Dashboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Track task execution, upcoming deadlines, and team deliverables in real-time.
          </p>
        </div>

        <button onClick={openNewTaskModal} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
          <Plus size={18} />
          <span>Create New Task</span>
        </button>
      </div>

      {/* 4 Key Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard
          title="Total Tasks"
          value={stats?.total ?? 0}
          icon={ListTodo}
          color="var(--primary)"
          subtitle="All active and finished tasks"
        />
        <StatCard
          title="Completed"
          value={stats?.completed ?? 0}
          icon={CheckCircle2}
          color="var(--status-completed)"
          subtitle={`${stats?.completionPercentage ?? 0}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress ?? 0}
          icon={PlayCircle}
          color="var(--status-inprogress)"
          subtitle="Currently being worked on"
        />
        <StatCard
          title="Pending"
          value={stats?.pending ?? 0}
          icon={Clock}
          color="var(--status-pending)"
          subtitle="Awaiting action"
        />
      </div>

      {/* Progress Bar Component */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Overall Task Completion</span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
            {stats?.completionPercentage ?? 0}%
          </span>
        </div>
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, stats?.completionPercentage ?? 0))}%`,
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Two-Column Grid: Upcoming Deadlines & Recent Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Upcoming Deadlines */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--warning)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Deadlines</h3>
            </div>
            <Link to="/tasks" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Calendar size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No upcoming deadlines right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.title}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Category: {t.category || 'General'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--warning)' }}>
                      {t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                    </div>
                    <span className={`badge ${t.priority === 'High' ? 'badge-high' : t.priority === 'Medium' ? 'badge-medium' : 'badge-low'}`} style={{ fontSize: '0.65rem' }}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--secondary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recently Created</h3>
            </div>
            <Link to="/tasks" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <ListTodo size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No tasks found. Create your first task to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                    <h5
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                        color: t.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t.title}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Status: {t.status}
                    </span>
                  </div>

                  <span
                    className={`badge ${
                      t.status === 'Completed' ? 'badge-completed' :
                      t.status === 'In Progress' ? 'badge-inprogress' : 'badge-pending'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default Dashboard;
