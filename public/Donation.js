import React, { useState, useEffect, useRef } from 'react';

const CharityFundraiserCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null); // New state to track tapped card
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  const fundraisers = [
    {
      id: 1,
      title: "Make Mom's 60th Grand Canyon Dream Come True",
      image: "/api/placeholder/400/300",
      donations: "2.1K donations",
      raised: "$73,650 raised",
      progress: 80,
      description: "After 35 years of putting her family first, help us surprise Mom with the Grand Canyon adventure she's always dreamed of for her milestone birthday."
    },
    {
      id: 2,
      title: "Honoring Austin Metcalf: Help His Family Heal",
      image: "/api/placeholder/400/300",
      donations: "10.7K donations",
      raised: "$503,104 raised",
      progress: 65,
      description: "Support Austin's family during this difficult time. All proceeds will go toward memorial services and establishing a foundation in his honor."
    },
    {
      id: 3,
      title: "Help Lily Rebuild Her Life",
      image: "/api/placeholder/400/300",
      donations: "6K donations",
      raised: "£285,818 raised",
      progress: 95,
      description: "Lily lost everything in a devastating house fire. Your donations will help her secure housing, replace essentials, and begin rebuilding her life."
    },
    {
      id: 4,
      title: "Staminali negli USA: una speranza per Miriam",
      image: "/api/placeholder/400/300",
      donations: "1.6K donations",
      raised: "€67,162 raised",
      progress: 70,
      description: "Help Miriam access specialized stem cell treatment in the USA. This potentially life-changing therapy offers hope where conventional treatments have failed."
    },
    {
      id: 5,
      title: "Das ungeborene Mädchen das seinen Papa nie kennenlernen wird",
      image: "/api/placeholder/400/300",
      donations: "2K donations",
      raised: "€81,903 raised",
      progress: 85,
      description: "Support a mother and her unborn daughter who tragically lost their father/husband. Funds will help with medical expenses and future education costs."
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % fundraisers.length);
      }, 5000);

      return () => clearInterval(timerRef.current);
    } else if (isPaused && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isVisible, fundraisers.length, isPaused]);

  // Add click outside handler to close expanded card
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if there's an expanded card and if the click is outside carousel cards
      if (expandedCard !== null && carouselRef.current && !event.target.closest('.carousel-card')) {
        setExpandedCard(null);
        setIsPaused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [expandedCard]);

  const isMobile = () => windowWidth < 768;

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fundraisers.length) % fundraisers.length);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fundraisers.length);
  };

  const handleCardClick = (index) => {
    // Toggle the card expansion state
    if (expandedCard === index) {
      // If the card is already expanded, close it
      setExpandedCard(null);
      setHoveredCard(null);
      setIsPaused(false);
    } else {
      // If the card is not expanded, expand it
      setExpandedCard(index);
      setHoveredCard(index);
      setIsPaused(true);
    }
  };

  const getCardStyle = (index) => {
    const isSelected = hoveredCard === index || expandedCard === index;
    const cardWidth = isMobile() ? '260px' : '350px';  // Slightly smaller on mobile
    const cardHeight = isSelected ? 'auto' : isMobile() ? '360px' : '420px';
    
    const baseStyle = {
      width: cardWidth,
      height: cardHeight,
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: isSelected 
        ? '0 20px 40px rgba(0,0,0,0.18)' 
        : '0 10px 25px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.04)',
      zIndex: isSelected ? 10 : 1
    };

    const centerIndex = currentIndex;
    const diff = index - centerIndex;
    const normalizedDiff = ((diff + fundraisers.length) % fundraisers.length) - 2;

    const getOffset = () => {
      if (isMobile()) return normalizedDiff * 180; // Reduced offset on mobile
      return normalizedDiff * 380;
    };

    if (isSelected) {
      return {
        ...baseStyle,
        transform: `translate(-50%, -50%) scale(1.1)`,
        zIndex: 10,
        cursor: 'pointer'
      };
    } else if (normalizedDiff === 0) {
      return {
        ...baseStyle,
        zIndex: 5,
        transform: isVisible ? `translate(-50%, -50%) scale(1.05)` : `translate(-50%, -30%) scale(1.05)`,
        boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
      };
    } else {
      const offset = getOffset();
      const scale = isMobile() 
        ? 1 - Math.abs(normalizedDiff) * 0.18  // More pronounced scaling on mobile
        : 1 - Math.abs(normalizedDiff) * 0.12;
      const opacity = isVisible ? (1 - Math.abs(normalizedDiff) * 0.25) : 0;  // More opacity difference
      const blur = Math.abs(normalizedDiff) * 1.5;
      
      return {
        ...baseStyle,
        zIndex: 4 - Math.abs(normalizedDiff),
        transform: isVisible ? `translate(calc(-50% + ${offset}px), -50%) scale(${scale})` : `translate(calc(-50% + ${offset}px), -30%) scale(${scale})`,
        opacity: opacity,
        filter: `blur(${blur}px)`,
        display: Math.abs(normalizedDiff) > 2 ? 'none' : 'flex',
      };
    }
  };

  return (
    <div 
      ref={carouselRef} 
      style={{
        backgroundColor: '#ffffff',  // Changed to white background
        padding: isMobile() ? '30px 16px 60px' : '96px 32px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        height: isMobile() ? '520px' : '600px'  // Increased height for mobile
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: isMobile() ? '60px' : '70px',  // Increased spacing on mobile
        }}>
          <h2 style={{
            fontSize: isMobile() ? '26px' : '40px',  // Slightly larger on mobile
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px',
            fontFamily: '"Inter", sans-serif',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out'
          }}>
            FEATURED FUNDRAISERS
          </h2>
          <p style={{
            fontSize: isMobile() ? '15px' : '16px',  // Slightly larger on mobile
            color: '#6b7280',
            lineHeight: '1.6',
            padding: isMobile() ? '0 12px' : '0',  // Added padding on mobile
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
            transitionDelay: '0.1s'
          }}>
            Discover inspiring campaigns making a real difference in people's lives.
            Every donation matters, no matter how small. Join our community of givers today.
          </p>
        </div>

        <div style={{
          position: 'relative',
          height: isMobile() ? '360px' : '384px',
          marginTop: isMobile() ? '30px' : '0'  // Added extra space on mobile
        }}>
          {fundraisers.map((fundraiser, index) => (
            <div 
              key={fundraiser.id} 
              className="carousel-card" // Added class for click outside detection
              style={getCardStyle(index)}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => {
                setHoveredCard(index);
                setIsPaused(true);
              }}
              onMouseLeave={() => {
                if (expandedCard !== index) { // Only close if not expanded by tap
                  setHoveredCard(null);
                  setIsPaused(false);
                }
              }}
              onTouchStart={(e) => {
                // Prevent default to avoid issues with click handling
                e.stopPropagation();
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '170px'  // Slightly reduced height for images on all devices
              }}>
                <img 
                  src={fundraiser.image} 
                  alt={fundraiser.title} 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease-out',
                    transform: (hoveredCard === index || expandedCard === index) ? 'scale(1.05)' : 'scale(1)'
                  }} 
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  pointerEvents: 'none'
                }} />
                <button 
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    padding: '6px 16px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    transform: (hoveredCard === index || expandedCard === index) ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card expansion when clicking donate
                  }}
                >
                  + DONATE
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {fundraiser.donations}
                </div>
              </div>

              <div style={{
                padding: isMobile() ? '22px 16px' : '20px',  // Increased padding on mobile
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile() ? '16px' : '12px'  // Added gap for better spacing on mobile
              }}>
                <h3 style={{ 
                  fontSize: isMobile() ? '15px' : '16px',
                  fontWeight: '600',
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '1.4',
                  height: (hoveredCard === index || expandedCard === index) ? 'auto' : '46px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical'
                }}>
                  {fundraiser.title}
                </h3>
                
                {(hoveredCard === index || expandedCard === index) && (
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    margin: '0',
                    marginBottom: '8px',
                    opacity: (hoveredCard === index || expandedCard === index) ? 1 : 0,
                    maxHeight: (hoveredCard === index || expandedCard === index) ? '200px' : '0',
                    transition: 'opacity 0.3s ease, max-height 0.5s ease',
                    overflow: 'hidden'
                  }}>
                    {fundraiser.description}
                  </p>
                )}
                
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  margin: '4px 0 8px',  // Adjusted margins
                  position: 'relative'
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '8px',
                    transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    width: isVisible ? `${fundraiser.progress}%` : '0%',
                    backgroundImage: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
                    backgroundSize: '200% 100%',
                    animation: isVisible ? 'gradient-shift 3s ease infinite' : 'none',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                      animation: isVisible ? 'shine 2s ease-in-out infinite' : 'none',
                      transform: 'skewX(-20deg)',
                    }} />
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  marginTop: isMobile() ? '4px' : '0'
                }}>
                  <div style={{
                    fontSize: isMobile() ? '15px' : '16px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    {fundraiser.raised}
                  </div>
                  <div style={{
                    fontSize: isMobile() ? '13px' : '14px',
                    fontWeight: '500',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      marginRight: '6px',
                      boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
                      animation: isVisible ? 'pulse-dot 1.5s ease-in-out infinite' : 'none'
                    }}></span>
                    {fundraiser.progress}% Complete
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows - Moved to corners */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            top: isMobile() ? '15px' : '30px',  // Positioned at top
            left: isMobile() ? '10px' : '30px',  // Positioned at left
            backgroundColor: 'white',
            width: isMobile() ? '34px' : '48px',
            height: isMobile() ? '34px' : '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.2s ease',
            opacity: isVisible ? 1 : 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <button
          onClick={handleNextSlide}
          aria-label="Next slide"
          style={{
            position: 'absolute',
            top: isMobile() ? '15px' : '30px',  // Positioned at top
            right: isMobile() ? '10px' : '30px',  // Positioned at right
            backgroundColor: 'white',
            width: isMobile() ? '34px' : '48px',
            height: isMobile() ? '34px' : '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.2s ease',
            opacity: isVisible ? 1 : 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      
      {/* Pagination Dots - Added for mobile */}
      {isMobile() && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          gap: '8px'
        }}>
          {fundraisers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentIndex === index ? '#10b981' : '#d1d5db',
                border: 'none',
                padding: '0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: isVisible ? 1 : 0
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      <style>
        {`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 480px) {
          .carousel-container {
            padding: 20px 10px 40px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default CharityFundraiserCarousel;