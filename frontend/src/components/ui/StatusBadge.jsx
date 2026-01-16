import React from 'react';

const VARIANTS = {
  EN_ATTENTE: 'bg-amber-100 text-amber-700 border-amber-200',
  APPROUVEE: 'bg-vp-mint/10 text-vp-mint border-vp-mint/20',
  REJETEE: 'bg-rose-100 text-rose-700 border-rose-200',
  TERMINEE: 'bg-slate-100 text-slate-500 border-slate-200',
  EN_COURS: 'bg-blue-100 text-blue-700 border-blue-200',
};

const LABELS = {
  EN_ATTENTE: 'En attente',
  APPROUVEE: 'Approuvée',
  REJETEE: 'Rejetée',
  TERMINEE: 'Terminée',
  EN_COURS: 'En cours',
};

export default function StatusBadge({ status, className = '' }) {
  const normStatus = (status || '').toUpperCase();
  const style = VARIANTS[normStatus] || 'bg-slate-100 text-slate-500 border-slate-200';
  const label = LABELS[normStatus] || status || 'Inconnu';

  return (
    <span 
      className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${style} ${className}`}
    >
      {label}
    </span>
  );
}
