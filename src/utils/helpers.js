export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'todo': 'badge-info',
    'in-progress': 'badge-warning',
    'done': 'badge-success',
  };
  return colors[status] || '';
};

export const getStatusLabel = (status) => {
  const labels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };
  return labels[status] || status;
};

export const isOverdue = (dueDate, status) => {
  if (status === 'done') return false;
  return new Date(dueDate) < new Date();
};
