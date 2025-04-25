import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const ContactCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('contact-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
          setIsVisible(true);
        }
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getMarginTop = () => {
    if (windowWidth > 1024) return '-100px';
    if (windowWidth > 768) return '-80px';
    return '-60px';
  };

  const cardStyles = {
    container: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: windowWidth <= 768 ? 'column' : 'row',
      alignItems: 'center',
      gap: windowWidth <= 768 ? '1rem' : '2rem',
      padding: windowWidth <= 768 ? '1rem' : '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: getMarginTop(),
      opacity: isVisible ? 1 : 0,
      transform: `translateY(${isVisible ? '0' : '50px'})`,
      transition: 'all 0.8s ease-out',
      zIndex: 10,
    },
    card: {
      padding: windowWidth <= 480 ? '1rem' : '1.5rem',
      borderRadius: '10px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      width: windowWidth <= 480 ? '90%' : 
             windowWidth <= 768 ? '85%' : 
             windowWidth <= 1024 ? '250px' : '300px',
      textAlign: 'center',
      backgroundColor: 'white',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    image: {
      width: windowWidth <= 480 ? '40px' : '50px',
      height: windowWidth <= 480 ? '40px' : '50px',
      objectFit: 'contain',
    },
    title: {
      fontSize: windowWidth <= 480 ? '1.1rem' : '1.2rem',
      fontWeight: 'bold',
      fontFamily: '"Nunito Sans", sans-serif',
      marginBottom: '0.5rem',
      color: '#1A685B',
      width: '100%',
      textAlign: 'center',
    },
    content: {
      color: '#414042',
      lineHeight: '1.5',
      fontSize: windowWidth <= 480 ? '0.9rem' : '1rem',
      width: '100%',
      textAlign: 'center',
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem',
    },
    socialIcon: {
      color: '#414042',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
      fontSize: windowWidth <= 480 ? '0.9rem' : '1rem',
    }
  };

  const wrapperStyles = {
    marginBottom: windowWidth <= 768 ? '2rem' : '3rem',
  };

  return (
    <div style={wrapperStyles}>
      <div id="contact-section" style={cardStyles.container}>
        <div 
          style={cardStyles.card}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={cardStyles.imageContainer}>
            <img
              src="/location 2.jpg"
              alt="Location Icon"
              style={cardStyles.image}
            />
          </div>
          <div style={cardStyles.title}>OUR LOCATION</div>
          <div style={cardStyles.content}>
            Sargodha<br />
            Punjab,    Pakistan
        
          </div>
        </div>

        <div 
          style={cardStyles.card}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={cardStyles.imageContainer}>
            <img
              src="/call 2.jpg"
              alt="Phone Icon"
              style={cardStyles.image}
            />
          </div>
          <div style={cardStyles.title}>CONTACT DETAILS</div>
          <div style={cardStyles.content}>
            Phone: +92 329 9795007
            <br />
            zainulabidden43@gmail.com
          </div>
        </div>

        <div 
          style={cardStyles.card}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={cardStyles.imageContainer}>
            <img
              src="/share 2.jpg"
              alt="Social Media Icon"
              style={cardStyles.image}
            />
          </div>
          <div style={cardStyles.title}>SOCIAL MEDIA</div>
          <div style={cardStyles.content}>
            Connect with us online
            <div style={cardStyles.socialLinks}>
              <a href="#" style={cardStyles.socialIcon}><FaFacebookF /></a>
              <a href="#" style={cardStyles.socialIcon}><FaTwitter /></a>
              <a href="#" style={cardStyles.socialIcon}><FaInstagram /></a>
              <a href="#" style={cardStyles.socialIcon}><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCards;