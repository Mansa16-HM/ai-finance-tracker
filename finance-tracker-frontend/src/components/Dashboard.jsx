// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { transactionAPI, insightsAPI } from '../services/api';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Chart from './Chart';
import AIInsights from './AIInsights';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions]);

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

  const fetchInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await insightsAPI.get();
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleTransactionDeleted = (id) => {
    setTransactions(transactions.filter((t) => t._id !== id));
  };

  // Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💰 Finance Dashboard</h1>
          <p className="text-gray-600">
            Manage your finances with AI-powered insights
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Total Income</p>
                <p className="text-3xl font-bold mt-2">₹{totalIncome.toFixed(2)}</p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </div>

          {/* Total Expense Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Total Expenses</p>
                <p className="text-3xl font-bold mt-2">₹{totalExpense.toFixed(2)}</p>
              </div>
              <span className="text-4xl">📉</span>
            </div>
          </div>

          {/* Balance Card */}
          <div
            className={`bg-gradient-to-br ${
              balance >= 0
                ? 'from-blue-500 to-blue-600'
                : 'from-orange-500 to-orange-600'
            } text-white p-6 rounded-lg shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Balance</p>
                <p className="text-3xl font-bold mt-2">₹{balance.toFixed(2)}</p>
              </div>
              <span className="text-4xl">{balance >= 0 ? '✅' : '⚠️'}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms and Lists */}
          <div className="lg:col-span-2 space-y-6">
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            <TransactionList 
              transactions={transactions} 
              onTransactionDeleted={handleTransactionDeleted}
            />
          </div>

          {/* Right Column - Charts and Insights */}
          <div className="space-y-6">
            {transactions.length > 0 && (
              <>
                <Chart transactions={transactions} />
                <AIInsights insights={insights} loading={insightsLoading} />
              </>
            )}
            {transactions.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-800">
                  👋 Welcome! Add your first transaction to see charts and get AI insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
