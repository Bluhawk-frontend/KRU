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
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const otpInputs = useRef([]);
  const accountBoxRef = useRef(null);

  // Check if all editable fields are filled
  const areFieldsValid = () => {
    return (
      studentData.email &&
      studentData.date_of_birth &&
      studentData.gender &&
      studentData.father_name &&
      studentData.mother_name &&
      studentData.aadhar_number
    );
  };

  // Format phone number to show only last 3 digits
  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length < 3) return '*******';
    return '*******' + phone.slice(-3);
  };

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
        console.error('Failed to fetch student data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching student data:', error.message, error.stack);
    }
  };

  const toggleEdit = () => {
    if (!isEditable) {
      if (!areFieldsValid()) {
        setFormError('Please fill all editable fields before editing.');
      } else {
        setFormError('');
      }
    } else {
      setFormError('');
    }
    setIsEditable((prev) => !prev);
  };

  const handleConfirm = async () => {
    const registrationNumber = localStorage.getItem('register_number');
    if (!registrationNumber) {
      console.error('No registration number found in localStorage');
      navigate('/login');
      return;
    }

    if (!areFieldsValid()) {
      console.error('Missing required fields:', {
        email: studentData.email,
        dob: studentData.date_of_birth,
        gender: studentData.gender,
        father_name: studentData.father_name,
        mother_name: studentData.mother_name,
        aadhar_number: studentData.aadhar_number,
      });
      setFormError('Please fill all editable fields before confirming.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/send-student-otp/`, {
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
        setFormError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to send OTP:', response.status, response.statusText, errorData);
        setOtpError(`Failed to send OTP: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error sending OTP:', error.message, error.stack);
      setOtpError('Error sending OTP: Network or server issue. Please try again.');
    }
  };

  const handleSave = async () => {
    const registrationNumber = localStorage.getItem('register_number');
    if (!registrationNumber) {
      console.error('No registration number found in localStorage');
      navigate('/login');
      return;
    }

    if (
      !otp.join('') ||
      !studentData.email ||
      !studentData.date_of_birth ||
      !studentData.gender ||
      !studentData.father_name ||
      !studentData.mother_name ||
      !studentData.aadhar_number
    ) {
      console.error('Missing required fields:', {
        otp: otp.join(''),
        email: studentData.email,
        dob: studentData.date_of_birth,
        gender: studentData.gender,
        father_name: studentData.father_name,
        mother_name: studentData.mother_name,
        aadhar_number: studentData.aadhar_number,
      });
      setOtpError('All fields and OTP are required. Please fill out completely.');
      return;
    }

    const payload = {
      register_number: registrationNumber.toUpperCase(),
      otp: otp.join(''),
      email: studentData.email,
      dob: studentData.date_of_birth,
      gender: studentData.gender,
      father_name: studentData.father_name,
      mother_name: studentData.mother_name,
      aadhar_number: studentData.aadhar_number,
    };

    console.log('Sending request to API with payload:', payload);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/update-student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Student data updated successfully:', data);
        setOtpError('');
        setFormError('');
        setShowOtpInput(false);
        setIsEditable(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update student data:', response.status, response.statusText, errorData);
        setOtpError(`Failed to update student data: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error updating student data:', error.message, error.stack);
      setOtpError('Error updating student data: Network or server issue. Please try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showAccountBox && accountBoxRef.current && !accountBoxRef.current.contains(event.target)) {
        setShowAccountBox(false);
        setShowOtpInput(false);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        setFormError('');
        setIsEditable(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showAccountBox]);

  useEffect(() => {
    if (showAccountBox) {
      fetchStudentData();
    }
  }, [showAccountBox]);

  useEffect(() => {
    if (isEditable && !areFieldsValid()) {
      setFormError('Please fill all editable fields.');
    } else {
      setFormError('');
    }
  }, [studentData, isEditable]);

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
        <div ref={accountBoxRef} className="absolute top-20 right-2 w-[400px] bg-white rounded-xl shadow-2xl z-50 p-6 font-sans border border-gray-200 max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center">
            <img
              src="data:image/png;base64,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"
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mb-6 shadow-md border-4 border-white hover:scale-105 transition-transform"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-1">{studentData.name}</h2>
            <p className="text-sm text-gray-500 mb-6">Student, Krishna University</p>

            <div className="w-full space-y-6">
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
                { label: "Date of Birth", type: "text", placeholder: "Enter Date of Birth (YYYY-MM-DD)", key: "date_of_birth" },
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
              {formError && <p className="text-red-600 text-sm mt-2">{formError}</p>}

              {showOtpInput && (
                <div className="mt-6">
                  <h5 className="text-sm text-gray-600 font-medium mb-2">
                    OTP sent to your registered mobile number ending in{' '}
                    <span className="font-semibold">{formatPhoneNumber(studentData.phone_number)}</span>
                  </h5>
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

          <div className=" bottom-0 bg-white pt-4 mt-4 border-t border-gray-200">
            <div className="w-full flex justify-between">
              <button
                onClick={() => {
                  setShowAccountBox(false);
                  setShowOtpInput(false);
                  setOtp(['', '', '', '', '', '']);
                  setOtpError('');
                  setFormError('');
                  setIsEditable(false);
                }}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Close
              </button>
              {showOtpInput ? (
                <button
                  onClick={handleSave}
                  className="w-1/2 ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!otp.join('')}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="w-1/2 ml-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!isEditable || !areFieldsValid()}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
