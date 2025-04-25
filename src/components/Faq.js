import { useState, useEffect } from 'react';

export default function CharityFAQLayout() {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check device size and handle animation on scroll
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      const element = document.getElementById('charity-faq-section');
      if (element) {
        const position = element.getBoundingClientRect();
        // If the element is in the viewport
        if (position.top < window.innerHeight * 0.85) {
          setIsVisible(true);
        }
        // Track scroll position for parallax effect
        setScrollPosition(window.scrollY * 0.05);
      }
    };

    // Initial checks
    checkMobile();
    handleScroll();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqItems = [
    {
      question: "What motivates you to donate to our charity?",
      answer: "Many donors are inspired by our direct impact on children's lives, our transparency in using funds, and the opportunity to create lasting change in communities that need it most."
    },
    {
      question: "How did you hear about our organization?",
      answer: "We connect with supporters through social media campaigns, community events, word-of-mouth from our volunteers, and partnerships with local businesses and organizations."
    },
    {
      question: "How frequently do you prefer to volunteer?",
      answer: "We offer flexible volunteering opportunities ranging from one-time events to weekly commitments, allowing you to contribute based on your availability and interests."
    },
    {
      question: "What motivated you to participate in this event?",
      answer: "Many participants join our events to connect with like-minded individuals, make a tangible difference, learn about global issues, and be part of solutions that help children worldwide."
    }
  ];

  return (
    <div 
      id="charity-faq-section"
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '5rem auto',
        padding: '0 1rem',
        transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: isVisible ? '1' : '0',
        fontFamily: '"Nunito Sans", sans-serif',
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
      }}
    >
      {/* Enhanced animations and media queries */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); }
          100% { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes growIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 1023px) {
          .faq-image-section {
            height: 400px !important;
          }
          
          .floating-image {
            bottom: -40px !important;
            right: 20px !important;
            width: 160px !important;
            height: 180px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .faq-container {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .faq-image-section {
            width: 40% !important;
            height: 500px !important;
          }
          .faq-content-section {
            width: 60% !important;
            padding-left: 40px !important;
          }
        }
      `}</style>

      <div className="faq-container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        animation: isVisible ? 'growIn 1s forwards' : 'none'
      }}>
        {/* Left Column - Images with enhanced animations */}
        <div className="faq-image-section" style={{
          width: '100%',
          position: 'relative',
          marginTop:'-100px',
          height: '400px', // Increased height
          borderRadius: '12px',
          overflow: 'visible',
          animation: isVisible ? 'fadeIn 0.8s ease-out forwards' : 'none'
        }}>
          {/* Main background image with subtle parallax */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
        
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <img
              src="/faq.webp"
              alt="Children smiling"
              style={{
                width: '100%',
                height: '60%',
                objectFit: 'cover',
                borderRadius: '12px',
                transform: `translateY(${scrollPosition}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
          </div>
          
          {/* Brush stroke overlay with enhanced animation */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '55%',
            height: '55%',
            backgroundImage: `url('/bg.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'left top',
            backgroundRepeat: 'no-repeat',
            opacity: isVisible ? '0.9' : '0',
            transform: isVisible ? 'rotate(25deg) translateX(0)' : 'rotate(15deg) translateX(-50px)',
            transformOrigin: 'top left',
            transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
            zIndex: '5'
          }}></div>
          
          {/* Enhanced floating B&W image */}
          <div className="floating-image" style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-30px',
            width: '180px',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            animation: isVisible ? 'float 8s ease-in-out infinite, pulse 5s infinite' : 'none',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
            zIndex: '50',
            transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isVisible ? 'translateY(0) rotate(0)' : 'translateY(60px) rotate(-8deg)',
            opacity: isVisible ? 1 : 0,
          }}>
            <img 
              src="/faq2.webp" 
              alt="Children portrait" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(90%)',
                transition: 'transform 0.8s ease, filter 1.2s ease',
                transform: isVisible ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          </div>
        </div>

        {/* Right Column - FAQ Section with staggered animations */}
        <div className="faq-content-section" style={{
          width: '100%',
          backgroundColor: 'white',
          position: 'relative',
          paddingBottom: '50px',
        }}>
          <div style={{
            color: '#FF9900',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px',
            transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s'
          }}>
            Frequently Asked Questions
          </div>
          
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '32px',
            borderBottom: '1px solid #eee',
            paddingBottom: '16px',
            transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s'
          }}>
            Have Any Questions For Us?
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}>
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                style={{
                  borderBottom: '1px solid #eee',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible ? 1 : 0,
                  transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${0.6 + index * 0.15}s` // Enhanced staggered animation
                }}
              >
                <div 
                  onClick={() => toggleQuestion(index)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '20px 0',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ 
                    fontWeight: openQuestion === index ? '600' : '500',
                    color: openQuestion === index ? '#FF9900' : '#000',
                    transition: 'all 0.3s ease',
                    fontSize: '16px'
                  }}>
                    {item.question}
                  </span>
                  
                  {/* Animated chevron with improved animation */}
                  <span style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    position: 'relative',
                    marginLeft: '8px',
                    backgroundColor: openQuestion === index ? 'rgba(255, 153, 0, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s ease'
                  }}>
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        transform: openQuestion === index ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    >
                      <path 
                        d="M6 9L12 15L18 9" 
                        stroke={openQuestion === index ? '#FF9900' : '#000000'} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{transition: 'stroke 0.3s ease'}}
                      />
                    </svg>
                  </span>
                </div>
                
                {/* Accordion content with smoother animation */}
                <div style={{
                  maxHeight: openQuestion === index ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1), padding 0.4s ease',
                  padding: openQuestion === index ? '0 0 20px 0' : '0',
                  opacity: openQuestion === index ? 1 : 0,
                  transform: openQuestion === index ? 'translateY(0)' : 'translateY(-10px)',
                  transitionProperty: 'max-height, padding, opacity, transform',
                  transitionDuration: '0.5s, 0.4s, 0.3s, 0.3s',
                  transitionDelay: openQuestion === index ? '0s, 0s, 0s, 0s' : '0s, 0s, 0s, 0s',
                  color: '#666',
                  lineHeight: '1.7',
                  fontSize: '15px'
                }}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}