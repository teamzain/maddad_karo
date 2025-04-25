import React, { useEffect, useRef, useState } from 'react';
import { UserCircle2, Target, TrendingUp } from 'lucide-react';

function BusinessGrowthComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
      transition: 'opacity 1s ease-out, transform 1s ease-out',
    },
    empowerSection: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '80px',
      gap: '32px',
    },
    imageWrapper: {
      flex: '1',
      width: '100%',
      maxWidth: isMobile ? '100%' : '50%',
    },
    image: {
      width: '100%',
      maxWidth: '500px',
      borderRadius: '10px',
      marginBottom: isMobile ? '24px' : '0',
    },
    mobileTextWrapper: {
      display: isMobile ? 'block' : 'none',
      textAlign: 'left',
      width: '100%',
    },
    desktopTextWrapper: {
      display: isMobile ? 'none' : 'block',
      flex: '1',
      maxWidth: '50%',
    },
    heading: {
      fontFamily: 'Oswald, sans-serif',
      fontSize: isMobile ? '1.75rem' : '2.5rem',
      fontWeight: '600',
      marginBottom: '20px',
      lineHeight:'40px',
      color: '#1A685B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    paragraph: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontFamily: 'Inter, sans-serif',
      color: '#414042',
      fontWeight: '400',
    },
    Paragraph: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontFamily: 'Inter, sans-serif',
      color: '#414042',
      fontWeight: '400',
      maxWidth: '910px',   // Max width specific to the second paragraph
      margin: '0 auto 20px', // Center-aligned
      textAlign: 'center',   // Center-aligned
    },
    blockquote: {
      fontStyle: 'italic',
      borderLeft: '4px solid #1A685B ',
      paddingLeft: '20px',
      margin: '30px 0',
      color: '#4A5568',
      fontSize: '1.1rem',
      lineHeight: '1.8',
      backgroundColor: '#F8F9FA',
      padding: '20px 20px 20px 30px',
      borderRadius: '0 10px 10px 0',
    },
    growthSection: {
      textAlign: 'center',
      marginBottom: '60px',
    },
    iconContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-around',
      gap: '32px',
      marginTop: '40px',
    },
    iconItem: {
      textAlign: 'center',
      width: isMobile ? '100%' : '30%',
    },
    iconText: {
      fontFamily: 'Oswald, sans-serif',
      fontSize: 'clamp(18px, 2vw, 24px)', // Responsive font size
      lineHeight: 'clamp(24px, 2.5vw, 32px)', // Responsive line height
      fontWeight: '600',
      marginBottom: '10px',
      color: '#1A685B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      wordWrap: 'break-word', // Ensures text wraps properly
      maxWidth: '100%', // Prevents text from overflowing
    },
    icon: {
      backgroundColor: '#1A685B',
      borderRadius: '50%',
      padding: 'clamp(15px, 2vw, 20px)', // Responsive padding
      marginBottom: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'clamp(60px, 8vw, 80px)', // Responsive width
      height: 'clamp(60px, 8vw, 80px)', // Responsive height
      boxShadow: '0 4px 6px rgba(91, 33, 182, 0.1)',
    },
    subtext: {
      fontSize: 'clamp(14px, 1.5vw, 16px)', // Responsive font size
      lineHeight: '1.5',
      fontFamily: 'Inter, sans-serif',
      color: '#414042',
      fontWeight: '400',
      maxWidth: '100%',
      margin: '0 auto',
    },
  };

  return (
    <div ref={sectionRef} style={styles.container}>
      <div style={styles.empowerSection}>
        <div style={styles.imageWrapper}>
          <img
            src="/volunteer.jpg"
            alt="Business Growth"
            style={styles.image}
          />
          <div style={styles.mobileTextWrapper}>
            <h2 style={styles.heading}>Our Evolving Mission</h2>
<p style={styles.paragraph}>
  The way we support communities is changing — and Maddad Karo is built to grow with those changes. We're shaping a sustainable, people-first platform where generosity meets real need, ensuring no one is left behind in moments of crisis or recovery.
</p>

          </div>
        </div>

        <div style={styles.desktopTextWrapper}>
        <h2 style={styles.heading}>Our Evolving Mission</h2>
<p style={styles.paragraph}>
  The way we support communities is changing — and Maddad Karo is built to grow with those changes. We're shaping a sustainable, people-first platform where generosity meets real need, ensuring no one is left behind in moments of crisis or recovery.
</p>

<blockquote style={styles.blockquote}>
  "In today's world, where digital solutions often feel impersonal, we believe in technology that connects hearts. Maddad Karo is built on compassion, trust, and community – a platform where giving becomes meaningful, support is transparent, and every act of kindness strengthens the bonds between us. We don’t just build software; we build hope."
</blockquote>

        </div>
      </div>

      <div style={styles.growthSection}>
       
<h2 style={styles.heading}>Empowering Communities with Maddad Karo</h2>
<p style={styles.Paragraph}>
Maddad Karo is a donation platform designed to connect those in need with people who care. Whether it's food, medicine, or financial aid, our mission is to make giving more personal and impactful—because kindness should be as accessible as a click.
</p>

<div style={styles.iconContainer}>
  {[
    { Icon: UserCircle2, title: 'Verified Requests', desc: 'Genuine, human-verified appeals for food, medicine, and more to ensure every donation matters.' },
    { Icon: Target, title: 'Geo-Targeted Giving', desc: 'Connect directly with people nearby and see the difference your donation makes in your own community.' },
    { Icon: TrendingUp, title: 'Impact You Can See', desc: 'Follow your donation’s journey and read real stories from the people you helped.' },
   
    
  ].map((item, index) => (
            <div key={index} style={styles.iconItem}>
              <div style={styles.icon}>
                <item.Icon size={32} color="white" />
              </div>
              <h3 style={styles.iconText}>{item.title}</h3>
              <p style={styles.subtext}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BusinessGrowthComponent;
