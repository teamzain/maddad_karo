import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isHoveringNavLink, setIsHoveringNavLink] = useState(false);
  const location = useLocation();
const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Button text for non-logged in users
  const buttonTexts = ['Need Help?', 'Become a Donor', 'Join Us'];
  const currentText = buttonTexts[currentTextIndex];
  
  // Check user login status and type on component mount
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUser = localStorage.getItem('user');
    
    if (storedUserType && storedUser) {
      setUserType(storedUserType);
      setIsLoggedIn(true);
      
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || "User");
      } catch (e) {
        console.error("Error parsing user data", e);
        setUserName("User");
      }
    }
  }, []);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Typing animation effect
  useEffect(() => {
    // Type one character at a time
    if (typingIndex <= currentText.length) {
      const timeout = setTimeout(() => {
        setButtonText(currentText.substring(0, typingIndex));
        setTypingIndex(typingIndex + 1);
      }, 100); // Typing speed
      
      return () => clearTimeout(timeout);
    } 
    // After typing is complete, wait then change text
    else {
      const timeout = setTimeout(() => {
        setCurrentTextIndex((currentTextIndex + 1) % buttonTexts.length);
        setTypingIndex(0); // Reset typing index for next text
      }, 2000); // Pause on complete text
      
      return () => clearTimeout(timeout);
    }
  }, [currentTextIndex, typingIndex, currentText]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    // Close dropdown when menu is toggled on mobile
    if (isMobile) {
      setShowDropdown(false);
    }
  };
  
  const handleButtonClick = () => {
    setIsOpen(false);
    navigate('/login');
  };
  const handleLogout = () => {
    // First remove the user data from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    
    // Navigate directly to the home page
    window.location.href = '/';
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Get first letter of user name for avatar
  const getInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : "U";
  };

  // Function for donate button
  const handleDonateClick = () => {
    window.location.href = "/donate";
  };

  return (
    <div style={{
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: isScrolled ? 'rgba(248, 250, 252, 0.95)' : 'transparent',
      boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
      fontFamily: '"Nunito Sans", sans-serif',
      height: 'auto', // Let height adjust naturally
    }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isScrolled ? '0.75rem 1.5rem' : '1rem 1.5rem',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 100,
        transition: 'all 0.3s ease',
        maxHeight: isScrolled ? '90px' : '110px', // Increased height for better proportion
      }}>
        {/* Toggle Button (Left) - Adjusted vertical positioning */}
        <div style={{
          flex: '1',
          display: 'flex',
          alignItems: 'center',
        }}>
          <button 
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              zIndex: 110,
              marginTop: '5px', // Added to align with logo vertically
              width: '48px', // Fixed width for better alignment
              height: '48px', // Fixed height for better alignment
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
         
            <div style={{
              width: '32px', // Slightly larger hamburger
              height: '2px',
              backgroundColor: isOpen ? 'transparent' : '#1A685B',
              position: 'relative',
              transition: 'all 0.5s ease'
            }}>
              <div style={{
                width: '32px', // Slightly larger hamburger
                height: '2px',
                // Update this line to change color based on background
                backgroundColor: isOpen ? '#EBA608' : '#1A685B', 
                position: 'absolute',
                transform: isOpen ? 'rotate(45deg)' : 'translateY(-9px)', 
                transition: 'all 0.5s ease'
              }}></div>
              <div style={{
                width: '32px', // Slightly larger hamburger
                height: '2px',
                // Update this line to change color based on background
                backgroundColor: isOpen ? '#EBA608' : '#1A685B',
                position: 'absolute',
                transform: isOpen ? 'rotate(-45deg)' : 'translateY(9px)',
                transition: 'all 0.5s ease'
              }}></div>
            </div>
          </button>
        </div>

        {/* Logo (Center) - Now larger */}
        <div style={{
          flex: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Link to="/" style={{ 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none'
}}>
          {/* Logo Image */}
          <div style={{
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(360deg) scale(1.1)' : 'rotate(0) scale(1)'
          }}>
            <img 
              src="/logo.png"
              alt="Maddad Kro Logo" 
              style={{
                width: isScrolled ? '85px' : '110px', // Increased logo size
                height: isScrolled ? '85px' : '110px', // Increased logo size
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                marginTop: '-5px', // Adjust vertical position slightly
              }}
            />
          </div>
          </Link>
        </div>

        {/* Right Side - Avatar for logged in users or Button for non-mobile guests */}
        <div style={{
          flex: '1',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          visibility: 'visible', // Always visible
        }}>
          {/* Show avatar for logged in users */}
          {isLoggedIn ? (
            <div ref={dropdownRef} style={{
              position: 'relative',
              display: 'inline-block',
              // Always visible regardless of menu state
              visibility: 'visible',
            }}>
              {/* User Avatar */}
              <div 
                onClick={toggleDropdown}
                onMouseEnter={isMobile ? () => {} : null} // Removed hover effect on mobile
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: userType === 'donor' ? '#1A685B' : '#E39A04',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  transform: showDropdown ? 'scale(1.1)' : 'scale(1)',
                  position: 'relative',
                  zIndex: 200
                }}
              >
                {getInitial()}
              </div>

              {/* Dropdown Menu - Only show on top right corner */}
              {showDropdown && (
                <div 
                  onMouseLeave={isMobile ? () => {} : null} // Removed mobile hover effect
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 10px)',
                    width: '200px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
                    padding: '10px 0',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease-in-out',
                    transformOrigin: 'top right',
                  }}>
                    {/* Triangle pointer */}
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '15px',
                      width: '0',
                      height: '0',
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderBottom: '8px solid white',
                    }}></div>
                    
                    {/* User name display */}
                    <div style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid #eee',
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '0.95rem'
                    }}>
                      {userName}
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#888',
                        marginTop: '3px',
                        fontWeight: 'normal'
                      }}>
                        {userType === 'donor' ? 'Donor' : 'Receiver'}
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div>
                      {/* Modified menu items for donor */}
                      {userType === 'donor' ? (
                        <>
                          {/* Donate Now - new option for donors */}
                          <a href="/donate" style={{
                            display: 'block',
                            padding: '12px 15px',
                            color: '#1A685B',
                            textDecoration: 'none',
                            transition: 'background-color 0.3s ease',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <span>Donate Now</span>
                          </a>
                          
                          {/* Profile link for donors */}
                          <a href="/profile" style={{
                            display: 'block',
                            padding: '12px 15px',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background-color 0.3s ease',
                            fontSize: '0.9rem',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <span>Profile</span>
                          </a>
                        </>
                      ) : (
                        <>
                          {/* Dashboard link for receivers */}
                          <a href="/dashboard" style={{
                            display: 'block',
                            padding: '12px 15px',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background-color 0.3s ease',
                            fontSize: '0.9rem',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <span>Dashboard</span>
                          </a>
                          
                          {/* Request Fundraise - only for receivers */}
                          <a href="/request-funds" style={{
                            display: 'block',
                            padding: '12px 15px',
                            color: '#333',
                            textDecoration: 'none',
                            transition: 'background-color 0.3s ease',
                            fontSize: '0.9rem',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <span>Request Fundraise</span>
                          </a>
                        </>
                      )}
                      
                      {/* Logout button */}
                      <div 
                        onClick={handleLogout}
                        style={{
                          display: 'block',
                          padding: '12px 15px',
                          color: '#E74C3C',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s ease',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          borderTop: '1px solid #eee',
                          marginTop: '5px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <span>Logout</span>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          ) : (
            // Button for non-logged in users - Show ONLY on desktop, NEVER on mobile
            (!isMobile) && (
              <button 
                onClick={handleButtonClick}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  color: '#1A685B',
                  border: '2px solid #1A685B',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: isButtonHovered ? '0 4px 8px rgba(26, 104, 91, 0.3)' : 'none',
                  transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: '140px',
                  height: '42px',
                }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <span style={{
                  zIndex: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {buttonText}
                  <span 
                    style={{
                      width: '2px',
                      height: '16px',
                      backgroundColor: isButtonHovered ? 'white' : '#1A685B',
                      marginLeft: '2px',
                      animation: 'blink 1s infinite',
                      transition: 'background-color 0.3s ease'
                    }}
                  ></span>
                </span>
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: isButtonHovered ? '0' : '-100%',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1A685B',
                  transition: 'left 0.3s ease',
                  zIndex: 0
                }}></span>
              </button>
            )
          )}
        </div>
      </nav>

      {/* Green and White Overlay when menu is open */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isOpen ? '100%' : '0',
        height: isOpen ? '100%' : '0',
        backgroundColor: 'transparent',
        clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
        background: 'rgba(26, 104, 91, 0.98)', // Using #1A685B with increased opacity for better contrast
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 90
      }}></div>

      {/* Orange Triangle Overlay (Bottom Left) - Using the brand gold color */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: isOpen ? '100%' : '0',
        height: isOpen ? '100%' : '0',
        backgroundColor: 'transparent',
        clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
        background: isOpen ? 'rgba(255, 255, 255, 0.95)' : 'rgba(227, 154, 4, 0.95)', // Increased white opacity for better contrast
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 89
      }}></div>

      {/* Menu Content with Fade-in Animation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 95,
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'opacity 1s ease, visibility 1s ease',
        pointerEvents: isOpen ? 'auto' : 'none'
      }}>
        <ul style={{
  listStyle: 'none',
  padding: 0,
  textAlign: 'center',
  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
  transition: 'transform 0.8s ease'
}}>
  <li style={{ margin: '1.5rem 0' }}>
    <Link 
      to="/"
      onClick={() => setIsOpen(false)}
      style={{ 
        fontSize: isMobile ? '1.75rem' : '2.25rem', 
        color: '#000000',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        fontWeight: '600',
        position: 'relative',
        display: 'inline-block'
      }}
    >
      Home
      <span style={{
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: location.pathname === '/' ? '100%' : '0',
        height: '2px',
        backgroundColor: '#E39A04',
        transition: 'width 0.3s ease',
        opacity: isOpen ? 1 : 0
      }}></span>
    </Link>
  </li>
  <li style={{ margin: '1.5rem 0' }}>
    <Link 
      to="/about"
      onClick={() => setIsOpen(false)}
      style={{ 
        fontSize: isMobile ? '1.75rem' : '2.25rem', 
        color: '#000000',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        fontWeight: '600',
        position: 'relative',
        display: 'inline-block'
      }}
    >
      About
      <span style={{
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: location.pathname === '/about' ? '100%' : '0',
        height: '2px',
        backgroundColor: '#E39A04',
        transition: 'width 0.3s ease',
        opacity: isOpen ? 1 : 0
      }}></span>
    </Link>
  </li>
  <li style={{ margin: '1.5rem 0' }}>
    <Link 
      to="/gallery"
      onClick={() => setIsOpen(false)}
      style={{ 
        fontSize: isMobile ? '1.75rem' : '2.25rem', 
        color: '#000000',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        fontWeight: '600',
        position: 'relative',
        display: 'inline-block'
      }}
    >
      Gallery
      <span style={{
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: location.pathname === '/gallery' ? '100%' : '0',
        height: '2px',
        backgroundColor: '#E39A04',
        transition: 'width 0.3s ease',
        opacity: isOpen ? 1 : 0
      }}></span>
    </Link>
  </li>
  <li style={{ margin: '1.5rem 0' }}>
    <Link 
      to="/contact-us"
      onClick={() => setIsOpen(false)}
      style={{ 
        fontSize: isMobile ? '1.75rem' : '2.25rem', 
        color: '#000000',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        fontWeight: '600',
        position: 'relative',
        display: 'inline-block'
      }}
    >
      Contact Us
      <span style={{
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: location.pathname === '/contact-us' ? '100%' : '0',
        height: '2px',
        backgroundColor: '#E39A04',
        transition: 'width 0.3s ease',
        opacity: isOpen ? 1 : 0
      }}></span>
    </Link>
  </li>
  
  {/* Login button for mobile non-logged in users */}
  {isMobile && !isLoggedIn && (
    <li style={{ marginTop: '3rem' }}>
      <button 
        onClick={handleButtonClick}
        style={{
          padding: '12px 25px',
          backgroundColor: '#1A685B',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(26, 104, 91, 0.3)'
        }}
      >
        {buttonText}
      </button>
    </li>
  )}
</ul>
      </div>

      {/* Add CSS for animations and font import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&display=swap');
          
          body {
            padding-top: 110px; /* Increased space for larger navbar */
          }
          
          a:hover .menu-underline {
            width: 100% !important;
          }
          a:hover {
            color: #E39A04 !important;
          }
          button span:first-child {
            color: ${isButtonHovered ? 'white' : '#1A685B'};
            transition: color 0.3s ease;
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}