import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import TaskCard from '../components/TaskCard';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await taskAPI.getDashboardStats();
      setStats(response.data.stats);
      setOverdueTasks(response.data.overdueTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          highlight
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTasks || 0}
        />
        <StatCard
          title="Overdue"
          value={stats?.overdueTasks || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-4">To Do</h3>
          <p className="text-4xl font-bold text-primary">{stats?.tasksByStatus?.todo || 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-4">In Progress</h3>
          <p className="text-4xl font-bold text-primary">{stats?.tasksByStatus?.['in-progress'] || 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-primary mb-4">Done</h3>
          <p className="text-4xl font-bold text-primary">{stats?.tasksByStatus?.done || 0}</p>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Overdue Tasks
          </h2>
          <div className="space-y-4">
            {overdueTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
