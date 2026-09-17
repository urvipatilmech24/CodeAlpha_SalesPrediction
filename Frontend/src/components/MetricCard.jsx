import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-5 rounded-2xl shadow-xl transition-all hover:border-gray-700">
      <div className="flex justify-between items-center text-gray-400 mb-2">
        <span className="text-xs uppercase font-bold tracking-wider">{title}</span>
        {Icon && <Icon className={colorClass || "text-blue-400"} size={20} />}
      </div>
      <div className={`text-3xl font-bold ${colorClass || "text-white"}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
    </div>
  );
}