import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfessionalMarquee from '../components/ProfessionalMarquee';
import useTypingAnimation from '../hooks/useTypingAnimation';

function HomePage() {
  const permanentText = " Krishna University Training and Placements";
  const { displayedText } = useTypingAnimation('Welcome to', 150, 3000);
  

  return (
    <div className="min-h-screen bg-white">
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
        <nav className="flex flex-wrap font-sans font-medium justify-center gap-4 md:gap-6">
          <Link to="#students" className="text-gray-700 hover:text-blue-600">Students</Link>
          <Link to="#companies" className="text-gray-700 hover:text-blue-600">Companies</Link>
          <Link to="/signin" className="bg-[#006BB3] text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Register
          </Link>
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
  <Link
    to="/signin"
    className="group relative bg-[#006BB3] hover:bg-[#005F9F] text-white px-5 py-3 rounded-full flex items-center justify-center gap-2.5 font-bold border-2 border-white/30 hover:border-white/60 hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden before:content-[''] before:absolute before:w-[100px] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent before:top-0 before:-left-[100px] before:opacity-60 hover:before:animate-shine"
  >
    Register Now
    <svg
      className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
        clipRule="evenodd"
      />
    </svg>
  </Link>
</div>
        </div>
      </main>

      <style jsx global>{`
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

export default HomePage;