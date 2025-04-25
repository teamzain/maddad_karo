import React, { useEffect, useRef } from 'react';

function ContactusBanner () {
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const styles = {
    container: {
      minHeight: '75vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      overflow: 'hidden'
    },

    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("/contact.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'top-left',
      zIndex: 1
    },

 
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 128, 0, 0.1)', // Green overlay with opacity (changed from purple)
        zIndex: 2
      },

    leftSection: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      textAlign: 'center',
      zIndex: 3
    },

    title: {
      fontSize: 'clamp(24px, 5vw, 54px)', // This makes the font size responsive
      fontWeight: '800',
      color: 'white',
      lineHeight: 'clamp(30px, 6vw, 65px)', // Responsive line height
      fontFamily: '"Nunito Sans", sans-serif',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
      marginBottom: '20px',
      textAlign: 'center'
    },

    subtitle: {
      fontSize: 'clamp(13px, 2vw, 15px)', // Responsive subtitle
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '30px',
      fontWeight: '700',
      fontFamily: '"Nunito Sans", sans-serif',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
      maxWidth: '620px',
      lineHeight: 'clamp(18px, 3vw, 22px)', // Responsive line height
      textAlign: 'center'
    },

    marqueeOverlay: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      padding: '10px 0',
      overflow: 'hidden',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 3
    },

    marqueeContent: {
      display: 'flex',
      animation: 'marquee 30s linear infinite',
      whiteSpace: 'nowrap'
    },

    marqueeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '0 20px',
      color: 'white',
      fontSize: 'clamp(0.875rem, 1.2vw, 1.1rem)',
      fontWeight: '500'
    },

    starIcon: {
      color: '#DB1666',
      fontSize: 'clamp(0.875rem, 1.2vw, 1.2rem)'
    }
  };

  // const services = [
  //   'Managed IT & Security',
  //   'Warehouse Management',
  //   'Data Integration',
  //   'Analytics Solutions',
  //   'Cloud Infrastructure',
  //   'Cybersecurity'
  // ];

  return (
    <div ref={headerRef} style={styles.container} className="services-header">
      {/* Background Image */}
      <div style={styles.backgroundImage}></div>

      {/* Overlay */}
      <div style={styles.overlay}></div>

      <style>
        {`
          .title-text, .subtitle-text {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s ease-out;
          }

          .services-header.animate-in .title-text {
            opacity: 1;
            transform: translateY(0);
            transition-delay: 0.2s;
          }

          .services-header.animate-in .subtitle-text {
            opacity: 1;
            transform: translateY(0);
            transition-delay: 0.4s;
          }

          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .marquee-item {
            transition: transform 0.3s ease;
          }

          .marquee-item:hover {
            transform: scale(1.05);
          }

          /* Mobile styles */
          @media (max-width: 768px) {
            .services-header {
              min-height: 50vh !important;
              padding: 40px 20px !important;
            }

            .title-text {
              margin-bottom: 15px !important;
            }

            .subtitle-text {
              margin-bottom: 20px !important;
            }
          }

          /* Even smaller screens */
          @media (max-width: 480px) {
            .services-header {
              min-height: 40vh !important;
              padding: 30px 15px !important;
            }

            .marquee-item:hover {
              transform: scale(1.02);
            }
          }

          /* Maintain regular height on desktop */
          @media (min-width: 769px) {
            .services-header {
              min-height: 75vh;
              padding: 40px 20px;
            }
          }
        `}
      </style>

      <div style={styles.leftSection}>
  <h1 style={styles.title} className="title-text">
    GET IN TOUCH
  </h1>
  <p style={styles.subtitle} className="subtitle-text">
Together, we can make generosity more meaningful. Whether you're seeking help or offering support, we're here to connect hearts and create real change—one donation at a time.
</p>

</div>


      {/* <div style={styles.marqueeOverlay}>
        <div style={styles.marqueeContent}>
          {[...services, ...services, ...services].map((service, index) => (
            <div key={index} style={styles.marqueeItem} className="marquee-item">
              <span style={styles.starIcon}>★</span>
              <span>{service}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ContactusBanner;
