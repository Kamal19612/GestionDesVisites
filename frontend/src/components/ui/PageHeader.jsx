import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-vp-navy tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-base text-slate-500 font-medium max-w-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button 
          onClick={action.onClick}
          className="btn-primary lg:px-6 h-[50px] flex items-center gap-2 shadow-xl shadow-vp-cyan/20 whitespace-nowrap"
        >
          {action.icon && <span className="text-xl">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
}
