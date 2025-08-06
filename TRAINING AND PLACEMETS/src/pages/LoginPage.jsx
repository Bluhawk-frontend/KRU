import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g., http://127.0.0.1:8000

const LoginPage = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleVerifyCredentials = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const regEx = /^[A-Za-z0-9]{12}$/;
      if (!regEx.test(registrationNumber)) {
        throw new Error('Invalid registration number. Please enter a 12-character alphanumeric roll number (e.g., Y22CSE279017).');
      }

      if (!password) {
        throw new Error('Please enter a password.');
      }

      // Generate CAPTCHA and show CAPTCHA input field
      setCaptcha(generateCaptcha());
      setShowCaptcha(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate CAPTCHA locally
      if (captchaInput !== captcha) {
        throw new Error('Invalid CAPTCHA. Please try again.');
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
      setCaptchaInput('');
      setCaptcha(generateCaptcha()); // Generate new CAPTCHA on error
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
        {!showCaptcha && (
          <form onSubmit={handleVerifyCredentials} className="space-y-6">
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
              disabled={isLoading || registrationNumber.length !== 12 || !password}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </form>
        )}
        {showCaptcha && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter CAPTCHA :</label>
              <div className="flex space-x-4 items-center">
                <p className="p-3 px-6 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 shadow-md text-gray-900 font-mono text-lg tracking-widest rotate-[-1deg] select-none">
                  {captcha}
                </p>
                <button
                  onClick={() => setCaptcha(generateCaptcha())}
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-2xl"
                  title="Refresh CAPTCHA"
                >
                  🔄
                </button>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the CAPTCHA"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
              disabled={isLoading || !captchaInput}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;