import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch the full user profile to get the current base currency
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/user/profile/');
            setUserProfile(response.data);
            if (response.data.baseCurrency) {
                setValue('baseCurrency', response.data.baseCurrency);
            }
        } catch (error) {
            toast.error("Could not load user settings.");
        }
    };
    fetchUserProfile();
  }, [setValue]);

  // Handle the form submission to update settings
  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading('Saving settings...');
    try {
      const response = await api.patch('/user/profile/settings/update/', {
        baseCurrency: data.baseCurrency.toUpperCase(),
      });
      toast.success(response.data.message, { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left-side Navigation */}
        <aside className="md:col-span-1">
            <nav className="space-y-1">
                <a href="#" className="bg-gray-100 text-blue-600 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                    <UserCircleIcon className="text-blue-500 group-hover:text-blue-600 mr-3 h-6 w-6"/>
                    <span className="truncate">Profile</span>
                </a>
                {/* <a href="#" className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                    <CurrencyDollarIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6"/>
                    <span className="truncate">Billing</span>
                </a> */}
            </nav>
        </aside>

        {/* Right-side Content */}
        <main className="md:col-span-3">
            <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
                <p className="mt-1 text-sm text-gray-600">Update your account details and currency preferences.</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 max-w-lg">
                    {/* Email Field (Disabled) */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Base Currency Field */}
                    <div>
                        <label htmlFor="baseCurrency" className="block text-sm font-medium text-gray-700">Default Base Currency</label>
                        <input
                            type="text"
                            id="baseCurrency"
                            placeholder="e.g., USD"
                            {...register('baseCurrency', { 
                                required: 'Currency code is required', 
                                minLength: { value: 3, message: 'Must be 3 letters' },
                                maxLength: { value: 3, message: 'Must be 3 letters' }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm uppercase focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.baseCurrency && <p className="text-red-500 text-xs mt-1">{errors.baseCurrency.message}</p>}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;