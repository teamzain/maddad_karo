import React, { useEffect, useState } from 'react';
import { ShieldCheck, Globe, MapPin, Heart } from 'lucide-react';


const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('landing-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const styles = {
    container: {
      position: 'relative',
      minHeight: '80vh',
      width: '100%',
      overflow: 'hidden',
      scrollSnapAlign: 'start',
      fontFamily: '"Nunito Sans", sans-serif',
    },
    imageWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter:'blur(3px)'
      
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    content: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '64px 24px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
      transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      fontFamily: 'Oswald, sans-serif',
    },
    flexContainer: {
      display: 'flex',
      flexDirection: window.innerWidth > 1024 ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '48px',
    },
    leftSection: {
      flex: '1 1 50%',
    },
    rightSection: {
      flex: '1 1 50%',
    },
    heading: {
      fontSize: 'clamp(32px, 5vw, 54px)', // Responsive font size
      fontWeight: '600',
      color: 'white',
      marginBottom: '24px',
      lineHeight: '1.3', // Changed to relative unit
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: 'Oswald, sans-serif',
      '@media (max-width: 768px)': {
        fontSize: '36px',
        lineHeight: '1.2',
      },
      '@media (max-width: 480px)': {
        fontSize: '28px',
        lineHeight: '1.1',
      }
    },
    weAre: {
      display: 'block',
      fontSize: 'clamp(18px, 3vw, 24px)', // Responsive font size
      color: '#ffffff',
      fontWeight: '400',
      fontFamily: 'Oswald, sans-serif',
      '@media (max-width: 768px)': {
        fontSize: '20px',
      },
      '@media (max-width: 480px)': {
        fontSize: '16px',
      }
    },
    description: {
      fontSize: 'clamp(16px, 2vw, 15px)', // Responsive font size
      color: 'white',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
      lineHeight: '1.6',
      fontFamily: '"Nunito Sans", sans-serif',
      fontWeight: '100',
      maxWidth: '90ch', // Limit line length for better readability
      '@media (max-width: 768px)': {
        fontSize: '14px',
        lineHeight: '1.5',
      }
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
      gap: '24px',
    },
    statCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(8px)',
      padding: '18px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      transform: 'translateY(0)',
      fontFamily: '"Nunito Sans", sans-serif',
    },
    statCardHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
    icon: {
      marginBottom: '16px',
      color: 'white',
    },
    statTitle: {
      fontSize: '24px',
      fontWeight: '900',
      color: 'white',
      lineHeight:'38px',
      marginBottom: '8px',
      fontFamily: '"Nunito Sans", sans-serif',
     
    },
    statDescription: {
      fontSize: '15px',
      color: '#e5e5e5',
      lineHeight: '22px',
      fontFamily: 'Inter, sans-serif',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
      fontWeight: '200',
    },
  };

  const stats = [
    {
        title: "TRUSTED PLATFORM",
        description: "Verified requests ensure your support reaches the right hands.",
        icon: ShieldCheck
      },
      {
        title: "ZERO BARRIERS",
        description: "Multi-lingual, low-bandwidth support for remote accessibility.",
        icon: Globe
      },
      {
        title: "LOCAL IMPACT",
        description: "Geo-targeting connects donors with nearby causes.",
        icon: MapPin
      },
      {
        title: "TRUE STORIES",
        description: "Track your impact through heartfelt stories and updates.",
        icon: Heart
      },      
  ];
  

  return (
    <div style={styles.container} id="landing-section">
      <div style={styles.imageWrapper}>
        <img
          src="/about.jpg" // Replace with the path to your image
          alt="Background"
          style={styles.image}
        />
        <div style={styles.overlay} />
      </div>

      <div style={styles.content}>
        <div style={styles.flexContainer}>
          <div style={styles.leftSection}>
            <h1 style={styles.heading}>
            <span style={styles.weAre}>WE ARE</span>
            مدد کرو
</h1>
<p style={styles.description}>
  We've built a platform rooted in compassion and community — connecting those in need with generous donors through a trusted, transparent system. Whether it's food, medicine, or support during emergencies, Maddad Karo empowers real people to make real impact. With multilingual access and geo-targeted help, we’re making generosity more personal, accessible, and powerful for everyone.
</p>
          </div>

          <div style={styles.rightSection}>
            <div style={styles.statsGrid}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    style={{
                      ...styles.statCard,
                      ...(hoveredCard === index ? styles.statCardHover : {}),
                      transform: isVisible
                        ? `translateY(${hoveredCard === index ? -5 : 0}px)`
                        : 'translateY(50px)',
                      opacity: isVisible ? 1 : 0,
                      transition: `all 0.3s ease-out ${index * 0.1}s`,
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <IconComponent style={styles.icon} size={32} />
                    <h3 style={styles.statTitle}>{stat.title}</h3>
                    <p style={styles.statDescription}>{stat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
