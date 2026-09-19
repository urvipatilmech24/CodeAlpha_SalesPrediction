import React, { useState, useEffect } from 'react';
import { getOverview, getAnalytics } from './api';
import MetricCards from './components/MetricCards';
import SalesCharts from './components/SalesCharts';
import PredictorForm from './components/PredictorForm';
import { DollarSign } from 'lucide-react';

export default function App() {
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, analyticsRes] = await Promise.all([
        getOverview(),
        getAnalytics()
      ]);
      setOverview(overviewRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Error connecting to FastAPI backend:", err);
    }
  };

  return (Machine Learning Dashboard for multi-channel sales forecasting and ROI optimization.

API Connected (Port 8000)

{/* Metric Cards Section */}

{/* Visual Analytics Section */}

{/* Prediction Engine Section */}

);
}