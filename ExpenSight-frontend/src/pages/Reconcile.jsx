import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Reconcile = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/reconcile/history');
        setHistory(response.data.reconciliation_history);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Reconciliation History</h1>
      <p className="text-sm text-gray-600 mb-6">A complete audit trail of all currency conversions.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reconciled At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Converted Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
                <tr><td colSpan="5" className="text-center py-16 text-gray-500">Loading history...</td></tr>
            ) : history.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-16 text-gray-500">No reconciliation history found.</td></tr>
            ) : (
                history.map((item) => (
                <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-800">{item.expense.category}</div>
                        <div className="text-gray-500">On {new Date(item.expense.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.expense.amount.toFixed(2)} {item.baseCurrency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.convertedAmount.toFixed(2)} {item.conversionCurrency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.fxRate.toFixed(5)}</td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reconcile;