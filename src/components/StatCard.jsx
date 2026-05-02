import React from 'react';

export default function StatCard({ title, value, subtitle, highlight }) {
  return (
    <div className={`card p-6 ${highlight ? 'border-2 border-accent' : ''}`}>
      <p className="text-secondary text-sm font-medium">{title}</p>
      <p className="text-4xl font-bold text-primary mt-2">{value}</p>
      {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
    </div>
  );
}
