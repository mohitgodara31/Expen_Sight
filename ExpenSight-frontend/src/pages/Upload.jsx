import React, { useState } from 'react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'; // Import the toast library
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const Upload = () => {
  const { register, handleSubmit, watch } = useForm();
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Watch the file input so we can show the selected file name
  const selectedFile = watch('receipt');
  const fileName = selectedFile && selectedFile[0] ? selectedFile[0].name : 'No file chosen';

  const onSubmit = async (data) => {
    setIsLoading(true);
    setExtractedData(null); // Clear previous results

    // 1. Show a loading toast and save its ID
    const toastId = toast.loading('Uploading and processing receipt...');

    const formData = new FormData();
    formData.append('file', data.receipt[0]);

    try {
      const response = await api.post('/receipt/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // 2. Update the toast to a success message on a successful API call
      toast.success('Receipt processed successfully!', { id: toastId });
      setExtractedData(response.data);

    } catch (err) {
      // 3. Update the toast to an error message if the API call fails
      toast.error(err.response?.data?.detail || 'Upload failed. Please try again.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Upload Receipt</h1>
      <p className="mt-1 text-sm text-gray-600">Upload an image or PDF for automatic expense creation.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <label htmlFor="receipt-upload" className="mt-2 block text-sm font-medium text-gray-900 cursor-pointer">
            <span>Click to upload</span> or drag and drop
          </label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG, or PDF</p>
          <input
            id="receipt-upload"
            type="file"
            {...register('receipt', { required: true })}
            className="sr-only" // Hide the default input, the label will trigger it
            accept=".png, .jpg, .jpeg, .pdf"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">Selected file: {fileName}</p>

        <button 
          type="submit" 
          disabled={isLoading || !selectedFile || selectedFile.length === 0} 
          className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>

      {/* Display results in a clean card */}
      {extractedData && (
        <div className="mt-8 p-6 border border-green-200 bg-green-50 rounded-lg animate-fade-in">
          <h2 className="text-xl font-semibold text-green-800">✅ Success! Expense Created.</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
                <p className="font-medium text-gray-500">Merchant</p>
                <p className="font-semibold text-gray-800">{extractedData.expense.category}</p>
            </div>
             <div>
                <p className="font-medium text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">{new Date(extractedData.expense.date).toLocaleDateString()}</p>
            </div>
             <div>
                <p className="font-medium text-gray-500">Amount</p>
                <p className="font-semibold text-gray-800">{extractedData.expense.amount} {extractedData.expense.currency}</p>
            </div>
            <div>
                <p className="font-medium text-gray-500">Filename</p>
                <p className="font-semibold text-gray-800">{extractedData.receipt.filename}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;