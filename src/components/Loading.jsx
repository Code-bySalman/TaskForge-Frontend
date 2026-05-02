import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <p className="mt-4 text-secondary">Loading...</p>
      </div>
    </div>
  );
}
