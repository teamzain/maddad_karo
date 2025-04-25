import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const ServiceCard = ({ service, index, isVisible }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  
  // Your existing code...
  
  // Add this function
  const handleButtonClick = () => {
    navigate('/about');
  };
  return (
    <div 
      className="service-card"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{
        width: '100%',
        maxWidth: '350px',
        height: '280px',
        perspective: '1000px',
        margin: '20px 10px',
        opacity: isVisible ? '1' : '0',
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease-out ${index * 0.2}s, transform 0.7s ease-out ${index * 0.2}s`
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '30px 25px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)',
            background: '#ffffff',
            border: '1px solid rgba(240, 240, 240, 0.8)'
          }}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'rgba(26, 104, 91, 0.08)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
              marginTop: '5px',
              // border: '1px dashed rgba(26, 104, 91, 0.3)'
            }}>
              <img 
                src={service.image} 
                alt={service.title} 
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  borderRadius: '5px'
                }}
              />
            </div>
            <h3 style={{
              fontSize: 'clamp(18px, 4vw, 20px)',
              color: '#1A685B',
              fontFamily: '"Inter", sans-serif',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '12px',
              transition: 'color 0.3s ease'
            }}>{service.title}</h3>
            <div style={{
              width: '40px',
              height: '3px',
              backgroundColor: '#FFAC00',
              margin: '0 auto 12px'
            }}></div>
            <p style={{
              color: '#718096',
              fontFamily: '"Inter", sans-serif',
              fontSize: 'clamp(14px, 3vw, 15px)',
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}>Hover to see how you can help</p>
          </div>
        </div>
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '30px 25px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#1A685B',
            color: 'white',
            transform: 'rotateY(180deg)'
          }}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
              justifyContent: 'space-between',
              padding: '15px 0'
            }}
          >
            <h3 style={{
              fontSize: 'clamp(18px, 4vw, 20px)',
              color: 'white',
              fontFamily: '"Nunito Sans", sans-serif',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '15px'
            }}>{service.title}</h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontFamily: '"Nunito Sans", sans-serif',
              fontSize: 'clamp(14px, 3vw, 15px)',
              fontWeight: '400',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>{service.description}</p>
            <a 
              href={service.link} 
              style={{
                backgroundColor: '#FFAC00',
                color: 'white',
                fontWeight: '600',
                fontFamily: '"Nunito Sans", sans-serif',
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '30px',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 'clamp(12px, 3vw, 14px)',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 172, 0, 0.9)';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 7px 14px rgba(0, 0, 0, 0.15)';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#FFAC00';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.target.style.color = 'white';
              }}
            >
              {service.buttonText}
              <span style={{ marginLeft: '8px', transition: 'transform 0.3s ease', color:'white', }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const services = [
    {
      id: 1,
      title: 'Become a Volunteer',
      description:
        'Join our compassionate community of volunteers and help us create positive change. Every hour you give makes a real difference in someone\'s life.',
      image: '/3.png',
      link: '/contact-us',
      buttonText: 'Join Our Team',
    },
    {
      id: 2,
      title: 'Support Our Mission',
      description:
        'Your time and skills can transform lives. Our volunteer programs are flexible to accommodate your schedule while creating meaningful impact where it\'s needed most.',
      image: '/2.png',
      link: '/about',
      buttonText: 'Learn How',
    },
    {
      id: 3,
      title: 'Make an Impact',
      description:
        'From community outreach to administrative support, your unique talents can help us reach more people in need. Training and support provided for all volunteers.',
      image: '/1.png',
      link: '/gallery',
      buttonText: 'See Success Stories',
    },
  ];

  // Check window width for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Auto-rotate cards on mobile
  useEffect(() => {
    let interval;
    
    if (windowWidth < 768) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 4000);
    }
    
    return () => clearInterval(interval);
  }, [windowWidth, services.length]);

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('volunteer-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75 && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAnimated]);

  // Manual navigation function for mobile
  const navigateToCard = (index) => {
    setActiveIndex(index);
  };

  return (
    <div 
      id="volunteer-section"
      style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)',
        background: '#ffffff',
        textAlign: 'center',
        position: 'relative',
          fontFamily: '"Nunito Sans", sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* Top-right corner image */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: 'clamp(120px, 20vw, 250px)',
        height: 'clamp(120px, 20vw, 250px)',
        backgroundImage: 'url("/corner-decoration.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#1A685B',
          color: 'white',
          display: 'inline-block',
          padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 18px)',
          borderRadius: '30px',
          marginBottom: '20px',
          fontFamily: '"Nunito Sans", sans-serif',
          fontSize: 'clamp(12px, 3vw, 14px)',
          fontWeight: '600',
          letterSpacing: '1px',
          boxShadow: '0 4px 12px rgba(26, 104, 91, 0.25)',
          opacity: isVisible ? '1' : '0',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease-out, transform 0.7s ease-out'
        }}>
          VOLUNTEERS NEEDED
        </div>
        
        <h2 style={{
          color: '#1A685B',
          fontFamily: '"Nunito Sans", sans-serif',
          fontSize: 'clamp(28px, 6vw, 48px)',
          lineHeight: '1.2',
          fontWeight: '700',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          width: '100%',
          opacity: isVisible ? '1' : '0',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s'
        }}>JOIN OUR COMMUNITY OF CHANGE-MAKERS</h2>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          opacity: isVisible ? '1' : '0',
          transition: 'opacity 0.7s ease-out 0.2s'
        }}>
          <div style={{
            width: 'clamp(30px, 6vw, 40px)',
            height: '1px',
            backgroundColor: '#cbd5e0'
          }}></div>
          <div style={{
            width: 'clamp(8px, 1.5vw, 10px)',
            height: 'clamp(8px, 1.5vw, 10px)',
            backgroundColor: '#FFAC00',
            borderRadius: '50%',
            margin: '0 10px'
          }}></div>
          <div style={{
            width: 'clamp(30px, 6vw, 40px)',
            height: '1px',
            backgroundColor: '#cbd5e0'
          }}></div>
        </div>
        
        <p style={{
          color: '#4a5568',
          fontFamily: '"Nunito Sans", sans-serif',
          fontSize: 'clamp(16px, 3.5vw, 18px)',
          lineHeight: '1.8',
          fontWeight: '400',
          maxWidth: '800px',
          margin: '0 auto clamp(30px, 6vw, 50px)',
          opacity: isVisible ? '1' : '0',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease-out 0.3s, transform 0.7s ease-out 0.3s'
        }}>
          At our charity, we believe in the power of volunteers to create lasting positive change. 
          Whether you have specialized skills or simply the desire to help, your contribution can 
          make a meaningful difference in the lives of those we serve.
        </p>
        
        {/* Mobile view - one card at a time with navigation dots */}
        {windowWidth < 768 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: isVisible ? '1' : '0',
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease-out 0.4s, transform 0.7s ease-out 0.4s'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              width: '100%',
              maxWidth: '350px',
              position: 'relative',
              height: '320px'
            }}>
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    opacity: index === activeIndex ? 1 : 0,
                    transform: `translateX(${(index - activeIndex) * 20}px)`,
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    zIndex: index === activeIndex ? 2 : 1,
                    pointerEvents: index === activeIndex ? 'auto' : 'none'
                  }}
                >
                  <ServiceCard 
                    service={service} 
                    index={0} 
                    isVisible={true}
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation dots */}
            {/* <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToCard(index)}
                  aria-label={`Navigate to card ${index + 1}`}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: index === activeIndex ? '#1A685B' : '#d1d5db',
                    border: 'none',
                    margin: '0 6px',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    outline: 'none'
                  }}
                />
              ))}
            </div> */}
          </div>
        )}
        
        {/* Desktop view - all cards side by side */}
        {windowWidth >= 768 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: '0 -10px'
          }}>
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
                isVisible={isVisible}
              />
            ))}
          </div>
        )}

        <div style={{
          marginTop: 'clamp(40px, 8vw, 60px)',
          opacity: isVisible ? '1' : '0',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease-out 0.8s, transform 0.7s ease-out 0.8s'
        }}>
          {/* You can add additional content here if needed */}
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;