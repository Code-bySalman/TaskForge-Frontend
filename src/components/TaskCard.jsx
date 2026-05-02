import React from 'react';
import { formatDate, getStatusColor, getStatusLabel, isOverdue } from '../utils/helpers';

export default function TaskCard({ task, onUpdate, canUpdate }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [status, setStatus] = React.useState(task.status);
  const overdue = isOverdue(task.dueDate, task.status);

  const handleStatusChange = async (newStatus) => {
    if (canUpdate) {
      await onUpdate({ ...task, status: newStatus });
      setStatus(newStatus);
      setIsEditing(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-primary">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-secondary mt-1">{task.description}</p>
          )}
        </div>
        <span className={`badge ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      <div className="flex gap-4 text-sm text-secondary mt-3">
        {task.assignedTo && (
          <span>Assigned: {task.assignedTo.name}</span>
        )}
        {task.dueDate && (
          <span className={overdue ? 'text-red-600 font-semibold' : ''}>
            Due: {formatDate(task.dueDate)}
            {overdue && ' (Overdue)'}
          </span>
        )}
      </div>

      {canUpdate && (
        <div className="mt-3">
          {isEditing ? (
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-accent hover:underline"
            >
              Update Status
            </button>
          )}
        </div>
      )}
    </div>
  );
}
