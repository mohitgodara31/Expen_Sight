import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Reusable Input Field Component
const Input = ({ id, label, register, errors, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input id={id} {...register} {...props} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
      {errors && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
    </div>
  </div>
);

// Login Form Component
const LoginForm = ({ onSwitch, onLoginSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await login(data.email, data.password);
      onLoginSuccess();
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Login failed.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-900">Welcome</h2>
      {apiError && <p className="text-red-500 text-center text-sm mt-4">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input id="email" label="Email" register={register('email', { required: 'Email is required' })} errors={errors.email} type="email" />
        <Input id="password" label="Password" register={register('password', { required: 'Password is required' })} errors={errors.password} type="password" />
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Sign in</button>
      </form>
      <p className="mt-4 text-center text-sm">Don't have an account? <button onClick={onSwitch} className="font-medium text-blue-600 hover:underline">Sign up</button></p>
    </div>
  );
};

// Register Form Component
const RegisterForm = ({ onSwitch, onRegisterSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const [apiError, setApiError] = useState('');

    const onSubmit = async (data) => {
        setApiError('');
        try {
            await registerUser(data.email, data.password, data.baseCurrency);
            onRegisterSuccess();
        } catch (error) {
            setApiError(error.response?.data?.detail || 'Registration failed.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Create an Account</h2>
            {apiError && <p className="text-red-500 text-center text-sm mt-4">{apiError}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <Input id="email" label="Email" register={register('email', { required: 'Email is required' })} errors={errors.email} type="email" />
                <Input id="password" label="Password" register={register('password', { required: 'Password is required' })} errors={errors.password} type="password" />
                <Input id="baseCurrency" label="Base Currency (e.g., USD)" register={register('baseCurrency', { required: 'Currency is required', minLength: 3, maxLength: 3 })} errors={errors.baseCurrency} />
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Create Account</button>
            </form>
            <p className="mt-4 text-center text-sm">Already have an account? <button onClick={onSwitch} className="font-medium text-blue-600 hover:underline">Sign in</button></p>
        </div>
    );
};


export const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    onClose();
    navigate('/dashboard');
  };
  
  const handleRegisterSuccess = () => {
      setIsLoginView(true); // Switch to login view after successful registration
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
            {isLoginView ? (
              <LoginForm onSwitch={() => setIsLoginView(false)} onLoginSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSwitch={() => setIsLoginView(true)} onRegisterSuccess={handleRegisterSuccess} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};