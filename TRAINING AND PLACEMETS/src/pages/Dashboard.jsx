import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfessionalMarquee from '../components/ProfessionalMarquee';
import useTypingAnimation from '../hooks/useTypingAnimation';

function Dashboard() {
  const { displayedText } = useTypingAnimation('Welcome to', 150, 3000);
  const permanentText = " Krishna University Training and Placements";

  const [showMenu, setShowMenu] = useState(false);
  const [showAccountBox, setShowAccountBox] = useState(false);
  const [studentData, setStudentData] = useState({
    register_number: '',
    name: '',
    phone_number: '',
    email: '',
    date_of_birth: '',
    father_name: '',
    mother_name: '',
    aadhar_number: '',
    gender: '',
  });
  const [isEditable, setIsEditable] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();
  const otpInputs = useRef([]);

  const fetchStudentData = async () => {
    const registrationNumber = localStorage.getItem('register_number');
    if (!registrationNumber) {
      console.error('No registration number found in localStorage');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/student/?register_number=${registrationNumber.toUpperCase()}`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Student API Response:', data);
        setStudentData({
          register_number: data.register_number || '12345678',
          name: data.name || 'Suresh Kumar',
          phone_number: data.phone_number || '',
          email: data.email || '',
          date_of_birth: data.dob || '',
          father_name: data.father_name || '',
          mother_name: data.mother_name || '',
          aadhar_number: data.aadhar_number || '',
          gender: data.gender || 'Not Specified',
        });
      } else {
        console.error('Failed to fetch student data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const handleSave = async () => {
    const registrationNumber = localStorage.getItem('register_number');
    if (!registrationNumber) {
      console.error('No registration number found in localStorage');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ register_number: registrationNumber.toUpperCase() }),
      });
      if (response.ok) {
        console.log('OTP sent successfully');
        setShowOtpInput(true);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
      } else {
        console.error('Failed to send OTP:', response.status);
        setOtpError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError('Error sending OTP. Please try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleConfirm = async () => {
  const enteredOtp = otp.join('');
  if (enteredOtp === '123456') { // Mocked OTP
    alert('OTP verified! Saving your profile details...');

    // Prepare the data to be sent in the API request
    const updatedData = {
      register_number: localStorage.getItem('register_number'), // Fetch register number from localStorage
      otp: enteredOtp,
      email: studentData.email,
      dob: studentData.date_of_birth,
      gender: studentData.gender,
      father_name: studentData.father_name,
      mother_name: studentData.mother_name,
      aadhar_number: studentData.aadhar_number,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Profile updated successfully:', responseData);
        alert('Your profile has been updated successfully.');
        setShowOtpInput(false);
        setIsEditable(false);
      } else {
        console.error('Failed to update profile:', response.status);
        setOtpError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setOtpError('Error updating profile. Please try again.');
    }
  } else {
    setOtpError('Invalid OTP. Please try again.');
  }
};


  useEffect(() => {
    if (showAccountBox) {
      fetchStudentData();
    }
  }, [showAccountBox]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/logo.png"
            alt="Krishna University Logo"
            className="mr-2 h-10"
          />
          <h1 className="text-xl font-serif text-blue-900">KRISHNA UNIVERSITY</h1>
        </div>
        <nav className="flex flex-wrap font-sans font-medium justify-center gap-4 md:gap-6 relative">
          <Link to="#students" className="text-gray-700 hover:text-blue-600">Students</Link>
          <Link to="#companies" className="text-gray-700 hover:text-blue-600">Companies</Link>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            PROFILE
          </button>

          {/* Menu Box */}
          {showMenu && (
            <div className="absolute top-12 right-0 w-64 bg-white border border-gray-200 shadow-lg rounded-md z-50">
              <ul className="p-4 space-y-2 text-gray-800">
                <li>
                  <button
                    onClick={() => {
                      setShowAccountBox(true);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                  >
                    👤 Account
                  </button>
                </li>
                <li><Link to="/settings" className="block hover:bg-gray-100 px-2 py-2 rounded">⚙️ Settings</Link></li>
                <li><Link to="/help" className="block hover:bg-gray-100 px-2 py-2 rounded">🆘 Help & Request</Link></li>
                <li>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate('/login');
                    }}
                    className="block w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      <ProfessionalMarquee />

      {/* Main Section */}
      <main className="relative flex items-center justify-center h-[calc(100vh-60px)] bg-[url('https://kru.ac.in/wp-content/uploads/2021/06/admin-block-min.jpeg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <div className="text-center z-10 px-4 w-full max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 flex flex-col items-center">
            <div className="flex items-center justify-center flex-wrap">
              <span className="typing-animation-container">
                <span className="typing-animation-text text-orange-500 font-serif font-bold">
                  {displayedText}
                </span>
              </span>
              <span className="permanent-text animation-fade-in">
                {permanentText}
              </span>
            </div>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <Link to="/signin" className="bg-green-700 hover:bg-blue-800 text-white px-6 py-3 rounded transition-colors font-sans">
              Register Now
            </Link> */}
          </div>
        </div>
      </main>

      {showAccountBox && (
        <div className="absolute top-20 right-10 w-[400px] bg-white rounded-xl shadow-2xl z-50 p-6 font-sans border border-gray-200 min-h-[85vh] flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <img
              src="https://pbs.twimg.com/profile_images/1613166539775299591/jGFXbzd__400x400.jpg"
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mb-6 shadow-md border-4 border-white hover:scale-105 transition-transform"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-1">{studentData.name}</h2>
            <p className="text-sm text-gray-500 mb-6">Student, Krishna University</p>

            {/* Profile Input Fields */}
            <div className="w-full space-y-6">
              {/* Non-Editable Fields */}
              {[
                { label: "Registration Number", type: "text", key: "register_number" },
                { label: "Name", type: "text", key: "name" },
                { label: "Phone Number", type: "text", key: "phone_number" },
              ].map((field, index) => (
                <div className="relative" key={index}>
                  <label className="block text-sm text-gray-600 font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={studentData[field.key]}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 cursor-not-allowed"
                  />
                </div>
              ))}

              {/* Editable Fields Section */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Editable Information</h3>
                <button
                  onClick={toggleEdit}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none"
                  title={isEditable ? 'Lock fields' : 'Edit fields'}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
              {[
                { label: "Date of Birth", type: "text", placeholder: "Enter Date of Birth", key: "date_of_birth" },
                { label: "Father's Name", type: "text", placeholder: "Enter Father's Name", key: "father_name" },
                { label: "Mother's Name", type: "text", placeholder: "Enter Mother's Name", key: "mother_name" },
                { label: "Email", type: "email", placeholder: "Enter Email Address", key: "email" },
                { label: "Aadhar Number", type: "text", placeholder: "Enter Aadhar Number", key: "aadhar_number" },
                { label: "Gender", type: "text", placeholder: "Enter Gender", key: "gender" },
              ].map((field, index) => (
                <div className="relative" key={index}>
                  <label className="block text-sm text-gray-600 font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={studentData[field.key]}
                    onChange={(e) => isEditable && setStudentData({ ...studentData, [field.key]: e.target.value })}
                    readOnly={!isEditable}
                    className={`w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 ${
                      !isEditable ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              ))}

              {/* OTP Input */}
              {showOtpInput && (
                <div className="mt-6">
                  <label className="block text-sm text-gray-600 font-medium mb-2">
                    Enter OTP
                  </label>
                  <div className="flex justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        ref={(el) => (otpInputs.current[index] = el)}
                        className="w-10 h-10 text-center border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-red-600 text-sm mt-2">{otpError}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Buttons at bottom */}
          <div className="w-full mt-6 flex justify-between">
            <button
              onClick={() => {
                setShowAccountBox(false);
                setShowOtpInput(false);
                setOtp(['', '', '', '', '', '']);
                setOtpError('');
              }}
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold transition"
            >
              Close
            </button>
            {showOtpInput ? (
              <button
                onClick={handleConfirm}
                className="w-1/2 ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Confirm
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="w-1/2 ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {/* Typing Animation Styles */}
      <style jsx="true" global="true">{`
        .typing-animation-container {
          position: relative;
          display: inline-block;
          margin-right: 0.5rem;
          height: 1.2em;
        }
        .typing-animation-text {
          position: relative;
          overflow: hidden;
          border-right: 2px solid white;
          white-space: nowrap;
          animation: blink-caret 0.75s step-end infinite;
          display: inline-block;
          vertical-align: middle;
        }
        .permanent-text {
          display: inline-block;
          vertical-align: middle;
          opacity: 0;
          animation: fade-in 0.5s forwards;
          animation-delay: 1.8s;
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: white; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;