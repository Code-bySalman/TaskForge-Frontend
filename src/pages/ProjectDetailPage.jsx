import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI, userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import Loading from '../components/Loading';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [newMemberId, setNewMemberId] = useState('');

  useEffect(() => {
    fetchData();
  }, [projectId, user?.role]);

  const fetchData = async () => {
    try {
      const requests = [projectAPI.getProjectById(projectId), taskAPI.getProjectTasks(projectId)];

      if (user?.role === 'admin') {
        requests.push(userAPI.getAllUsers());
      }

      const [projectRes, tasksRes, usersRes] = await Promise.all(requests);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
      setUsers(usersRes?.data?.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await taskAPI.createTask(projectId, newTask);
      setTasks([...tasks, response.data.task]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      setShowCreateTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await taskAPI.updateTask(updatedTask._id, updatedTask);
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter((t) => t._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId) return;

    try {
      const response = await projectAPI.addMember(projectId, newMemberId);
      setProject(response.data.project);
      setNewMemberId('');
      setShowAddMember(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member?')) {
      try {
        const response = await projectAPI.removeMember(projectId, memberId);
        setProject(response.data.project);
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  if (loading) return <Loading />;
  if (!project) return <div className="text-center py-8">Project not found</div>;

  const isAdmin = user?.role === 'admin' && project.admin._id === user.id;
  const availableUsers = users.filter((u) => !project.members.find((m) => m._id === u._id));

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
          {project.description && (
            <p className="text-secondary mt-2">{project.description}</p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate(`/projects/${projectId}/edit`)}
            className="btn btn-secondary"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary">Tasks</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateTask(!showCreateTask)}
                  className="btn btn-primary"
                >
                  {showCreateTask ? 'Cancel' : 'New Task'}
                </button>
              )}
            </div>

            {showCreateTask && (
              <form onSubmit={handleCreateTask} className="mb-6 p-4 bg-light rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input"
                  />
                  <textarea
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="input"
                    rows={3}
                  />
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="input"
                  >
                    <option value="">Assign to...</option>
                    {project.members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="input"
                  />
                  <button type="submit" className="btn btn-primary w-full">
                    Create Task
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-secondary">No tasks yet</p>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="relative">
                    <TaskCard
                      task={task}
                      onUpdate={handleUpdateTask}
                      canUpdate={isAdmin || (user?.id === task.assignedTo?._id)}
                    />
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Team Members</h2>

          {isAdmin && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="btn btn-primary w-full mb-4"
            >
              {showAddMember ? 'Cancel' : 'Add Member'}
            </button>
          )}

          {showAddMember && (
            <form onSubmit={handleAddMember} className="mb-4">
              <select
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="input"
              >
                <option value="">Select user...</option>
                {availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary w-full mt-2">
                Add
              </button>
            </form>
          )}

          <div className="space-y-2">
            {project.members.map((member) => (
              <div key={member._id} className="flex justify-between items-center p-2 bg-light rounded">
                <div>
                  <p className="font-medium text-primary">{member.name}</p>
                  {project.admin._id === member._id && (
                    <p className="text-xs text-secondary">Admin</p>
                  )}
                </div>
                {isAdmin && project.admin._id !== member._id && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
