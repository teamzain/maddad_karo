import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

const CharityFundraiserCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const carouselRef = useRef(null);
  const timerRef = useRef(null);
  const maxRetries = 3;

  // Initialize component with retry mechanism for data fetching
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        await fetchDonationRequests();
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Retry logic
        if (connectionAttempts < maxRetries) {
          const retryDelay = Math.pow(2, connectionAttempts) * 1000; // Exponential backoff
          console.log(`Retrying in ${retryDelay}ms... (Attempt ${connectionAttempts + 1}/${maxRetries})`);
          
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
          }, retryDelay);
        } else {
          setError('Unable to load fundraisers after multiple attempts. Please refresh the page or try again later.');
          setLoading(false);
        }
      }
    };

    initializeComponent();
  }, [connectionAttempts]);

  const fetchDonationRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if supabase client is available
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      
      // Fetch donation requests with timeout
      const fetchRequestsPromise = supabase
        .from('donation_request')
        .select('*')
        .eq('verify', 'verified');
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database request timed out')), 10000)
      );
      
      const { data: requestsData, error: requestError } = await Promise.race([
        fetchRequestsPromise,
        timeoutPromise
      ]);
      
      if (requestError) throw requestError;
      
      if (!requestsData || requestsData.length === 0) {
        setFundraisers([]);
        setLoading(false);
        return;
      }
      
      // Fetch donations for each request with proper error handling
      const fundraisersWithDonations = await Promise.all(requestsData.map(async (request) => {
        try {
          const { data: donationsData, error: donationsError } = await supabase
            .from('donated')
            .select('donated_amount')
            .eq('request_id', request.id);
          
          if (donationsError) {
            console.error(`Error fetching donations for request ${request.id}:`, donationsError);
            // Return request with zero donations rather than failing completely
            return {
              id: request.id,
              title: request.title || 'Untitled Fundraiser',
              image: request.cover_urls || "/api/placeholder/400/300",
              description: request.description || 'No description available.',
              requested_amount: request.requested_amount || '0',
              donations: '0 donations',
              raised: 'Rs0.00 raised',
              progress: 0,
              raw_data: request
            };
          }
          
          // Calculate total donated amount with safer parsing
          const totalDonated = (donationsData || []).reduce(
            (sum, donation) => sum + (parseFloat(donation.donated_amount || 0) || 0),
            0
          );
          
          // Calculate progress percentage with safety checks
          const requestedAmount = parseFloat(request.requested_amount || 0) || 0;
          const progress = requestedAmount > 0 
            ? Math.min(100, Math.round((totalDonated / requestedAmount) * 100))
            : 0;
          
          // Format the number of donations
          const donationCount = donationsData ? donationsData.length : 0;
          const formattedDonations = donationCount >= 1000 
            ? `${(donationCount / 1000).toFixed(1)}K donations` 
            : `${donationCount} donations`;
          
          return {
            id: request.id,
            title: request.title || 'Untitled Fundraiser',
            image: request.cover_urls || "/api/placeholder/400/300",
            description: request.description || 'No description available.',
            requested_amount: request.requested_amount || '0',
            donations: formattedDonations,
            raised: `Rs${totalDonated.toFixed(2)} raised`,
            progress: progress,
            raw_data: request
          };
        } catch (err) {
          console.error(`Error processing request ${request.id}:`, err);
          // Return basic request data even if donation processing fails
          return {
            id: request.id,
            title: request.title || 'Untitled Fundraiser',
            image: request.cover_urls || "/api/placeholder/400/300",
            description: request.description || 'No description available.',
            requested_amount: request.requested_amount || '0',
            donations: '0 donations',
            raised: 'Rs0.00 raised',
            progress: 0,
            raw_data: request
          };
        }
      }));
      
      setFundraisers(fundraisersWithDonations);
      // Reset connection attempts on success
      setConnectionAttempts(0);
    } catch (error) {
      console.error('Error fetching donation requests:', error);
      setError('Failed to load fundraisers. ' + error.message);
      throw error; // Re-throw to trigger retry mechanism
    } finally {
      setLoading(false);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Observer for visibility detection
  useEffect(() => {
    if (typeof IntersectionObserver !== 'undefined' && carouselRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(carouselRef.current);

      return () => {
        if (carouselRef.current) {
          observer.unobserve(carouselRef.current);
        }
      };
    } else {
      // Fallback if IntersectionObserver is not available
      setIsVisible(true);
    }
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (isVisible && !isPaused && fundraisers.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % fundraisers.length);
      }, 5000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else if (isPaused && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isVisible, fundraisers.length, isPaused]);

  // Click outside handler to close expanded card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedCard !== null && carouselRef.current && !event.target.closest('.carousel-card')) {
        setExpandedCard(null);
        setIsPaused(false);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [expandedCard]);

  const isMobile = () => windowWidth < 768;

  const handlePrevSlide = () => {
    if (fundraisers.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + fundraisers.length) % fundraisers.length);
    }
  };

  const handleNextSlide = () => {
    if (fundraisers.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fundraisers.length);
    }
  };

  // Handle card click (using the approach from second code)
  const handleCardClick = (index) => {
    // Toggle the card expansion state
    if (expandedCard === index) {
      // If the card is already expanded, close it
      setExpandedCard(null);
      setIsPaused(false);
    } else {
      // If the card is not expanded, expand it
      setExpandedCard(index);
      setIsPaused(true);
    }
  };
  
  // Handle donation button click
  const handleDonateClick = (e, fundraiserId) => {
    e.stopPropagation(); // Prevent card click
    if (fundraiserId) {
      window.location.href = `/request-detail/${fundraiserId}`;
    }
  };

  const getCardStyle = (index) => {
    const isExpanded = expandedCard === index;
    const cardWidth = isMobile() ? '260px' : '350px';  // Slightly smaller on mobile
    const cardHeight = isExpanded ? 'auto' : isMobile() ? '360px' : '420px';
    
    const baseStyle = {
      width: cardWidth,
      height: cardHeight,
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: isExpanded 
        ? '0 20px 40px rgba(0,0,0,0.18)' 
        : '0 10px 25px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.04)',
      zIndex: isExpanded ? 10 : 1,
      cursor: 'pointer'
    };
  
    if (fundraisers.length === 0) return baseStyle;
  
    const centerIndex = currentIndex;
    const diff = index - centerIndex;
    const normalizedDiff = ((diff + fundraisers.length) % fundraisers.length) - 2;
  
    const getOffset = () => {
      if (isMobile()) return normalizedDiff * 180; // Reduced offset on mobile
      return normalizedDiff * 380;
    };
  
    if (isExpanded) {
      return {
        ...baseStyle,
        transform: `translate(-50%, -50%) scale(1.1)`,
        zIndex: 10
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
      const opacity = isVisible ? (1 - Math.abs(normalizedDiff) * 0.25) : 0;
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

  // Render loading state
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'inline-block',
          width: '48px',
          height: '48px',
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '50%',
          borderTop: '3px solid #10b981',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ 
          marginTop: '16px',
          fontSize: '16px',
          color: '#4b5563',
          fontWeight: '500'
        }}>
          Loading fundraisers...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        color: '#ef4444',
        backgroundColor: '#fff',
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 style={{ color: '#991b1b', fontSize: '20px', marginBottom: '12px' }}>Connection Error</h3>
        <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => {
            setConnectionAttempts(0);
            setError(null);
          }}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 24px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render empty state
  if (fundraisers.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 30px',
        backgroundColor: '#fff',
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          No Fundraisers Available
        </h3>
        <p style={{ 
          fontSize: '15px',
          color: '#6b7280',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          There are currently no active fundraisers to display. Please check back later or start your own fundraiser today.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef} 
      style={{
        backgroundColor: '#ffffff',
        padding: isMobile() ? '30px 16px 60px' : '96px 32px',
        marginBottom: isMobile() ? '50px ' : '0px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        height: isMobile() ? '520px' : '600px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: isMobile() ? '60px' : '70px',
        }}>
          <h2 style={{
            fontSize: isMobile() ? '26px' : '40px',
            fontWeight: '700',
            color: '#1A685B',
            marginBottom: '16px',
            fontFamily: '"Inter", sans-serif',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out'
          }}>
            FEATURED FUNDRAISERS
          </h2>
          <p style={{
            fontSize: isMobile() ? '15px' : '16px',
            color: '#6b7280',
            lineHeight: '1.6',
            padding: isMobile() ? '0 12px' : '0',
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
          marginTop: isMobile() ? '30px' : '0'
        }}>
          {fundraisers.map((fundraiser, index) => (
            <div 
              key={fundraiser.id || index} 
              className="carousel-card"
              style={getCardStyle(index)}
              onClick={() => handleCardClick(index)}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '170px'
              }}>
                <img 
                  src={fundraiser.image || "/api/placeholder/400/300"} 
                  alt={fundraiser.title} 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease-out',
                    transform: expandedCard === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/300";
                    e.target.alt = "Image not available";
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
                    transform: expandedCard === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onClick={(e) => handleDonateClick(e, fundraiser.id)}
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
                padding: isMobile() ? '22px 16px' : '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile() ? '16px' : '12px'
              }}>
                <h3 style={{ 
                  fontSize: isMobile() ? '15px' : '16px',
                  fontWeight: '600',
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '1.4',
                  height: expandedCard === index ? 'auto' : '46px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical'
                }}>
                  {fundraiser.title}
                </h3>
                
                {expandedCard === index && (
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    margin: '0',
                    marginBottom: '8px',
                    opacity: expandedCard === index ? 1 : 0,
                    maxHeight: expandedCard === index ? '200px' : '0',
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
                  margin: '4px 0 8px',
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
        
        {/* Navigation Arrows */}
        {/* <button
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            top: isMobile() ? '15px' : '30px',
            left: isMobile() ? '10px' : '30px',
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
            top: isMobile() ? '15px' : '30px',
            right: isMobile() ? '10px' : '30px',
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
         */}
        {/* Carousel Indicator Dots */}
        {/* <div style={{
          position: 'absolute',
          bottom: isMobile() ? '-40px' : '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}>
          {fundraisers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: currentIndex === index ? '12px' : '8px',
                height: currentIndex === index ? '12px' : '8px',
                borderRadius: '50%',
                backgroundColor: currentIndex === index ? '#10b981' : '#e5e7eb',
                boxShadow: currentIndex === index ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
                margin: '0 2px'
              }}
            />
          ))}
        </div> */}
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
          
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes pulse-dot {
            0% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.6; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default CharityFundraiserCarousel;