import React from 'react';
import { TrendingUp, BarChart3, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

export function TimeSeriesChart({ data }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="text-cyan-400" size={18} /> Unemployment Rate & COVID Impact Trend
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUnemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="Date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="Unemployment_Rate" stroke="#06B6D4" fillOpacity={1} fill="url(#colorUnemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SectorDistributionChart({ data }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="text-indigo-400" size={18} /> Area-Wise Unemployment
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="Area" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
            <Bar dataKey="Unemployment_Rate" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RegionalRankingChart({ data }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="text-blue-400" size={18} /> Regional Disparity Analysis (State-wise Mean Unemployment Rate)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="Region" stroke="#6B7280" angle={-45} textAnchor="end" height={80} fontSize={10} />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
            <Bar dataKey="Unemployment_Rate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}