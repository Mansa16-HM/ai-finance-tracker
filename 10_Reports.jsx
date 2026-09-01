// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    return transactions.filter((t) => {
      const tMonth = new Date(t.date).toISOString().slice(0, 7);
      return tMonth === filterMonth;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const monthlyStats = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else {
        acc.expense += t.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const categoryBreakdown = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

  const handleDownloadPDF = () => {
    const content = `
FINANCE REPORT - ${new Date(filterMonth).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    })}

SUMMARY
-------
Total Income: ₹${monthlyStats.income.toFixed(2)}
Total Expense: ₹${monthlyStats.expense.toFixed(2)}
Balance: ₹${(monthlyStats.income - monthlyStats.expense).toFixed(2)}

TRANSACTIONS
-----------
${filteredTransactions
  .map(
    (t) =>
      `${new Date(t.date).toLocaleDateString('en-IN')} | ${t.description} | ${t.category} | ${
        t.type === 'income' ? '+' : '-'
      }₹${t.amount.toFixed(2)}`
  )
  .join('\n')}

CATEGORY BREAKDOWN (Expenses)
---------------------------
${Object.entries(categoryBreakdown)
  .map(([cat, amount]) => `${cat}: ₹${amount.toFixed(2)}`)
  .join('\n')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `finance-report-${filterMonth}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading reports...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">📊 Financial Reports</h1>

        {/* Month Selector */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-center">
          <label className="text-gray-700 font-semibold">Select Month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            📥 Download Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold mb-2">Total Income</p>
            <p className="text-3xl font-bold text-green-600">₹{monthlyStats.income.toFixed(2)}</p>
          </div>

          <div className="bg-red-100 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold mb-2">Total Expense</p>
            <p className="text-3xl font-bold text-red-600">₹{monthlyStats.expense.toFixed(2)}</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 font-semibold mb-2">Balance</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{(monthlyStats.income - monthlyStats.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          {Object.keys(categoryBreakdown).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">💰 Expense by Category</h2>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">{category}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(amount / monthlyStats.expense) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-right min-w-20 font-bold text-gray-800">
                          ₹{amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Transaction List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 All Transactions</h2>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTransactions.map((t) => (
                  <div key={t._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold text-gray-800">{t.description}</p>
                      <p className="text-sm text-gray-600">{t.category}</p>
                    </div>
                    <p
                      className={`font-bold ${
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No transactions for this month</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
