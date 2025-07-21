import React from "react";

// Tag cloud for common words
function TagCloud({ words }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {words.map((word, i) => (
        <span
          key={word + i}
          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-200 hover:scale-105 transition-transform"
        >
          #{word}
        </span>
      ))}
    </div>
  );
}

// Panel for summary info

export default function SummaryPanel({ summary }) {
  if (!summary) return null;
  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl p-6 mb-4 border border-purple-100">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
        Summary
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-blue-700">Top 3 Users (by unique words in titles)</h3>
          <ol className="list-decimal ml-6">
            {summary.top_users.map(u => (
              <li key={u.userId} className="mb-2">
                <span className="font-bold text-blue-800">User {u.userId}</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{u.unique_word_count} unique words</span>
                <div className="text-xs text-gray-500 mt-1">
                  {u.unique_words.map((w, i) => (
                    <span key={w + i} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-1 mb-1">{w}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-purple-700">Most Common Words</h3>
          <TagCloud words={summary.common_words} />
        </div>
      </div>
    </section>
  );
}
