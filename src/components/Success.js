import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const SuccessStory = () => {
  const componentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/about');
  };
  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };


    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the component is visible
        rootMargin: '0px 0px -100px 0px' // Trigger earlier for smoother animation
      }
    );

    // Observe the component
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    // Set up window resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine if mobile, tablet, or desktop
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      padding: isMobile ? '30px 20px' : isTablet ? '40px 30px' : '60px 40px',
      maxWidth: '1600px',
      margin: '0 auto',
      fontFamily: '"Nunito Sans", sans-serif',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
      gap: isMobile ? '30px' : isTablet ? '40px' : '60px',
      position: 'relative',
      overflow: 'hidden',
    },
    leftSection: {
      flex: '1',
      width: isMobile ? '100%' : '50%',
      padding: isMobile ? '0' : '20px 0',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
      transition: 'opacity 0.9s ease-out 0.2s, transform 0.9s ease-out 0.2s',
      zIndex: 3,
      position: 'relative',
    },
    rightSection: {
      flex: '1',
      width: isMobile ? '100%' : '150%',
      position: 'relative',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
      transition: 'opacity 0.9s ease-out 0.4s, transform 0.9s ease-out 0.4s',
      zIndex: 2,
    },
    successLabel: {

      fontWeight: '600',
      fontSize: isMobile ? '15px' : '16px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      letterSpacing: '1px',
    },
    line: {
      width: isVisible ? (isMobile ? '40px' : '60px') : '0px',
      height: '2px',
      backgroundColor: '#F2A900',
      marginLeft: '15px',
      transition: 'width 1.2s ease-out 0.7s',
    },
    heading: {
      fontSize: isMobile ? '28px' : isTablet ? '34px' : '42px',
      fontWeight: '700', 
      color: '#222',
      margin: '0 0 25px 0',
      lineHeight: '1.2',
      maxWidth: '600px',
    },
    description: {
      color: '#555',
      lineHeight: '1.7',
      marginBottom: '30px',
      fontSize: isMobile ? '15px' : '16px',
      maxWidth: '550px',
    },
    storyButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 30px',
      borderRadius: '30px',
      backgroundColor: 'white',
      color: '#222',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      border: '1px solid #222',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      minWidth: '180px',
    },
    buttonHover: {
      transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isHovering ? '0 6px 12px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.05)',
      backgroundColor: isHovering ? '#F2A900' : 'white',
      color: isHovering ? 'white' : '#222',
      borderColor: isHovering ? '#F2A900' : '#222',
    },
    buttonArrow: {
      marginLeft: '8px',
      fontSize: '16px',
      display: 'inline-block',
      transform: isHovering ? 'translateX(3px)' : 'translateX(0)',
      transition: 'transform 0.3s ease',
    },
    communitiesBlock: {
      position: 'relative',
      zIndex: 5,
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      padding: isMobile ? '18px 20px' : '22px 25px',
      display: 'inline-flex',
      flexDirection: 'column',
      marginTop: isMobile ? '0' : '30px',
      marginLeft: isMobile ? '0' : '-80px',
      border: '1px solid rgba(0,0,0,0.05)',
      transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.9s ease-out 0.6s, transform 0.9s ease-out 0.6s',
    },
    communitiesWrapper: {
      position: isMobile ? 'relative' : 'absolute',
      top: isMobile ? 'auto' : '30px',
      left: isMobile ? 'auto' : '-140px',
      zIndex: 5,
      width: isMobile ? '100%' : 'auto',
      display: 'flex',
      justifyContent: isMobile ? 'flex-start' : 'flex-start',
      marginBottom: isMobile ? '20px' : '0',
    },
    communitiesLabel: {
      color: '#F2A900',
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    communitiesSubLabel: {
      color: '#777',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginTop: '3px',
    },
    communitiesNumber: {
      fontSize: isMobile ? '48px' : '55px',
      fontWeight: 'bold',
      color: '#333',
      lineHeight: '1',
      margin: '5px 0',
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    
      transition: 'transform 0.9s ease-out 0.8s, opacity 0.9s ease-out 0.8s',
    },
    imageWrapper: {
      position: 'relative',
      marginTop: isMobile ? '0' : isTablet ? '60px' : '80px',
      marginBottom: isMobile ? '80px' : '100px',
    },
    imageBackground: {
      position: 'absolute',
      width: isMobile ? '120%' : '150%',
      height: '180%',
      marginTop: isMobile ? '0' : isTablet ? '0px' : '-100px',
      zIndex: 1,
      backgroundImage: `url('/back.png')`,
     
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      height: isMobile ? '260px' : isTablet ? '320px' : '360px',
      width: isMobile ? '100%' : '83%',
      zIndex: '2',
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'transform 1s ease-out 0.5s',
      boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
   
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: isVisible ? 'scale(1)' : 'scale(1.1)',
      transition: 'transform 1.5s ease-out 0.5s',
    },
    quoteBox: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
      position: 'absolute',
      zIndex: '4',
      left: isMobile ? '10px' : '-80px',
      bottom: isMobile ? '-60px' : '-80px',
      padding: isMobile ? '20px' : '25px 30px',
      maxWidth: isMobile ? '90%' : '350px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.9s ease-out 1s, transform 0.9s ease-out 1s',
    },
    personName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#222',
    },
    quoteIcon: {
      color: '#F2A900',
      fontSize: '28px',
      fontWeight: 'bold',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.9s ease-out 1.2s, transform 0.9s ease-out 1.2s',
    },
    quote: {
      color: '#666',
      lineHeight: '1.7',
      fontSize: '15px',
      margin: 0,
    },
    accent: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      backgroundColor: 'rgba(242, 169, 0, 0.08)',
      top: isMobile ? '-50px' : '-100px',
      right: isMobile ? '-100px' : '-150px',
      zIndex: 1,
    },
    accent2: {
      position: 'absolute',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      backgroundColor: 'rgba(242, 169, 0, 0.05)',
      bottom: isMobile ? '-70px' : '-50px',
      left: isMobile ? '-70px' : '-100px',
      zIndex: 1,
    }
  };

  const buttonStyles = {
    ...styles.storyButton,
    ...styles.buttonHover
  };

  return (
    <div ref={componentRef} style={styles.container}>
      <div style={styles.accent}></div>
      <div style={styles.accent2}></div>
      
      <div style={styles.leftSection}>
        {isMobile && (
          <div style={styles.communitiesWrapper}>
            {/* <div style={styles.communitiesBlock}>
              <div style={styles.communitiesLabel}>COMMUNITIES</div>
              <div style={styles.communitiesSubLabel}>SUPPORTED</div>
              <div style={styles.communitiesNumber}>120+</div>
            </div> */}
          </div>
        )}

        <div style={styles.successLabel}>
          SUCCESS STORY <div style={styles.line}></div>
        </div>
        <h2 style={styles.heading}>
          We Help Fellow Nonprofits Access The Funding Tools, Training & Support
        </h2>
        <p style={styles.description}>
          Our secure online donation platform allows you to make contributions quickly and safely. 
          Choose from various payment methods and set up one-time or recurring donations to support 
          causes you care about most.
        </p>
        <div 
          style={buttonStyles}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleButtonClick} 
        >
          Our Success Story <span style={styles.buttonArrow}>→</span>
        </div>
      </div>
      
      <div style={styles.rightSection}>
        {!isMobile && (
          <div style={styles.communitiesWrapper}>
            {/* <div style={styles.communitiesBlock}>
              <div style={styles.communitiesLabel}>COMMUNITIES</div>
              <div style={styles.communitiesSubLabel}>SUPPORTED</div>
              <div style={styles.communitiesNumber}>120+</div>
            </div> */}
          </div>
        )}
        
        <div style={styles.imageWrapper}>
          <div style={styles.imageBackground}>
          </div>
          <div style={styles.imageContainer}>
            <img 
              src="/story.webp" 
              alt="African children in a classroom" 
              style={styles.image}
            />
          </div>
          
          <div style={styles.quoteBox}>
            <div style={styles.personName}>
              Adam Cruz <span style={styles.quoteIcon}>❞</span>
            </div>
            <p style={styles.quote}>
              Our success stories highlight the real life impact of your donations & the resilience of those we help. 
              These narratives showcase the power of compassion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStory;