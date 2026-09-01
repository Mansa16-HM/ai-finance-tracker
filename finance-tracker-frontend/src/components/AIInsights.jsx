// src/components/AIInsights.jsx
import React from 'react';

function AIInsights({ insights, loading }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">🤖 AI Financial Insights</h2>
        <div className="bg-white bg-opacity-20 p-4 rounded">
          <p className="text-center">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">🤖 AI Financial Insights</h2>
        <div className="bg-white bg-opacity-20 p-4 rounded">
          <p className="text-sm">Add some transactions to get AI-powered financial insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Financial Insights</h2>
      
      <div className="bg-white bg-opacity-20 p-4 rounded mb-4">
        <h3 className="text-lg font-semibold mb-3">💡 Recommendations:</h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {insights.insights}
        </p>
      </div>

      {/* Category Summary */}
      {insights.categoryTotals && Object.keys(insights.categoryTotals).length > 0 && (
        <div className="bg-white bg-opacity-20 p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">📊 Spending by Category:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(insights.categoryTotals).map(([category, amount]) => (
              <div key={category} className="flex justify-between">
                <span>{category}:</span>
                <span className="font-semibold">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs opacity-75">
        <p>✨ Powered by OpenAI API</p>
      </div>
    </div>
  );
}

export default AIInsights;
