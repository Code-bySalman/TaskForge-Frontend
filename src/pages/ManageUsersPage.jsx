import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setUsers((current) => [response.data.user, ...current]);
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setSuccess(`User created. Share ${response.data.user.email} and the password with them.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Manage Users</h1>
        <p className="text-secondary mt-2">
          Admins create member accounts here and then share the email and password with each user.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Create Member Account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating user...' : 'Create User'}
            </button>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Existing Users</h2>
            <span className="text-sm text-secondary">{users.length} total</span>
          </div>

          {loadingUsers ? (
            <p className="text-secondary">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-secondary">No users found yet.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="border border-border rounded-lg p-4 bg-light"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-primary">{user.name}</p>
                      <p className="text-sm text-secondary">{user.email}</p>
                    </div>
                    <span
                      className={`badge ${
                        user.role === 'admin'
                          ? 'bg-primary text-white'
                          : 'bg-white text-primary border border-border'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  {user.createdAt && (
                    <p className="text-xs text-secondary mt-3">
                      Created on {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
