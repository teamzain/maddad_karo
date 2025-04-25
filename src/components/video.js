import React, { useRef, useEffect, useState } from 'react';

const VideoWithSideImages = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 });
  const youtubeVideoId = "4yXUX5DQkgA"; // YouTube video ID extracted from your URL

  // Intersection Observer to detect when element is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }); 

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Create ripple effect when play button is clicked
  const createRippleEffect = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate ripple position relative to the button
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setRippleEffect({ active: true, x, y });
    
    // Reset ripple after animation completes
    setTimeout(() => {
      setRippleEffect({ active: false, x: 0, y: 0 });
    }, 700);
  };

  // Handle play button click - open popup and play video
  const handlePlayButton = (event) => {
    createRippleEffect(event);
    
    // Delay popup opening to show ripple effect first
    setTimeout(() => {
      setShowPopup(true);
    }, 300);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Fixed container style to prevent horizontal scrolling - maintains row layout
  const containerStyle = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    height: '600px',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: 'opacity 1s ease-out, transform 0.8s ease-out',
  };

  // Enhanced side image styling with green background - maintained width proportion
  const sideImageStyle = {
    flex: '1',
    backgroundImage: 'url("/side.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    backgroundColor: '#2a6e6a',
    filter: 'contrast(1.1) saturate(1.2)',
    minWidth: '50px', // Ensure minimum width on small screens
  };

  // Custom border design with responsive width
  const borderOverlayStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '35px',
    backgroundImage: 'url("/side.png")',
    backgroundRepeat: 'repeat-y',
    boxShadow: 'inset 0px 0px 20px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#225652',
  };

  // Enhanced video container with gradient overlay - flex ratio maintained
  const videoContainerStyle = {
    flex: '2',
    maxWidth: '1200px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a6e6a',
    overflow: 'hidden',
    minWidth: '60%', // Ensure video remains prominent
  };

  // Video element with subtle zoom effect on hover
  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: isHovering ? 'scale(1.03)' : 'scale(1)',
    transition: 'transform 0.8s ease',
  };

  // Enhanced overlay with gradient and texture for depth
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(42, 110, 106, 0.8)), url("/poster.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(2px)',
    boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.4)',
    transition: 'background-color 0.3s ease',
  };

  // Responsive play button with ripple effect container
  const playButtonStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isHovering 
      ? '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(255, 255, 255, 0.15), 0 0 0 30px rgba(255, 255, 255, 0.08)' 
      : '0 4px 16px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    transform: isHovering ? 'scale(1.08)' : 'scale(1)',
    position: 'relative',
    overflow: 'hidden', // Important for containing the ripple
  };

  // Enhanced play triangle
  const triangleStyle = {
    width: '0',
    height: '0',
    borderTop: '20px solid transparent',
    borderBottom: '20px solid transparent',
    borderLeft: '35px solid #f90',
    marginLeft: '10px',
    filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))',
    position: 'relative',
    zIndex: 2,
  };

  // Ripple effect styling
  const rippleStyle = rippleEffect.active ? {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '300px',
    height: '300px',
    left: rippleEffect.x - 150,
    top: rippleEffect.y - 150,
    transform: 'scale(0)',
    animation: 'ripple 0.7s ease-out forwards',
    zIndex: 1,
  } : {};

  // Pulsating rings around play button
  const ringStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    animation: 'pulsate 2s infinite ease-out',
  };

  // Outer pulsating ring
  const outerRingStyle = {
    ...ringStyle,
    animationDelay: '0.5s',
  };

  // Video popup modal styles
  const popupContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: showPopup ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    opacity: showPopup ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  const popupVideoContainerStyle = {
    width: '85%',
    maxWidth: '1200px',
    maxHeight: '85vh',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    animation: showPopup ? 'popupIn 0.4s ease-out forwards' : 'none',
    aspectRatio: '16/9', // Maintain proper aspect ratio for YouTube videos
  };

  // YouTube iframe style for responsive sizing
  const youtubeIframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '-40px',
    right: '-20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid white',
    color: 'white',
    fontSize: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  // Updated media queries to maintain horizontal layout on all screen sizes
  const mediaStyles = `
    @keyframes popupIn {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      60% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    @keyframes pulsate {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    
    .play-button:hover {
      animation: pulse 2s infinite ease-in-out;
    }
    
    .close-button:hover {
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }
    
    @media (max-width: 1200px) {
      .video-container {
        height: 500px;
      }
    }
    
    @media (max-width: 992px) {
      .video-container {
        height: 450px;
      }
      .play-button {
        width: 80px;
        height: 80px;
      }
      .play-triangle {
        border-top: 18px solid transparent;
        border-bottom: 18px solid transparent;
        border-left: 30px solid #f90;
      }
      .border-overlay {
        width: 20px;
      }
    }
    
    @media (max-width: 768px) {
      .video-container {
        /* Keep flex-direction as row */
        flex-direction: row;
        height: 400px;
      }
      .side-image {
        /* Make side images smaller but still visible */
        flex: 0.5;
        min-width: 25px;
      }
      .video-section {
        /* Make video section more prominent */
        flex: 3;
      }
      .play-button {
        width: 70px;
        height: 70px;
      }
      .play-triangle {
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 25px solid #f90;
        margin-left: 8px;
      }
      .popup-video-container {
        width: 95%;
      }
      .border-overlay {
        width: 10px;
      }
    }
    
    @media (max-width: 480px) {
      .video-container {
        /* Still maintain row layout, just adjust proportions */
        height: 300px;
      }
      .side-image {
        /* Make them very slim but still visible */
        flex: 0.2;
        min-width: 15px;
      }
      .video-section {
        /* Video even more prominent */
        flex: 5;
      }
      .play-button {
        width: 60px;
        height: 60px;
      }
      .play-triangle {
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-left: 20px solid #f90;
        margin-left: 7px;
      }
      .close-button {
        top: -30px;
        right: 0;
        width: 30px;
        height: 30px;
        font-size: 16px;
      }
      .border-overlay {
        width: 8px;
      }
      .overlay {
        background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(42, 110, 106, 0.9)), url("/poster.jpg");
      }
    }
  `;

  return (
    <>
      <style>{mediaStyles}</style>
      <div 
        ref={sectionRef} 
        style={containerStyle} 
        className="video-container"
      >
        {/* Left side image */}
        <div style={sideImageStyle} className="side-image">
          <div style={{ ...borderOverlayStyle, right: 0 }} className="border-overlay"></div>
        </div>
        
        {/* Video section */}
        <div 
          style={videoContainerStyle} 
          className="video-section"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src="/video.png" 
            alt="Video thumbnail" 
            style={videoStyle} 
          />
          
          <div 
            style={overlayStyle} 
            onClick={handlePlayButton}
            className="overlay"
          >
            <div 
              style={playButtonStyle}
              className="play-button"
            >
              {/* Ripple effect element */}
              {rippleEffect.active && <div style={rippleStyle}></div>}
              
              {/* Animated rings */}
              <div style={ringStyle}></div>
              <div style={outerRingStyle}></div>
              
              {/* Play triangle */}
              <div 
                style={triangleStyle}
                className="play-triangle"
              ></div>
            </div>
          </div>
        </div>
        
        {/* Right side image */}
        <div style={sideImageStyle} className="side-image">
          <div style={{ ...borderOverlayStyle, left: 0 }} className="border-overlay"></div>
        </div>
      </div>
      
      {/* YouTube Video Popup Modal */}
      <div style={popupContainerStyle} className="popup-container" onClick={closePopup}>
        <div style={popupVideoContainerStyle} className="popup-video-container" onClick={(e) => e.stopPropagation()}>
          {/* YouTube iframe embed - This is what's needed to play YouTube videos */}
          {showPopup && (
            <iframe
              style={youtubeIframeStyle}
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )}
          
          <div 
            style={closeButtonStyle} 
            className="close-button"
            onClick={closePopup}
          >
            ✕
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoWithSideImages;