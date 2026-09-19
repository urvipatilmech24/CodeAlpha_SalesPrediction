import React, { useState } from 'react';
import { getPredictions } from '../api';
import { Cpu, Sparkles } from 'lucide-react';

export default function PredictorForm() {
  const [formData, setFormData] = useState({ tv: 150, radio: 25, newspaper: 10 });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getPredictions(formData);
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (Input channel budgets ($k) to forecast total sales units using Random Forest ML.

TV Budget ($k):
setFormData({...formData, tv: parseFloat(e.target.value) || 0})}
className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
required
/>

Radio Budget ($k):
setFormData({...formData, radio: parseFloat(e.target.value) || 0})}
className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
required
/>

Newspaper Budget ($k):
setFormData({...formData, newspaper: parseFloat(e.target.value) || 0})}
className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
required
/>

{loading ? "Calculating..." : "Predict Sales Revenue"}

{prediction && (

Predicted Sales Output

{prediction.predicted_sales}

Thousand Units Expected

Selected Model: Random Forest Regressor

Estimated Accuracy (R²): 98.4%

)}

);