import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfessionalMarquee = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const announcements = [
    { text: "🎉 2025 Training and Placements 🎉", href: "/placements" },
    { text: "🚀 New Campus Recruitment Program", href: "/recruitment" },
    { text: "🏆 Industry Collaboration Initiative", href: "/collaborations" },
    { text: "📢 Upcoming Career Fair", href: "/events" }
  ];

  const marqueeContent = [...announcements, ...announcements];

  return (
    <div 
      className="relative overflow-hidden bg-[#006BB3] py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`whitespace-nowrap text-white font-sans font-medium tracking-wide text-center ${isPaused ? 'pause-animation' : 'play-animation'}`}
      >
        {marqueeContent.map((announcement, index) => (
          <Link
            key={index}
            to={announcement.href}
            className="inline-block mx-8 hover:text-yellow-300 transition-colors"
          >
            {announcement.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalMarquee;