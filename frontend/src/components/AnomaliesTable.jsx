import React, { useMemo, useState } from "react";

// Table for displaying anomalies with filtering and sorting
export default function AnomaliesTable({ anomalies }) {
  const [userIdFilter, setUserIdFilter] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);

  // Unique userIds for filter dropdown
  const userIds = useMemo(() => [...new Set(anomalies.map(a => a.userId))], [anomalies]);

  // Filter and sort anomalies
  const filtered = useMemo(() => {
    let data = anomalies;
    if (userIdFilter) {
      data = data.filter(a => String(a.userId) === userIdFilter);
    }
    data = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [anomalies, userIdFilter, sortKey, sortAsc]);

  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-blue-50 rounded-2xl shadow-xl p-6 border border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
          Anomalies
        </h2>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-600">Filter by userId:</label>
          <select
            className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-300 bg-white"
            value={userIdFilter}
            onChange={e => setUserIdFilter(e.target.value)}
          >
            <option value="">All</option>
            {userIds.map(uid => (
              <option key={uid} value={uid}>{uid}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-blue-100">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              {['userId', 'id', 'title', 'reason'].map(col => (
                <th
                  key={col}
                  className="px-3 py-2 cursor-pointer select-none text-left border-b font-semibold text-blue-800"
                  onClick={() => {
                    if (col === 'reason') return;
                    if (sortKey === col) setSortAsc(a => !a);
                    else { setSortKey(col); setSortAsc(true); }
                  }}
                >
                  {col}
                  {sortKey === col && (sortAsc ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="text-center py-4 text-gray-400">No anomalies found.</td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.id + '-' + a.userId} className="hover:bg-blue-50 transition-all">
                <td className="px-3 py-2 font-semibold text-blue-700">{a.userId}</td>
                <td className="px-3 py-2 text-blue-600">{a.id}</td>
                <td className="px-3 py-2 max-w-xs truncate" title={a.title}>
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium shadow-sm">{a.title}</span>
                </td>
                <td className="px-3 py-2">
                  <ul className="list-disc ml-4">
                    {a.reason.map((r, i) => (
                      <li key={i}>
                        <span className={
                          r.toLowerCase().includes('bot')
                            ? 'bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs'
                            : 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'
                        }>{r}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
