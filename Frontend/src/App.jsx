import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, AlertTriangle, Users, Activity, 
  Filter, ShieldAlert, Cpu, BarChart3, Calendar, Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, CartesianGrid, LineChart, Line 
} from 'recharts';

const API_BASE = "http://127.0.0.1:8000/api";

export default function App() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [covidData, setCovidData] = useState(null);
  const [seasonalData, setSeasonalData] = useState(null);
  
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  
  // Prediction Engine state
  const [predInput, setPredInput] = useState({ employed: 10000000, participation_rate: 42.0 });
  const [predResult, setPredResult] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);

  useEffect(() => {
    fetchOverview();
    fetchCovidAnalysis();
    fetchSeasonalAnalysis();
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [selectedRegion, selectedArea]);

  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${API_BASE}/overview`);
      setOverview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCovidAnalysis = async () => {
    try {
      const res = await axios.get(`${API_BASE}/covid-analysis`);
      setCovidData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSeasonalAnalysis = async () => {
    try {
      const res = await axios.get(`${API_BASE}/seasonal-patterns`);
      setSeasonalData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await axios.get(`${API_BASE}/trends`, {
        params: { region: selectedRegion, area: selectedArea }
      });
      setTrends(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoadingPred(true);
    try {
      const res = await axios.post(`${API_BASE}/predict`, predInput);
      setPredResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPred(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-6 space-y-8">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="text-cyan-400" size={32} />
            India Unemployment & COVID-19 Policy Engine
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Analyzing employment trends, COVID-19 shockwaves, seasonal patterns, and economic policies.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-2 rounded-xl text-xs text-gray-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          FastAPI Backend Active
        </div>
      </header>

      {/* KPI Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-5 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Avg Unemployment Rate</span>
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <div className="text-3xl font-bold">{overview.metrics.avg_unemployment}%</div>
            <div className="text-xs text-gray-500 mt-2">National Average</div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-5 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Peak Unemployment</span>
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-red-400">{overview.metrics.max_unemployment}%</div>
            <div className="text-xs text-gray-500 mt-2">Highest Recorded Spike</div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-5 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">COVID Shock Surge</span>
              <ShieldAlert className="text-amber-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-amber-400">+{overview.metrics.covid_surge_pct}%</div>
            <div className="text-xs text-gray-500 mt-2">Pre: {overview.metrics.pre_covid_avg}% $\rightarrow$ Peak: {overview.metrics.peak_covid_avg}%</div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-5 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Labour Participation</span>
              <Users className="text-cyan-400" size={20} />
            </div>
            <div className="text-3xl font-bold">{overview.metrics.avg_labor_part}%</div>
            <div className="text-xs text-gray-500 mt-2">Mean Workforce Engagement</div>
          </div>
        </div>
      )}

      {/* COVID-19 SPECIAL INVESTIGATION SECTION */}
      {covidData && (
        <div className="bg-gradient-to-br from-red-950/40 via-gray-900 to-gray-900 border border-red-900/40 p-6 rounded-2xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Flame className="text-red-400" size={28} />
            <div>
              <h2 className="text-xl font-bold text-white">COVID-19 Impact & Lockdown Analysis</h2>
              <p className="text-xs text-gray-400">Investigating the immediate shockwave of COVID-19 lockdown restrictions on labor markets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Era Comparison */}
            <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Unemployment Rate Across COVID Eras</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={covidData.era_summary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="Covid_Era" stroke="#6B7280" fontSize={10} />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Bar dataKey="Unemployment_Rate" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hardest Hit States */}
            <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Hardest Hit States During COVID (Unemployment Rate Spike)</h3>
              <div className="h-60 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {covidData.hardest_hit_regions.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <span className="text-sm font-medium text-gray-200">{item.Region}</span>
                      <span className="text-sm font-bold text-red-400">+{item.Rate_Increase}% Surge</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-900/80 border border-gray-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
          <Filter size={16} /> Data Explorer Filters:
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Region:</label>
          <select 
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="All">All India</option>
            {overview?.regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Area:</label>
          <select 
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="All">Rural + Urban</option>
            {overview?.areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Main Timeline & Urban/Rural Charts */}
      {trends && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-cyan-400" size={18} /> Unemployment Rate Timeline
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.time_series}>
                  <defs>
                    <linearGradient id="colorUnemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="Date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  <Area type="monotone" dataKey="Unemployment_Rate" stroke="#06B6D4" fillOpacity={1} fill="url(#colorUnemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-indigo-400" size={18} /> Urban vs Rural Impact
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends.urban_rural}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="Area" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  <Bar dataKey="Unemployment_Rate" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Trends & Monthly Patterns */}
      {seasonalData && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="text-emerald-400" size={18} /> Seasonal Patterns (Monthly Unemployment Averages)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonalData.monthly_seasonality}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="Month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Line type="monotone" dataKey="Unemployment_Rate" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Policy Recommendation Simulator */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border border-indigo-900/50 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="text-cyan-400" size={28} />
          <div>
            <h3 className="text-xl font-bold text-white">AI Economic Policy Recommendation Engine</h3>
            <p className="text-xs text-gray-400">Simulate labor workforce inputs to generate dynamic social and economic policy responses.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Estimated Employed Population:</label>
              <input 
                type="number" 
                value={predInput.employed}
                onChange={(e) => setPredInput({...predInput, employed: e.target.value})}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Labor Force Participation Rate (%):</label>
              <input 
                type="number" 
                step="0.1"
                value={predInput.participation_rate}
                onChange={(e) => setPredInput({...predInput, participation_rate: e.target.value})}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loadingPred}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
            >
              {loadingPred ? "Running Policy Engine..." : "Generate AI Policy Recommendation"}
            </button>
          </form>

          {predResult && (
            <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Forecasted Unemployment Rate</div>
                <div className="text-4xl font-extrabold text-cyan-400">{predResult.predicted_unemployment_rate}%</div>
                <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                  Risk Assessment: {predResult.risk_level}
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Recommended Social & Economic Policy Action</div>
                <p className="text-sm text-gray-200 leading-relaxed bg-gray-950/60 p-3 rounded-lg border border-gray-800">
                  {predResult.recommended_policy_action}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}