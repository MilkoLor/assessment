import React, { useEffect, useState } from "react";
import AnomaliesTable from "./components/AnomaliesTable";
import SummaryPanel from "./components/SummaryPanel";
import axios from "axios";

// Backend base URL (adjust if needed)
const API_BASE = "http://localhost:8000";

export default function App() {
  const [anomalies, setAnomalies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [anomaliesRes, summaryRes] = await Promise.all([
          axios.get(`${API_BASE}/anomalies`),
          axios.get(`${API_BASE}/summary`),
        ]);
        setAnomalies(anomaliesRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        setError("Failed to fetch data from backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg animate-pulse text-blue-700">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-6 mb-8 rounded-b-3xl">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg text-center">Ad Insights Explorer Lite</h1>
        <p className="text-blue-100 text-center mt-2 text-base font-light">Analyze ad content, uncover anomalies, and get campaign insights</p>
      </header>
      <main className="max-w-5xl mx-auto px-2 flex flex-col gap-10">
        <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-md p-6 mb-4">
          <SummaryPanel summary={summary} />
        </div>
        <div className="rounded-2xl shadow-xl bg-white/90 backdrop-blur-md p-6">
          <AnomaliesTable anomalies={anomalies} />
        </div>
      </main>
      <footer className="text-center text-xs text-gray-400 mt-10 mb-2">&copy; {new Date().getFullYear()} Ad Insights Explorer Lite</footer>
    </div>
  );
}
