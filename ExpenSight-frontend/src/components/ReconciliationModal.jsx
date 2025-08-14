import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';

const ReconciliationModal = ({ expense, onClose, onSuccess }) => {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    const toastId = toast.loading('Reconciling...');
    try {
      const response = await api.post('/reconcile/', {
        expenseId: expense.id,
        conversionCurrency: data.conversionCurrency,
      });
      toast.success('Reconciliation successful!', { id: toastId });
      
      // This is the crucial part: pass the data from the API response to the success handler.
      onSuccess(response.data);

    } catch (err) {
      toast.error(err.response?.data?.detail || 'Reconciliation failed.', { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reconcile Expense</h2>
        <p className="mb-2"><strong>Expense:</strong> {expense.amount.toFixed(2)} {expense.currency}</p>
        <p className="mb-4 text-sm text-gray-600">Enter a currency to convert to. Leave blank to use your default base currency.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="conversionCurrency" className="block text-sm font-medium text-gray-700">Conversion Currency (Optional)</label>
            <input
              type="text"
              id="conversionCurrency"
              {...register('conversionCurrency', { minLength: 3, maxLength: 3 })}
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="e.g., EUR"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Reconcile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReconciliationModal;