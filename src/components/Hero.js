import { useState, useEffect, useRef, memo } from 'react';

// Simplified, highly-optimized Bubble component
const Bubble = memo(({ 
  category, 
  position, 
  size, 
  animationIndex, // New prop for controlling animation sequence
  isActive, 
  hoveredId, 
  setHoveredId, 
  isMobile 
}) => {
  const isHovered = hoveredId === category.id;
  
  // Base bubble style
  const bubbleStyle = {
    position: 'absolute',
    width: size,
    height: size,
    top: position.top,
    left: position.left,
    transform: 'translate(-50%, -50%) scale(0.8)', // Start smaller
    cursor: 'pointer',
    zIndex: isHovered ? 10 : 1,
    opacity: 0, // Start invisible
    pointerEvents: isActive ? 'auto' : 'none', // Prevent interaction until active
  };
  
  // Simple container style
  const containerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'white',
    boxShadow: isHovered 
      ? `0 20px 30px rgba(0, 0, 0, 0.12), 0 0 0 4px ${category.color}30` 
      : '0 10px 25px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  };
  
  // Image container
  const imageContainerStyle = {
    position: 'absolute',
    inset: '3px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `2px solid ${isHovered ? category.color : 'transparent'}`,
    transition: 'border-color 0.3s ease',
  };
  
  // Image style
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
  };
  
  // Label style
  const labelStyle = {
    position: 'absolute',
    bottom: isHovered ? (isMobile ? '-15px' : '-20px') : (isMobile ? '-8px' : '-10px'),
    left: isMobile ? '40%' : '45%',
    transform: `translateX(-50%) scale(${isHovered ? 1 : 0.95})`,
    background: isHovered ? category.color : 'white',
    color: isHovered ? 'white' : '#1e293b',
    padding: isHovered ? (isMobile ? '6px 15px' : '8px 20px') : (isMobile ? '4px 10px' : '6px 14px'),
    borderRadius: '30px',
    fontSize: isMobile ? 'clamp(0.65rem, 3vw, 0.8rem)' : 'clamp(0.75rem, 1.2vw, 0.9rem)',
    fontWeight: '600',
    letterSpacing: '0.5px',
    boxShadow: isHovered 
      ? `0 10px 15px ${category.color}30` 
      : '0 5px 15px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    opacity: 0, // Start invisible
    zIndex: 5,
  };
  
  // Simplified particle rendering function
  const renderParticles = () => {
    if (!isHovered) return null;
    
    const particleCount = isMobile ? 2 : 3;
    
    return [...Array(particleCount)].map((_, i) => {
      const particleSize = (3 + Math.random() * 2) * (isMobile ? 0.7 : 1);
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = (30 + Math.random() * 10) * (isMobile ? 0.7 : 1);
      
      return (
        <div 
          key={i}
          style={{
            position: 'absolute',
            width: `${particleSize}px`,
            height: `${particleSize}px`,
            borderRadius: '50%',
            backgroundColor: category.color,
            opacity: 0,
            top: '50%',
            left: '50%',
            animation: `particle${i} 2s ease-in-out infinite ${i * 0.2}s`
          }}
        />
      );
    });
  };
  
  return (
    <div 
      className={`bubble-${category.id}`}
      style={bubbleStyle}
      onMouseEnter={() => setHoveredId(category.id)}
      onMouseLeave={() => setHoveredId(null)}
      onTouchStart={() => setHoveredId(category.id)}
      onTouchEnd={() => setTimeout(() => setHoveredId(null), 1500)}
    >
      {/* CSS Animations defined specifically for this bubble */}
      <style>
        {`
          @keyframes fadeInBubble${category.id} {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          
          @keyframes floatBubble${category.id} {
            0%, 100% { transform: translate(-50%, -50%); }
            50% { transform: translate(-50%, calc(-50% - ${3 + (category.id % 5)}px)); }
          }
          
          @keyframes fadeInLabel${category.id} {
            0% { opacity: 0; transform: translateX(-50%) scale(0.9); }
            100% { opacity: 1; transform: translateX(-50%) scale(1); }
          }
          
          .bubble-${category.id} {
            animation: fadeInBubble${category.id} 0.6s ease-out forwards ${animationIndex * 0.2}s,
                       floatBubble${category.id} ${3 + (category.id % 3)}s ease-in-out infinite ${1 + animationIndex * 0.2}s;
          }
          
          .label-${category.id} {
            animation: fadeInLabel${category.id} 0.5s ease-out forwards ${0.2 + animationIndex * 0.2}s;
          }
          
          @keyframes particle0 {
            0% { opacity: 0; transform: translate(-50%, -50%); }
            20%, 80% { opacity: 0.6; }
            100% { opacity: 0; transform: translate(calc(-50% + 25px), calc(-50% - 15px)); }
          }
          @keyframes particle1 {
            0% { opacity: 0; transform: translate(-50%, -50%); }
            20%, 80% { opacity: 0.6; }
            100% { opacity: 0; transform: translate(calc(-50% - 25px), calc(-50% - 15px)); }
          }
          @keyframes particle2 {
            0% { opacity: 0; transform: translate(-50%, -50%); }
            20%, 80% { opacity: 0.6; }
            100% { opacity: 0; transform: translate(calc(-50%), calc(-50% + 30px)); }
          }
        `}
      </style>
      
      {/* Main bubble */}
      <div style={containerStyle}>
        {/* Border glow - only when hovered */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${category.color}, ${category.color}70)`,
            opacity: 1,
            zIndex: -1
          }}></div>
        )}
        
        {/* Image container with inner border */}
        <div style={imageContainerStyle}>
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            style={imageStyle}
          />
          
          {/* Overlay gradient - only when hovered */}
          {isHovered && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${category.color}20, transparent)`,
            }}></div>
          )}
        </div>
      </div>
      
      {/* Category label */}
      <div 
        className={`label-${category.id}`}
        style={labelStyle}
      >
        {category.name}
      </div>
      
      {/* Particles - only when hovered */}
      {renderParticles()}
    </div>
  );
});

// Main component
export default function ScatteredBubbleShowcase() {
  const categories = [
    { id: 1, name: "Medical", image: "/med.jpeg", color: "#16a34a" },
    { id: 2, name: "Family", image: "/family.jpeg", color: "#0ea5e9" },
    { id: 3, name: "Education", image: "/student.jpeg", color: "#8b5cf6" },
    { id: 4, name: "Emergency", image: "/med.jpeg", color: "#ef4444" },
    { id: 5, name: "Business", image: "/bus.jpeg", color: "#f59e0b" },
    { id: 6, name: "Animal", image: "/ani.jpeg", color: "#10b981" },
  ];

  const [hoveredId, setHoveredId] = useState(null);
  const [visibleBubbles, setVisibleBubbles] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Check if we're on mobile based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Optimized resize handler with debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);
  
  const getPosition = (id) => {
    if (isMobile) {
      // Mobile positions - bubbles scattered above and below text
      const mobilePositions = {
        1: { top: '3%', left: '10%' },      // Top left
        5: { top: '2%', left: '85%' },     // Top right
        4: { top: '6%', left: '45%' },      // Middle right
        3: { top: '60%', left: '84%' },     // Bottom right
        2: { top: '73%', left: '45%' },     // Bottom left
        6: { top: '55%', left: '15%' }       // Middle left
      };
      return mobilePositions[id];
    } else {
      // Desktop positions remain unchanged
      const positions = {
        1: { top: '-45%', left: '3%' },    // Left top
        2: { top: '10%', left: '12%' },      // Left bottom
        3: { top: '18%', left: '40%' },     // Center
        4: { top: '10%', left: '65%' },    // Center bottom
        5: { top: '-55%', left: '98%' },    // Right top
        6: { top: '15%', left: '90%' }       // Right bottom
      };
      return positions[id];
    }
  };


  // Calculate bubble size
  const getBubbleSize = (id) => {
    if (!isMobile) {
      // Desktop sizes
      const sizeVariation = {
        1: 'clamp(100px, 14vw, 160px)',
        2: 'clamp(90px, 13vw, 150px)',
        3: 'clamp(110px, 15vw, 170px)',
        4: 'clamp(95px, 13.5vw, 155px)',
        5: 'clamp(105px, 14.5vw, 165px)',
        6: 'clamp(100px, 14vw, 160px)'
      };
      return sizeVariation[id];
    } else {
      // Mobile sizes
      const mobileSizeVariation = {
        1: 'clamp(80px, 18vw, 110px)',
        2: 'clamp(75px, 17vw, 100px)',
        3: 'clamp(85px, 19vw, 115px)',
        4: 'clamp(75px, 17vw, 105px)',
        5: 'clamp(80px, 18vw, 110px)',
        6: 'clamp(75px, 17vw, 105px)'
      };
      return mobileSizeVariation[id];
    }
  };

  // Sequential bubble appearance - one by one
  useEffect(() => {
    // Specific order of appearance
    const appearanceOrder = [1, 5, 3, 4, 2, 6]; // Customize this order as needed
    
    // Add bubbles one by one with a clean interval
    appearanceOrder.forEach((id, index) => {
      setTimeout(() => {
        setVisibleBubbles(prev => [...prev, id]);
      }, 250 * (index + 1)); // 250ms between each bubble
    });
  }, []);

  // Shared button component
  const ActionButton = () => {
    return (
      <button
        className="action-button"
        onClick={() => {
          window.location.href = '/login';
        }}
        style={{
          backgroundColor: '#FFAC00',
          color: 'black',
          padding: '12px 24px',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.5px',
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          boxShadow: '0 10px 25px rgba(255, 172, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '200px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease'
        }}
      >
        <span
          style={{
            position: 'relative',
            zIndex: '2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: 'black',
            transition: 'color 0.3s ease'
          }}
        >
          Start a Fundraiser
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>

        <div
          className="button-shine"
          style={{
            position: 'absolute',
            top: '-100%',
            left: '-100%',
            right: '-100%',
            bottom: '-100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
            transform: 'rotate(45deg) translate(-50%, -50%)',
            zIndex: '1'
          }}
        />
      </button>
    );
  };

  // Global CSS animations
  const globalStyles = `
    @keyframes fadeUpText {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shine {
      0% { transform: rotate(45deg) translate(-100%, -100%); }
      100% { transform: rotate(45deg) translate(100%, 100%); }
    }
    
    .title {
      opacity: 0;
      animation: fadeUpText 0.7s ease-out forwards;
    }
    
    .subtitle {
      opacity: 0;
      animation: fadeUpText 0.7s ease-out 0.1s forwards;
    }
    
    .heading {
      opacity: 0;
      animation: fadeUpText 0.7s ease-out 0.2s forwards;
    }
    
    .button-container {
      opacity: 0;
      animation: fadeUpText 0.7s ease-out 0.3s forwards;
    }
    
    .action-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(255, 172, 0, 0.4);
      background-color: #1A685B;
    }
    
    .action-button:hover span {
      color: white;
    }
    
    .action-button:hover svg {
      stroke: white;
    }
    
    .button-shine {
      animation: shine 3s ease-in-out infinite;
    }
  `;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: '40px 20px',
      minHeight: '100vh',
      fontFamily: '"Nunito Sans", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{globalStyles}</style>
      
      {/* Very simple background with just a hint of gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(240, 249, 255, 0.8) 0%, rgba(255, 255, 255, 1) 80%)',
      }} />

      {/* Main content */}
      {isMobile ? (
        // Mobile layout
        <div style={{ width: '100%', position: 'relative', height: '80vh' }}>
          {/* Bubbles container */}
          <div 
            ref={containerRef}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 1
            }}
          >
            {/* Render bubbles in sequence */}
            {categories.map((category, index) => (
              visibleBubbles.includes(category.id) && (
                <Bubble
                  key={category.id}
                  category={category}
                  position={getPosition(category.id)}
                  size={getBubbleSize(category.id)}
                  animationIndex={visibleBubbles.indexOf(category.id)} // Pass index in the sequence
                  isActive={true}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  isMobile={isMobile}
                />
              )
            ))}
          </div>
          
          {/* Text content */}
          <div style={{
            position: 'absolute',
            top: '42%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 2,
            width: '100%'
          }}>
            <div className="title" style={{
              fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
              color: '#1A685B',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: '600',
              marginTop:'-100px',
              marginBottom: '15px'
            }}>
              #1 crowdfunding platform
            </div>

            <h1 className="subtitle" style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              color: '#0f172a',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '10px'
            }}>
              Successful fundraisers
            </h1>
            
            <h2 className="heading" style={{
              fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
              color: '#334155',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              start here
            </h2>
            
            {/* Button */}
            <div className="button-container" style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
              zIndex: 5
            }}>
              <ActionButton />
            </div>
          </div>
        </div>
      ) : (
        // Desktop layout
        <>
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            marginBottom: '20px'
          }}>
            <div className="title" style={{
              fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
              color: '#1A685B',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              #1 crowdfunding platform
            </div>

            <h1 className="subtitle" style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              color: '#0f172a',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '10px'
            }}>
              Successful fundraisers
            </h1>
            
            <h2 className="heading" style={{
              fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
              color: '#334155',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              start here
            </h2>
            
            {/* Button moved directly under the text */}
            <div className="button-container" style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '40px',
              zIndex: 5
            }}>
              <ActionButton />
            </div>
          </div>

          <div 
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              height: 'clamp(350px, 55vh, 650px)',
              zIndex: 1
            }}
          >
            {/* Render bubbles in sequence */}
            {categories.map((category, index) => (
              visibleBubbles.includes(category.id) && (
                <Bubble
                  key={category.id}
                  category={category}
                  position={getPosition(category.id)}
                  size={getBubbleSize(category.id)}
                  animationIndex={visibleBubbles.indexOf(category.id)} // Pass index in the sequence
                  isActive={true}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  isMobile={isMobile}
                />
              )
            ))}
          </div>
        </>
      )}
    </div>
  );
}