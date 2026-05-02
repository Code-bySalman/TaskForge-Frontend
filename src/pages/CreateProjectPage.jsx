import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, userAPI } from '../services/api';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddMember = (userId) => {
    if (!members.includes(userId)) {
      setMembers([...members, userId]);
    }
  };

  const handleRemoveMember = (userId) => {
    setMembers(members.filter((m) => m !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await projectAPI.createProject({
        name,
        description,
        members,
      });
      navigate(`/projects/${response.data.project._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedUsers = users.filter((u) => members.includes(u._id));
  const availableUsers = users.filter((u) => !members.includes(u._id));

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Create Project</h1>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Team Members
            </label>

            {selectedUsers.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <span
                    key={user._id}
                    className="badge bg-primary text-white flex items-center gap-2"
                  >
                    {user.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(user._id)}
                      className="cursor-pointer hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserList(!showUserList)}
                className="input text-left flex justify-between items-center"
              >
                <span>{selectedUsers.length === 0 ? 'Add members...' : `${selectedUsers.length} selected`}</span>
                <span>▼</span>
              </button>

              {showUserList && availableUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10">
                  {availableUsers.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => {
                        handleAddMember(user._id);
                        setShowUserList(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-light"
                    >
                      {user.name} ({user.role})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
