import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get user info
import ReconciliationModal from '../components/ReconciliationModal';
import AddExpenseModal from '../components/AddExpenseModal';
import toast from 'react-hot-toast';

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
  </tr>
);

const Expenses = () => {
  const { user } = useAuth(); // Get the logged-in user from the context
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // State to hold full user profile

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await api.get('/expense/');
      setExpenses(response.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not fetch expenses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch the full user profile to get the base currency
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user/profile/');
        setUserProfile(response.data);
      } catch (error) {
        console.error("Could not fetch user profile");
      }
    };
    
    setIsLoading(true);
    fetchExpenses();
    fetchUserProfile();
  }, [fetchExpenses]);

  // This is the corrected success handler for reconciliation
  const handleReconcileSuccess = (reconciliationResponse) => {
    const updatedExpense = reconciliationResponse.expense;
    
    setExpenses(currentExpenses => 
      currentExpenses.map(exp => {
        // Find the expense that was reconciled and replace it with the new, complete data
        if (exp.id === updatedExpense.id) {
          return updatedExpense;
        }
        return exp;
      })
    );
    setSelectedExpense(null); // Close the modal
  };
  
  const handleAddExpenseSuccess = () => {
    setIsAddModalOpen(false);
    toast.success("Expense added successfully!");
    fetchExpenses();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* === Filter and Info Sidebar === */}
        <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Base Currency</h3>
                {userProfile ? (
                    <div className="text-center bg-blue-50 text-blue-700 font-bold p-4 rounded-md">
                        <span className="text-3xl">{userProfile.baseCurrency || 'N/A'}</span>
                    </div>
                ) : (
                    <div className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
                )}
                <p className="text-xs text-gray-500 mt-2 text-center">This is your default currency for reconciliations.</p>
            </div>
        </aside>
        
        {/* === Main Content === */}
        <main className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm">
           <div className="p-6 flex items-center justify-between border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Expense Records</h3>
                    <p className="text-sm text-gray-500 mt-1">All OCR-scanned and manually-added expenses.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">Add Expense</button>
           </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category / Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />) : expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(expense.date).toLocaleDateString()}<div className="text-gray-400 italic font-sans">{expense.receipt ? 'OCR Upload' : 'Manual Entry'}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900">{expense.category}</div>
                       
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{expense.amount.toFixed(2)} {expense.currency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {expense.convertedAmount ? `${expense.convertedAmount.toFixed(2)} ${expense.conversionCurrency}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {expense.status === 'RECONCILED' ? 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Reconciled</span>
                        : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => setSelectedExpense(expense)} className="text-blue-600 hover:text-blue-800 font-medium">Reconcile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {selectedExpense && ( <ReconciliationModal expense={selectedExpense} onClose={() => setSelectedExpense(null)} onSuccess={handleReconcileSuccess} /> )}
      {isAddModalOpen && ( <AddExpenseModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddExpenseSuccess} /> )}
    </>
  );
};

export default Expenses;