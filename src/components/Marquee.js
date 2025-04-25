import { useState, useEffect, useRef } from 'react';

export default function TwoLineMarquee() {
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const marqueeRef1 = useRef(null);
  const marqueeRef2 = useRef(null);

  const startAnimation = (ref) => {
    if (ref.current) {
      ref.current.style.animationPlayState = 'running';
    }
  };

  const stopAnimation = (ref) => {
    if (ref.current) {
      ref.current.style.animationPlayState = 'paused';
    }
  };

  // Function to reset animation - fix for ESLint errors
  const resetAnimation = (ref, animationName) => {
    if (ref.current) {
      ref.current.style.animationName = 'none';
      // Using requestAnimationFrame to ensure the style change takes effect
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.animationName = animationName;
          }
        });
      });
    }
  };

  useEffect(() => {
    // Start animations immediately on component mount
    startAnimation(marqueeRef1);
    startAnimation(marqueeRef2);
    
    // Force a repaint to ensure animation starts properly - fixed for ESLint
    setTimeout(() => {
      resetAnimation(marqueeRef1, 'marqueeLeftToRight');
      resetAnimation(marqueeRef2, 'marqueeRightToLeft');
    }, 10);
  }, []); // Empty dependency array ensures this runs once on mount

  const containerStyle = {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    padding: '20px 0',
    marginTop:'-30px',
    position: 'relative',
    fontFamily: '"Nunito Sans", sans-serif',
  };

  const lineContainerStyle = {
    overflow: 'hidden',
    marginBottom: '12px',
    position: 'relative'
  };

  const marqueeStyle1 = (isHovered) => ({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    animation: 'marqueeLeftToRight 120s linear infinite',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.4s ease',
    paddingRight: '0%',
    fontStyle: 'italic'
  });

  const marqueeStyle2 = (isHovered) => ({
    whiteSpace: 'nowrap',
    display: 'inline-block',
    animation: 'marqueeRightToLeft 120s linear infinite',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.4s ease',
    paddingLeft: '100%',
    fontStyle: 'italic'
  });

  const textStyle = (isHovered) => ({
    display: 'inline-block',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    padding: isHovered ? '5px 10px' : '0',
    WebkitTextStroke: isHovered ? '2px #1A685B' : 'none',
    color: isHovered ? 'transparent' : '#1A685B',
    textShadow: isHovered ? '0 0 8px rgba(255, 255, 255, 0.3)' : '1px 1px 2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: '2'
  });

  return (
    <div style={containerStyle} className="marquee-container">
      <style>
        {`
          @keyframes marqueeLeftToRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes marqueeRightToLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-200%); }
          }
          
          .marquee-text {
            will-change: transform;
            font-size: clamp(40px, 10vw, 120px); /* Responsive font sizing for larger screens */
          }
          
          .marquee-text span {
            display: inline-block;
          }
          
          /* Responsive breakpoints with improved mobile sizing */
          @media (max-width: 1440px) {
            .marquee-text {
              font-size: clamp(40px, 8vw, 110px);
            }
          }
          
          @media (max-width: 1024px) {
            .marquee-text {
              font-size: clamp(36px, 7vw, 90px);
            }
          }
          
          @media (max-width: 768px) {
            .marquee-container {
              margin-top: 25px;
              padding: 15px 0;
            }
            .marquee-text {
              font-size: clamp(32px, 7vw, 70px); /* Increased from 28px to 32px */
            }
          }
          
          @media (max-width: 480px) {
            .marquee-text {
              font-size: clamp(30px, 6.5vw, 50px); /* Increased from 24px to 30px */
            }
          }
          
          @media (max-width: 320px) {
            .marquee-text {
              font-size: clamp(28px, 6vw, 40px); /* Added smaller screen support */
            }
          }
        `}
      </style>
      
      <div style={lineContainerStyle}>
        <div 
          ref={marqueeRef1}
          className="marquee-text"
          style={marqueeStyle1(isHovered1)}
          onMouseEnter={() => {
            setIsHovered1(true);
            stopAnimation(marqueeRef1);
          }}
          onMouseLeave={() => {
            setIsHovered1(false);
            startAnimation(marqueeRef1);
          }}
        >
          <span style={textStyle(isHovered1)}>
            Connect With Purpose — Transparent Giving — Verified Recipients — Direct Impact — Connect With Purpose — Transparent Giving — Verified Recipients — Direct Impact —
          </span>
        </div>
      </div>
      
      <div style={lineContainerStyle}>
        <div 
          ref={marqueeRef2}
          className="marquee-text"
          style={marqueeStyle2(isHovered2)}
          onMouseEnter={() => {
            setIsHovered2(true);
            stopAnimation(marqueeRef2);
          }}
          onMouseLeave={() => {
            setIsHovered2(false);
            startAnimation(marqueeRef2);
          }}
        >
          <span style={textStyle(isHovered2)}>
            Maddad Kro: Bridging Hearts — 100% Donation Delivery — Change Lives — Be The Difference — Maddad Kro: Bridging Hearts — 100% Donation Delivery — Change Lives — Be The Difference —
          </span>
        </div>
      </div>
    </div>
  );
}