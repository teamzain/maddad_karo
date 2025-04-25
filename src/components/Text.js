import React, { useState, useEffect, useRef } from 'react';

const GoFundMeReveal = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // The text content from the original image
  const heading = "We've got you covered.";
  const line1 = "Maddad Karo is a trusted leader in online fundraising.";
  const line2Part1 = "With ";
  const line2Part2 = "simple pricing";
  const line2Part3 = " and a team of ";
  const line2Part4 = "Trust & Safety";
  const line3 = "experts in your corner, you can raise money or make";
  const line4 = "a donation with peace of mind.";

  useEffect(() => {
    // Set up intersection observer to detect when section is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        backgroundColor: '#0A4730',
        padding: '80px 20px',
        color: 'white',
        fontFamily: '"Nunito Sans", sans-serif',
        minHeight: '300px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          .text-reveal {
            position: relative;
            overflow: hidden;
            margin-bottom: 20px;
          }
          
          .blurred {
            opacity: 0.4;
            filter: blur(4px);
            position: absolute;
            top: 0;
            left: 0;
            user-select: none;
            pointer-events: none;
          }
          
          .reveal-content {
            transform: translateX(${isVisible ? '0' : '-100%'});
            transition: transform 0.8s ease-out;
          }
          
          .heading {
            font-size: 42px;
            font-weight: bold;
            margin-bottom: 30px;
          }
          
          .paragraph {
            font-size: 32px;
            line-height: 1.4;
            margin-bottom: 15px;
          }
          
          .link {
            text-decoration: underline;
            font-weight: bold;
          }
          
          .staggered-1 { transition-delay: 0.1s; }
          .staggered-2 { transition-delay: 0.3s; }
          .staggered-3 { transition-delay: 0.5s; }
          .staggered-4 { transition-delay: 0.7s; }
          .staggered-5 { transition-delay: 0.9s; }
          
          @media (max-width: 768px) {
            .heading { font-size: 28px; }
            .paragraph { font-size: 22px; }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Heading */}
        <div className="text-reveal heading">
          <div className="blurred">{heading}</div>
          <div className={`reveal-content ${isVisible ? 'staggered-1' : ''}`}>
            {heading}
          </div>
        </div>
        
        {/* Line 1 */}
        <div className="text-reveal paragraph">
          <div className="blurred">{line1}</div>
          <div className={`reveal-content ${isVisible ? 'staggered-2' : ''}`}>
            {line1}
          </div>
        </div>
        
        {/* Line 2 with links */}
        <div className="text-reveal paragraph">
          <div className="blurred">
            {line2Part1}
            <span className="link">{line2Part2}</span>
            {line2Part3}
            <span className="link">{line2Part4}</span>
          </div>
          <div className={`reveal-content ${isVisible ? 'staggered-3' : ''}`}>
            {line2Part1}
            <span className="link">{line2Part2}</span>
            {line2Part3}
            <span className="link">{line2Part4}</span>
          </div>
        </div>
        
        {/* Line 3 */}
        <div className="text-reveal paragraph">
          <div className="blurred">{line3}</div>
          <div className={`reveal-content ${isVisible ? 'staggered-4' : ''}`}>
            {line3}
          </div>
        </div>
        
        {/* Line 4 */}
        <div className="text-reveal paragraph">
          <div className="blurred">{line4}</div>
          <div className={`reveal-content ${isVisible ? 'staggered-5' : ''}`}>
            {line4}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoFundMeReveal;