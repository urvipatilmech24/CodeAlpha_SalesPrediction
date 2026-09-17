import React from 'react';
import { Cpu } from 'lucide-react';

export default function DynamicPredictor({ predInput, setPredInput, handlePredict, loadingPred, predResult }) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border border-indigo-900/50 p-6 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Cpu className="text-cyan-400" size={28} />
        <div>
          <h3 className="text-xl font-bold text-white">AI Policy & Unemployment Risk Simulator</h3>
          <p className="text-xs text-gray-400">Simulate economic conditions and evaluate recommended policy actions in real time.</p>
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
            {loadingPred ? "Calculating Forecast..." : "Run ML Forecast & Policy Advisory"}
          </button>
        </form>

        {predResult && (
          <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Forecasted Unemployment Rate</div>
              <div className="text-4xl font-extrabold text-cyan-400">{predResult.predicted_unemployment_rate}%</div>
              <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                Risk Assessment Level: {predResult.risk_level}
              </div>
            </div>
            <div className="border-t border-gray-800 pt-4">
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Recommended Policy Directive</div>
              <p className="text-sm text-gray-200 leading-relaxed bg-gray-950/60 p-3 rounded-lg border border-gray-800">
                {predResult.recommended_policy_action}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}