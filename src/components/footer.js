import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Youtube, Twitter, ChevronUp } from 'lucide-react';

const MaddadKaroInterface = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{
      minHeight: '10vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 1001,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#FFAC00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ChevronUp color="#1A685B" size={28} />
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1A685B',
        fontFamily: '"Nunito Sans", sans-serif',
        padding: '15px 20px',
        marginTop: 'auto',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#ffffff',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: isMobile ? '30px' : '50px',
              height: '2px',
              backgroundColor: '#FFAC00',
              margin: '10px',
            }}></div>
            <div style={{
              display: 'flex',
              gap: '15px',
            }}>
              <Facebook style={{ color: '#ffffff', cursor: 'pointer', width: '24px', height: '24px' }} />
              <Instagram style={{ color: '#ffffff', cursor: 'pointer', width: '24px', height: '24px' }} />
              <Youtube style={{ color: '#ffffff', cursor: 'pointer', width: '24px', height: '24px' }} />
              <Twitter style={{ color: '#ffffff', cursor: 'pointer', width: '24px', height: '24px' }} />
            </div>
            <div style={{
              width: isMobile ? '30px' : '50px',
              height: '2px',
              backgroundColor: '#FFAC00',
              margin: '10px',
            }}></div>
          </div>
          <div style={{
            marginBottom: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img 
              src="/logo2.png" 
              alt="Logo" 
              style={{
                width: isMobile ? '60px' : '130px',
                height:isMobile ? '60px' : '130px',
                marginBottom: '-6px',
                marginTop:'-10px',
              }}
            />
   
            <p style={{
              fontSize: '14px',
              color: '#a8a8a8',
              margin: '5px 0',
              textAlign: 'center',
            }}>
              Copyright © 2024 Maddad Karo, Inc.
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            fontSize: isMobile ? '12px' : '14px',
          }}>
            <a style={{ color: '#a8a8a8', textDecoration: 'none', cursor: 'pointer' }} href="#">Legal Stuff</a>
            <span style={{ color: '#a8a8a8' }}>|</span>
            <a style={{ color: '#a8a8a8', textDecoration: 'none', cursor: 'pointer' }} href="#">Privacy Policy</a>
            <span style={{ color: '#a8a8a8' }}>|</span>
            <a style={{ color: '#a8a8a8', textDecoration: 'none', cursor: 'pointer' }} href="#">Security</a>
            <span style={{ color: '#a8a8a8' }}>|</span>
            <a style={{ color: '#a8a8a8', textDecoration: 'none', cursor: 'pointer' }} href="#">Website Accessibility</a>
            <span style={{ color: '#a8a8a8' }}>|</span>
            <a style={{ color: '#a8a8a8', textDecoration: 'none', cursor: 'pointer' }} href="#">Manage Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MaddadKaroInterface;