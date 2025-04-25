import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window?.innerWidth || 1200);
  const [showPopup, setShowPopup] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleScroll = () => {
      if (formRef.current) {
        const elementTop = formRef.current.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    emailjs
      .send(
        'service_of5fagy', // Replace with your EmailJS Service ID
        'template_6dor85s', // Replace with your EmailJS Template ID
        {
          from_name: 'Maddad Karo',
          from_email: formData.email,
          to_name: formData.name, 
          message: formData.message,
          phone: formData.phone,
          contact_number: formData.phone // Added contact number to the template
        },
        'FtaxH48P2GNtgbsrk' // Replace with your EmailJS User ID
      )
      .then(
        (response) => {
          console.log('Success:', response.status, response.text);
          // Show popup
          setShowPopup(true);
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
          });

          // Hide popup after 3 seconds
          setTimeout(() => {
            setShowPopup(false);
          }, 3000);
        },
        (error) => {
          console.error('Error:', error);
          alert('Failed to send the message. Please try again later.');
        }
      );
  };

  // Popup Component
  const Popup = () => {
    const popupStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      color: 'black',
      padding: '15px 30px',
      borderRadius: '8px',
      zIndex: 1000,
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      animation: 'slideInRight 0.5s ease-out, fadeOut 0.5s ease-in 2.5s',
    };

    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return (
      <div style={popupStyle}>
        <p>Message sent successfully!</p>
      </div>
    );
  };

  const styles = {
    wrapper: {
      position: 'relative',
      width: '100%',
      minHeight: windowWidth <= 768 ? '800px' : '650px',
      padding: windowWidth <= 480 ? '15px 10px' : '30px 20px',
      overflow: 'hidden',
      backgroundColor: '#f9f9f9',
      marginBottom: '20px',
      marginTop:'10px',
    },
    mainHeading: {
      textAlign: 'center',
      fontSize: windowWidth <= 480 ? '1.75rem' : windowWidth <= 768 ? '2rem' : '3rem',
      color: '#1A685B',
      marginBottom: '30px',
      lineHeight: windowWidth <= 480 ? '2rem' : '3rem',
      fontFamily: 'Oswald, sans-serif',
      fontWeight: '600',
      position: 'relative',
      zIndex: 3,
      padding: '0 15px',
    },
    container: {
      position: 'relative',
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: windowWidth <= 992 ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: windowWidth <= 992 ? 'center' : 'flex-start',
      gap: '15px',
      padding: '0 15px',
    },
    mapSection: {
      width: windowWidth <= 992 ? '100%' : '55%',
      height: windowWidth <= 480 ? '250px' : windowWidth <= 768 ? '350px' : '490px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      order: windowWidth <= 992 ? '2' : '1',
    },
    formSection: {
      width: windowWidth <= 992 ? '100%' : '45%',
      padding: windowWidth <= 480 ? '20px' : '30px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.6s ease-out',
      order: windowWidth <= 992 ? '1' : '2',
    },
    heading: {
      fontSize: windowWidth <= 480 ? '1.5rem' : '1.8rem',
      color: '#1A685B',
      fontWeight: '600',
      lineHeight: '1.4',
      marginBottom: '15px',
      fontFamily: 'Oswald, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    subHeading: {
      fontSize: windowWidth <= 480 ? '0.9rem' : '1rem',
      color: '#666',
      fontFamily: 'Inter, sans-serif',
      marginBottom: '25px',
      lineHeight: '1.6',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: windowWidth <= 768 ? 'column' : 'row',
      gap: '15px',
      width: '100%',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1.5px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      fontFamily: 'Inter, sans-serif',
      transition: 'border-color 0.3s ease',
      backgroundColor: '#ffffff',
      outline: 'none',
      '&:focus': {
        borderColor: '#1A685B',
      },
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      border: '1.5px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      fontFamily: '"Nunito Sans", sans-serif',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'border-color 0.3s ease',
      backgroundColor: '#ffffff',
      outline: 'none',
      '&:focus': {
        borderColor: '#1A685B',
      },
    },
    button: {
      padding: windowWidth <= 480 ? '10px 20px' : '12px 25px',
      backgroundColor: '#1A685B',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: windowWidth <= 480 ? '16px' : '18px',
      fontFamily: '"Nunito Sans", sans-serif',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      alignSelf: 'flex-start',
      '&:hover': {
        backgroundColor: '#330563',
        transform: 'translateY(-2px)',
      },
    },
  };

  return (
    <>
      {showPopup && <Popup />}
      <div style={styles.wrapper} ref={formRef}>
        <h1 style={styles.mainHeading}>WE'RE HERE TO HELP – GET IN TOUCH</h1>
        <div style={styles.container}>
          <div style={styles.mapSection}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-73.935242!3d40.730610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMDA610!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <div style={styles.formSection}>
            <h2 style={styles.heading}>
              👋 CONTACT US
            </h2>
            <p style={styles.subHeading}>Have Questions? Get in Touch!</p>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                style={styles.input}
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <div style={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  style={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  style={styles.input}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <textarea
                name="message"
                placeholder="Tell Us What You Want To Discuss *"
                style={styles.textarea}
                value={formData.message}
                onChange={handleChange}
                required
              />
              
              <button type="submit" style={styles.button}>
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;