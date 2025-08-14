import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState('');

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password, data.baseCurrency);
      navigate('/login');
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-neutral mb-6">Create your Account</h2>
        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Base Currency (e.g., USD, INR)</label>
            <input
              type="text"
              {...register('baseCurrency', { required: true, minLength: 2, maxLength: 3 })}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
            {errors.baseCurrency && <p className="text-red-500 text-xs mt-1">A 2-3 letter currency code is required.</p>}
          </div>
          <button type="submit" className="w-full py-2 text-white bg-primary rounded-md hover:bg-blue-700">
            Register
          </button>
        </form>
         <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-secondary hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;