import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
    </div>
  );
}
