import React, { useState, useEffect, useRef } from 'react';

const CrowdfundingTips = () => {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Enhanced color scheme with stronger contrast for hover
  const primaryColor = '#2E6E65';
  const primaryHoverColor = '#1A5A51'; // Darker version for hover
  const accentColor = '#F0A030';
  const accentHoverColor = '#E18A20'; // Slightly darker accent for hover effects

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Auto-scroll cards on mobile
  useEffect(() => {
    let autoScrollInterval;
    
    if (windowWidth < 640 && isVisible) {
      autoScrollInterval = setInterval(() => {
        setActiveCardIndex((prev) => (prev + 1) % tipsData.length);
      }, 3000); // Change card every 3 seconds
    }
    
    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [windowWidth, isVisible]);

  // Improved intersection observer with lower threshold for earlier animation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05 // Lower threshold to trigger animation sooner
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  // Data with SVG icons instead of emojis
  const tipsData = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 11.9999H20M4 11.9999H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99995 20.1046 9.99995 19V18.469C9.99995 17.5739 9.6444 16.7155 9.01151 16.0827L8.46441 15.5356Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Top tips for your GoFundMe fundraiser",
      link: "#"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Tips for telling a great fundraiser story",
      link: "#"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 5.07089C16.3923 5.55612 19 8.47353 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.47353 7.60769 5.55612 11 5.07086M13 5.07089C12.6724 5.02417 12.3387 5 12 5C11.6613 5 11.3276 5.02417 11 5.07086M13 5.07089V3M11 5.07086V3M8 14C9.10457 14 10 13.1046 10 12C10 10.8954 9.10457 10 8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14ZM14.5 14C15.3284 14 16 13.3284 16 12.5C16 11.6716 15.3284 11 14.5 11C13.6716 11 13 11.6716 13 12.5C13 13.3284 13.6716 14 14.5 14Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Tips for sharing your fundraiser",
      link: "#"
    }
  ];

  // Improved entrance animation for the section
  const sectionStyle = {
    padding: windowWidth < 768 ? '40px 16px 60px' : '60px 24px',
    marginTop: windowWidth < 768 ? '-100px' : '-150px',
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
    transition: 'opacity 0.8s ease-in-out, transform 0.9s ease-out'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif'
  };

  // Mobile cards container with centered positioning
  const mobileCardsContainerStyle = {
    display: windowWidth < 640 ? 'flex' : 'none',
    justifyContent: 'center',
    position: 'relative',
    minHeight: '140px' // Ensure space for cards on mobile
  };

  // Desktop cards container
  const desktopCardsContainerStyle = {
    display: windowWidth < 640 ? 'none' : 'grid',
    gridTemplateColumns: windowWidth < 1024 
      ? 'repeat(2, 1fr)' 
      : 'repeat(3, 1fr)',
    gap: windowWidth < 768 ? '20px' : '30px',
  };

  // Enhanced background decoration with more dramatic animation
  const bgCircleStyle = {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: `radial-gradient(circle, rgba(46, 110, 101, 0.03) 0%, rgba(46, 110, 101, 0) 70%)`,
    bottom: '-150px',
    right: '-100px',
    zIndex: 1,
    transform: isVisible ? 'scale(1)' : 'scale(0.5)',
    opacity: isVisible ? 1 : 0,
    transition: 'transform 1.2s ease-out, opacity 1.2s ease-out',
    transitionDelay: '0.3s'
  };

  // Mobile indicators style
  const indicatorsStyle = {
    display: windowWidth < 640 ? 'flex' : 'none',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '25px'
  };

  // Individual indicator style
  const getIndicatorStyle = (index) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: activeCardIndex === index ? primaryColor : '#E0E0E0',
    transition: 'all 0.3s ease'
  });

  // Enhanced card styles with animation delays
  const getCardStyle = (index) => {
    const baseCardStyle = {
      background: 'white',
      borderRadius: '12px',
      padding: windowWidth < 768 ? '20px' : '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
      border: `1px solid #f0f0f0`,
      position: 'relative',
      overflow: 'hidden'
    };

    // For mobile view, narrower card with center alignment
    if (windowWidth < 640) {
      return {
        ...baseCardStyle,
        width: '85%', // Decreased width for mobile
        maxWidth: '300px', // Maximum width constraint
        position: 'absolute',
        top: '0',
        opacity: activeCardIndex === index ? 1 : 0,
        visibility: activeCardIndex === index ? 'visible' : 'hidden',
        transform: activeCardIndex === index 
          ? 'translateX(0)' 
          : (activeCardIndex > index ? 'translateX(-30px)' : 'translateX(30px)'),
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, visibility 0.6s ease-out',
      };
    }

    return {
      ...baseCardStyle,
      opacity: isVisible ? 1 : 0,
      transform: isVisible 
        ? hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)'
        : 'translateY(30px)',
      boxShadow: hoveredIndex === index 
        ? `0 15px 30px rgba(46, 110, 101, 0.18)`
        : '0 8px 20px rgba(0, 0, 0, 0.08)',
      borderColor: hoveredIndex === index ? primaryColor : '#f0f0f0',
      background: hoveredIndex === index ? 'linear-gradient(to bottom, white, #f9fafa)' : 'white',
      transition: 'opacity 0.6s ease-out, transform 0.4s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
      transitionDelay: `${0.2 + index * 0.15}s` // More pronounced staggered delay
    };
  };

  // Enhanced card hover background effect
  const cardBgDecoration = (index) => ({
    position: 'absolute',
    content: '""',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index)
      ? `radial-gradient(circle, rgba(240, 160, 48, 0.08) 0%, rgba(240, 160, 48, 0) 70%)`
      : `radial-gradient(circle, rgba(240, 160, 48, 0.04) 0%, rgba(240, 160, 48, 0) 70%)`,
    bottom: '-100px',
    right: '-100px',
    transition: 'all 0.5s ease',
    transform: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index) ? 'scale(1.3)' : 'scale(1)',
    opacity: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index) ? 0.15 : 0.05
  });

  // Enhanced icon styles with color change
  const iconContainerStyle = (index) => ({
    width: windowWidth < 768 ? '42px' : '52px',
    height: windowWidth < 768 ? '42px' : '52px',
    borderRadius: '10px',
    background: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index)
      ? `rgba(46, 110, 101, 0.15)`
      : 'rgba(46, 110, 101, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: windowWidth < 768 ? '12px' : '18px',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    color: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index) ? primaryHoverColor : primaryColor
  });

  // Content styles (adjusted for mobile)
  const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  };

  // Enhanced title styles with color change and smaller font on mobile
  const titleStyle = (index) => ({
    fontWeight: '500',
    fontSize: windowWidth < 768 ? '14px' : '16px', // Smaller font on mobile
    color: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index) ? primaryHoverColor : '#444',
    margin: 0,
    lineHeight: '1.4',
    transition: 'all 0.3s ease'
  });

  // Enhanced arrow styles with movement
  const arrowContainerStyle = (index) => ({
    width: windowWidth < 768 ? '28px' : '36px', // Smaller on mobile
    height: windowWidth < 768 ? '28px' : '36px', // Smaller on mobile
    borderRadius: '50%',
    backgroundColor: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index)
      ? `rgba(240, 160, 48, 0.15)`
      : 'rgba(46, 110, 101, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0
  });

  const arrowStyle = (index) => ({
    fontSize: windowWidth < 768 ? '16px' : '20px', // Smaller on mobile
    color: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index) ? accentHoverColor : primaryColor,
    transition: 'all 0.3s ease',
    transform: hoveredIndex === index || (windowWidth < 640 && activeCardIndex === index) ? 'translateX(4px)' : 'translateX(0)'
  });

  return (
    <section style={sectionStyle} ref={componentRef}>
      <div style={bgCircleStyle}></div>
      
      <div style={containerStyle}>
        {/* Mobile Cards (Narrower Width) */}
        <div style={mobileCardsContainerStyle}>
          {tipsData.map((tip, index) => (
            <div 
              key={index} 
              style={getCardStyle(index)}
              onClick={() => setActiveCardIndex(index)}
            >
              <div style={cardBgDecoration(index)}></div>
              
              <div style={contentStyle}>
                <div style={iconContainerStyle(index)}>
                  {tip.icon}
                </div>
                <p style={titleStyle(index)}>{tip.title}</p>
              </div>
              
              <div style={arrowContainerStyle(index)}>
                <span style={arrowStyle(index)}>→</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop Cards */}
        <div style={desktopCardsContainerStyle}>
          {tipsData.map((tip, index) => (
            <div 
              key={index} 
              style={getCardStyle(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={cardBgDecoration(index)}></div>
              
              <div style={contentStyle}>
                <div style={iconContainerStyle(index)}>
                  {tip.icon}
                </div>
                <p style={titleStyle(index)}>{tip.title}</p>
              </div>
              
              <div style={arrowContainerStyle(index)}>
                <span style={arrowStyle(index)}>→</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile indicators */}
        {/* <div style={indicatorsStyle}>
          {tipsData.map((_, index) => (
            <div 
              key={index} 
              style={getIndicatorStyle(index)}
              onClick={() => setActiveCardIndex(index)}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default CrowdfundingTips;