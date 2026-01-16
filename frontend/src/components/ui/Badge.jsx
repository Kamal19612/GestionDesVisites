import React from 'react';

export function Badge({ children, className = '' }) {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
  
  // Example of status-based coloring
  const colorClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  // Allow overriding with className
  const finalClassName = `${baseClasses} ${colorClasses.default} ${className}`;

  return (
    <span className={finalClassName}>
      {children}
    </span>
  );
}
