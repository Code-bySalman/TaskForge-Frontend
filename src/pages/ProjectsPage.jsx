import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(projectId);
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Projects</h1>
        {user?.role === 'admin' && (
          <Link to="/projects/create" className="btn btn-primary">
            Create Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-secondary">No projects yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="card p-6">
              <h3 className="text-lg font-semibold text-primary mb-2">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-secondary text-sm mb-4">{project.description}</p>
              )}
              <div className="mb-4">
                <p className="text-xs text-secondary">
                  Members: {project.members.length}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/projects/${project._id}`}
                  className="btn btn-primary flex-1"
                >
                  View
                </Link>
                {user?.role === 'admin' && project.admin._id === user.id && (
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="btn btn-outline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
