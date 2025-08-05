import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g., http://127.0.0.1:8000

const LoginPage = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const regEx = /^[A-Za-z0-9]{12}$/;
      if (!regEx.test(registrationNumber)) {
        throw new Error('Invalid registration number. Please enter a 12-character alphanumeric roll number (e.g., Y22CSE279017).');
      }

      // Call LoginView API
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        register_number: registrationNumber.toUpperCase(),
        password: password,
      });

      console.log('API Response (login):', response.data); // Debug

      // Store JWT tokens and register_number in localStorage
      localStorage.setItem('access_token', response.data.access);
      
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('register_number', response.data.register_number);

      setError('');
      navigate('/dashboard');
    } catch (err) {
      console.error('API Error (login):', err.response?.data, err.message); // Debug
      setError(err.response?.data?.error || err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center p-6">
      <div className="mb-8">
        <img
          src="https://kru.ac.in/wp-content/uploads/2020/07/Krishna_University-logo-transparent.png"
          alt="University Logo"
          className="h-28 mx-auto"
        />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-700 text-center mb-6">STUDENT LOGIN</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number :</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your 12-character Roll Number (e.g., Y22CSE279017)"
              maxLength={12}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
            disabled={isLoading || registrationNumber.length !== 12 || !password}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;