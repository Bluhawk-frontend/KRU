import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g., http://127.0.0.1:8000

const SignInPage = () => {
  const [role, setRole] = useState('');
  const [facultyPosition, setFacultyPosition] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpAndCaptcha, setShowOtpAndCaptcha] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');

  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Format phone number to show only last 3 digits
  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length < 3) return '*******';
    return '*******' + phone.slice(-3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Submitting form for role:', role);

    try {
      if (role === 'student') {
        const regEx = /^[A-Za-z0-9]{12}$/;
        if (!regEx.test(registrationNumber)) {
          throw new Error('Invalid registration number. Please enter a 12-character alphanumeric roll number (e.g., Y22CSE279017).');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/verify-register/`, {
          register_number: registrationNumber.toUpperCase(),
        });

        console.log('API Response (verify-register):', response.data); // Debug

        if (response.data.message === 'Please enter your password.') {
          setError('Account already exists. Please login.');
          navigate('/login');
          return;
        }

        setStudentData(response.data);
        setRegistrationNumber(response.data.regNo || registrationNumber.toUpperCase());
        setOtpSent(true);
        setShowOtpAndCaptcha(true);
        const maskedPhone = formatPhoneNumber(response.data.phone_number);
        setOtpSuccessMessage(`OTP sent to your registered mobile number ending in ${maskedPhone}`);
        console.log('Student OTP success message set:', `OTP sent to this number: ${maskedPhone}`);
        setCaptcha(generateCaptcha());
      } else if (role === 'university') {
        const phoneRegEx = /^\d{10}$/;
        if (!phoneRegEx.test(phoneNumber)) {
          throw new Error('Invalid phone number. Please enter a 10-digit number.');
        }
        setOtpSent(true);
        setOtpSuccessMessage('OTP generated successfully');
        console.log('Admin OTP success message set:', 'OTP generated successfully');
      }
    } catch (err) {
      console.error('API Error (verify-register):', err.response?.data, err.message); // Debug
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpAndCaptchaSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate CAPTCHA locally
      if (otpInput.trim() === '') {
        throw new Error('Please enter an OTP.');
      }
      if (captchaInput !== captcha) {
        throw new Error('Invalid CAPTCHA. Please try again.');
      }

      // Call OTP verification API
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, {
        register_number: registrationNumber.toUpperCase(),
        otp: otpInput,
      });

      console.log('API Response (verify-otp):', response.data); // Debug

      if (response.data.message === 'OTP verified') {
        setShowOtpAndCaptcha(false);
        setShowPasswordSetup(true);
      } else {
        throw new Error(response.data.error || 'OTP verification failed');
      }
    } catch (err) {
      console.error('API Error (verify-otp):', err.response?.data, err.message); // Debug
      setError(err.response?.data?.error || err.message || 'OTP verification failed');
      setOtpInput('');
      setCaptchaInput('');
      setCaptcha(generateCaptcha());
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Optional: Password strength validation
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error('Password must be at least 8 characters long and include a letter, a number, and a special character.');
      }

      // Call SetPasswordView API
      const response = await axios.post(`${API_BASE_URL}/auth/set-password/`, {
        register_number: registrationNumber.toUpperCase(),
        password: password,
      });

      console.log('API Response (set-password):', response.data); // Debug

      // Optionally store JWT tokens (e.g., in localStorage or context for authentication)
      // localStorage.setItem('access_token', response.data.access);
      // localStorage.setItem('refresh_token', response.data.refresh);

      setError('');
      navigate('/login');
    } catch (err) {
      console.error('API Error (set-password):', err.response?.data, err.message); // Debug
      setError(err.response?.data?.error || err.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col p-6">
      <header className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/logo.png"
            alt="Krishna University Logo"
            className="mr-2 h-10"
          />
          <h1 className="text-xl font-serif text-blue-900">KRISHNA UNIVERSITY</h1>
        </div>
        <nav className="flex flex-wrap font-sans font-medium justify-center gap-4 md:gap-6">
          <Link to="#students" className="text-gray-700 hover:text-blue-600">Students</Link>
          <Link to="#companies" className="text-gray-700 hover:text-blue-600">Companies</Link>
        </nav>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <img
            src="https://kru.ac.in/wp-content/uploads/2020/07/Krishna_University-logo-transparent.png"
            alt="University Logo"
            className="h-28 mx-auto"
          />
        </div>

        <div className="flex justify-center items-center space-x-12 mb-8">
          <div className="flex flex-col items-center">
            <img
              src="https://www.freeiconspng.com/uploads/university-icon-0.png"
              alt="University Icon"
              className="h-14 cursor-pointer transition-transform hover:scale-110"
              onClick={() => {
                setRole('university');
                setFacultyPosition('');
                setPhoneNumber('');
                setStudentData(null);
                setOtpSent(false);
                setShowOtpAndCaptcha(false);
                setShowPasswordSetup(false);
                setOtpSuccessMessage('');
              }}
            />
            <span className="text-sm font-medium text-gray-700 mt-2">Administrative</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.freeiconspng.com/uploads/school-student-icon-16.png"
              alt="Student Icon"
              className="h-14 cursor-pointer transition-transform hover:scale-110"
              onClick={() => {
                setRole('student');
                setRegistrationNumber('');
                setStudentData(null);
                setOtpSent(false);
                setShowOtpAndCaptcha(false);
                setShowPasswordSetup(false);
                setOtpSuccessMessage('');
              }}
            />
            <span className="text-sm font-medium text-gray-700 mt-2">Student</span>
          </div>
        </div>

        <hr className="w-1/2 border-t-2 border-gray-300 mb-8" />

        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          {role === 'student' && (
            <>
              <h2 className="text-2xl font-semibold text-blue-700 text-center mb-6">STUDENT REGISTRATION</h2>
              {!showOtpAndCaptcha && !showPasswordSetup && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number :</label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your 12-character Roll Number (e.g., Y22CSE279017)"
                        maxLength={12}
                        required
                      />
                      <button
                        type="submit"
                        className="bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
                        disabled={isLoading || registrationNumber.length !== 12}
                      >
                        {isLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                </form>
              )}
              {showOtpAndCaptcha && studentData && otpSent && (
                <form onSubmit={handleOtpAndCaptchaSubmit} className="space-y-6">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h5 className="text-sm text-gray-600 font-medium mb-2">
                        {otpSuccessMessage}
                      </h5>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP :</label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter the OTP"
                        required
                      />
                    </div>
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
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP & CAPTCHA'}
                  </button>
                  {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                </form>
              )}
              {showPasswordSetup && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Set Password :</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password :</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Re-enter your password"
                      required
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-red-600 text-sm">Passwords do not match</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
                    disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                  >
                    {isLoading ? 'Saving...' : 'Submit'}
                  </button>
                  {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                </form>
              )}
            </>
          )}
          {role === 'university' && (
            <>
              <h2 className="text-2xl font-semibold text-blue-700 text-center mb-6">Administrative Login</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!facultyPosition && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Position :</label>
                    <select
                      value={facultyPosition}
                      onChange={(e) => setFacultyPosition(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a position</option>
                      <option value="principal">Principal</option>
                      <option value="tpofficer">T&P Officer</option>
                      <option value="coordinator">Coordinator</option>
                    </select>
                  </div>
                )}
                {facultyPosition && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number :</label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your 10-digit phone number"
                        maxLength={10}
                        required
                      />
                      <button
                        type="submit"
                        className="bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 font-medium transition-colors disabled:opacity-50"
                        disabled={isLoading || phoneNumber.length !== 10}
                      >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
              </form>
              {otpSent && otpSuccessMessage && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                  <p>{otpSuccessMessage}</p>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtpSuccessMessage('');
                    }}
                    className="mt-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          )}
          {!role && (
            <div className="text-center">
              <p className="text-gray-600 text-lg">Please select a role above to proceed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
