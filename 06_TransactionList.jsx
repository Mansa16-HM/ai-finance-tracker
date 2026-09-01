// src/components/TransactionList.jsx
import React, { useState } from 'react';
import { transactionAPI } from '../services/api';

function TransactionList({ transactions, onTransactionDeleted }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setDeletingId(id);
        await transactionAPI.delete(id);
        onTransactionDeleted(id);
      } catch (error) {
        alert('Error deleting transaction: ' + error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const categoryIcons = {
    Food: '🍕',
    Transport: '🚗',
    Entertainment: '🎬',
    Utilities: '💡',
    Health: '🏥',
    Shopping: '🛍️',
    Salary: '💼',
    Freelance: '💻',
    Investment: '📈',
    Bonus: '🎉',
    Gift: '🎁',
    Other: '📌',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet. Add one to get started!</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.slice(0, 20).map((transaction) => (
            <div
              key={transaction._id}
              className={`flex justify-between items-center p-4 rounded-lg border-l-4 transition ${
                transaction.type === 'income'
                  ? 'bg-green-50 border-l-green-500 hover:bg-green-100'
                  : 'bg-red-50 border-l-red-500 hover:bg-red-100'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">
                  {categoryIcons[transaction.category] || '📌'}
                </span>
                <div>
                  <p className="font-semibold text-gray-800">{transaction.description}</p>
                  <div className="flex gap-3 text-xs text-gray-600">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {transaction.category}
                    </span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  disabled={deletingId === transaction._id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-200 p-2 rounded transition disabled:opacity-50"
                  title="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
