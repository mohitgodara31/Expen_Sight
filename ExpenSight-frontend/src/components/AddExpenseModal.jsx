import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddExpenseModal = ({ onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Adding expense...');
    
    try {
      // Ensure amount is a float and format the date correctly for the API
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
      };

      await api.post('/expense/', payload);
      toast.success('Expense added successfully!', { id: toastId });
      onSuccess(); // This will close the modal and refresh the expense list
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add expense.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Add Expense Manually</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              {...register('amount', { required: 'Amount is required', valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency (e.g., USD, INR)</label>
            <input
              type="text"
              id="currency"
              {...register('currency', { required: 'Currency is required', minLength: 3, maxLength: 3 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            />
            {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category (e.g., Travel, Food)</label>
            <input
              type="text"
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              {...register('date', { required: 'Date is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;