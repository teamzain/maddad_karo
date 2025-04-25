import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Login = ({ onLoginSuccess }) => {
  const [userType, setUserType] = useState('receiver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const navigate = useNavigate();

  // Animation effect on component mount
  useEffect(() => {
    setTimeout(() => setImageVisible(true), 300);
  }, []);

  const handleUserTypeChange = (type) => {
    if (type !== userType) {
      setIsFlipping(true);
      
      // Start the flip animation
      let degree = rotationDegree;
      const flipInterval = setInterval(() => {
        degree += 18; // Increment by 18 degrees per frame (20 frames for 360 degrees)
        setRotationDegree(degree);
        
        // At halfway point, change the user type
        if (degree % 360 === 180) {
          setUserType(type);
        }
        
        // Complete the flip animation
        if (degree % 360 === 0) {
          clearInterval(flipInterval);
          setIsFlipping(false);
          setRotationDegree(degree);
        }
      }, 25); // 25ms per frame = ~500ms for full rotation
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill all fields');
      setMessageType('error');
      return;
    }

    // Check for admin credentials when on receiver tab
    // Check for admin credentials when on receiver tab
if (userType === 'receiver' && email === 'admin@gmail.com' && password === 'admin') {
  setMessage('Welcome Admin! Redirecting to admin dashboard...');
  setMessageType('success');
  
  // Create admin session data
  const adminData = {
    id: 'admin',
    email: 'admin@gmail.com',
    name: 'Admin',
    role: 'admin',
    verify: 'verified'
  };
  
  // Store the admin session data in localStorage
  localStorage.setItem('user', JSON.stringify(adminData));
  localStorage.setItem('userType', 'admin'); // Setting a special userType for admin
  
  console.log("Admin login detected, session created, navigating to admin dashboard");
  
  // Call the onLoginSuccess callback passed from App.js if needed
  if (onLoginSuccess) {
    onLoginSuccess();
  }
  
  // Navigate directly to admin dashboard
  setTimeout(() => {
    navigate('/admin-dashboard');
  }, 500);
  
  return;
}

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    const tableName = userType === 'receiver' ? 'user' : 'ngo_user';
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('email', email)
      .eq('password', password) // In production, always use password hashing!
      .single();

    if (error || !data) {
      setMessage('Invalid email or password');
      setMessageType('error');
      return;
    }

    if (data.verify !== 'verified') {
      setMessage('Your request is not verified. Please wait.');
      setMessageType('warning');
      return;
    }

    setMessage(`Welcome, ${data.name}! Redirecting...`);
    setMessageType('success');
    
    // Store the session data in localStorage
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('userType', userType);
    
    // Call the onLoginSuccess callback passed from App.js
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    
    // Add a small delay before navigation and reload
    setTimeout(() => {
      console.log("Successful login, navigating to home and reloading");
      navigate('/');
      // Add window.location.reload() to refresh the page
      window.location.reload();
    }, 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Styles remain unchanged
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'white',
      fontFamily: '"Nunito Sans", sans-serif',
      overflow: 'hidden',
      position: 'relative'
    },
    imageContainer: {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    image: {
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
      transition: 'all 1s ease-in-out',
      transform: imageVisible ? 'translateX(0)' : 'translateX(-100%)',
      opacity: imageVisible ? '1' : '0'
    },
    formContainer: {
      width: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '40px',
      zIndex: '1'
    },
    formWrapper: {
      maxWidth: '450px',
      margin: '0 auto',
      width: '100%',
      perspective: '1000px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      animation: 'fadeIn 0.8s ease-in-out'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1A685B',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666'
    },
    formCard: {
      transformStyle: 'preserve-3d',
      transition: 'transform 0.05s', // Smoother transition while flipping
      transform: `rotateY(${rotationDegree}deg)`
    },
    formBox: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      padding: '35px',
      marginBottom: '20px',
      border: '1px solid rgba(0,0,0,0.05)',
      animation: 'appearScale 0.5s ease-in-out',
      backfaceVisibility: 'hidden'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '25px'
    },
    tabGroup: {
      display: 'inline-flex',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
    },
    tab: {
      padding: '12px 30px',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      backgroundColor: '#1A685B',
      color: 'white'
    },
    inactiveTab: {
      backgroundColor: '#f5f5f5',
      color: '#555'
    },
    formGroup: {
      marginBottom: '22px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '15px',
      color: '#444',
      fontWeight: '500'
    },
    inputGroup: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      width: '100%',
      padding: '14px 15px',
      fontSize: '15px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    inputFocus: {
      boxShadow: '0 0 0 2px rgba(26, 104, 91, 0.2)',
      borderColor: '#1A685B'
    },
    passwordToggle: {
      position: 'absolute',
      right: '15px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#666',
      fontSize: '14px',
      padding: '5px'
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#FFAC00',
      color: 'white',
      border: 'none',
      padding: '14px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(255, 172, 0, 0.2)'
    },
    submitButtonHover: {
      backgroundColor: '#e69b00',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(255, 172, 0, 0.3)'
    },
    messageSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '15px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out'
    },
    messageError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '15px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out'
    },
    messageWarning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '15px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out'
    },
    messageInfo: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '15px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out'
    },
    linkText: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '15px',
      color: '#555'
    },
    link: {
      color: '#1A685B',
      textDecoration: 'none',
      fontWeight: 'bold',
      position: 'relative',
      padding: '0 2px'
    },
    linkHover: {
      textDecoration: 'underline'
    }
  };

  // For responsive design (media query emulation)
  if (window.innerWidth < 768) {
    styles.container = { ...styles.container, flexDirection: 'column' };
    styles.formContainer = { ...styles.formContainer, width: '100%', padding: '20px' };
    styles.imageContainer = { ...styles.imageContainer, width: '100%', height: '35vh' };
  }

  return (
    <div style={styles.container}>
      {/* Left side - Image */}
      <div style={styles.imageContainer}>
        <img 
          src="/logo.jpg" 
          alt="Login Illustration"
          style={styles.image}
        />
      </div>

      {/* Right side - Login Form */}
      <div style={styles.formContainer}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to your account to continue</p>
          </div>
          
          <div style={styles.formCard}>
            <div style={styles.formBox}>
              <div style={styles.tabContainer}>
                <div style={styles.tabGroup}>
                  <button 
                    style={{...styles.tab, ...(userType === 'receiver' ? styles.activeTab : styles.inactiveTab)}}
                    onClick={() => handleUserTypeChange('receiver')}
                    disabled={isFlipping}
                  >
                    Receiver
                  </button>
                  <button 
                    style={{...styles.tab, ...(userType === 'donor' ? styles.activeTab : styles.inactiveTab)}}
                    onClick={() => handleUserTypeChange('donor')}
                    disabled={isFlipping}
                  >
                    Donor
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleLogin}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <div style={styles.inputGroup}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                      placeholder="Enter your email"
                      onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.inputGroup}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={styles.input}
                      placeholder="Enter your password"
                      onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                    <button 
                      type="button" 
                      onClick={togglePasswordVisibility}
                      style={styles.passwordToggle}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  style={styles.submitButton}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                    e.target.style.transform = styles.submitButtonHover.transform;
                    e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = styles.submitButton.backgroundColor;
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = styles.submitButton.boxShadow;
                  }}
                >
                  Login as {userType === 'receiver' ? 'Receiver' : 'Donor'}
                </button>
              </form>
              
              {message && (
                <div style={
                  messageType === 'success' ? styles.messageSuccess :
                  messageType === 'error' ? styles.messageError :
                  messageType === 'warning' ? styles.messageWarning :
                  styles.messageInfo
                }>
                  {message}
                </div>
              )}
              
              <div style={styles.linkText}>
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  style={styles.link}
                  onMouseOver={(e) => e.target.style.textDecoration = styles.linkHover.textDecoration}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for keyframe animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes appearScale {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(styleSheet);

export default Login;