// src/components/Chart.jsx
import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Chart({ transactions }) {
  // Calculate expenses by category
  const categoryExpenses = {};
  const monthlyData = {};

  transactions.forEach((t) => {
    if (t.type === 'expense') {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    }

    // Monthly data for bar chart
    const month = new Date(t.date).toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit',
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });

  // Pie Chart Data
  const pieData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ₹${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  // Bar Chart Data
  const months = Object.keys(monthlyData);
  const incomeData = months.map((m) => monthlyData[m].income);
  const expenseData = months.map((m) => monthlyData[m].expense);

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ₹${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">📊 Expense Breakdown</h3>
        {Object.keys(categoryExpenses).length > 0 ? (
          <div style={{ maxHeight: '300px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No expense data to display</p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">📈 Income vs Expenses</h3>
        {months.length > 0 ? (
          <div style={{ maxHeight: '350px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No data to display</p>
        )}
      </div>
    </div>
  );
}

export default Chart;
