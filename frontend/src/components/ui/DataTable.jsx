import React from 'react';

export default function DataTable({ 
  columns, 
  data = [], 
  isLoading = false,
  emptyMessage = "Aucune donnée disponible.",
  onRowClick
}) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
        <p className="mt-2 text-slate-400 text-sm font-medium">Chargement...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-xl">
         <p className="text-4xl mb-4 grayscale opacity-20">🍃</p>
         <p className="text-sm font-bold text-slate-400 italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
      <table className="w-full">
        <thead className="bg-slate-50/80 backdrop-blur">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={col.key || idx} 
                className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-vp-cyan/[0.02]' : ''}`}
            >
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className="px-6 py-4">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
