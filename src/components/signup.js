import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Signup = () => {
  const [type, setType] = useState('receiver');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [gender, setGender] = useState('');
  const [donorType, setDonorType] = useState('individual');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const navigate = useNavigate();

  // Animation effect on component mount
  useEffect(() => {
    setTimeout(() => setImageVisible(true), 300);
  }, []);

  const handleTypeChange = (newType) => {
    if (newType !== type) {
      setIsFlipping(true);
      
      // Start the flip animation
      let degree = rotationDegree;
      const flipInterval = setInterval(() => {
        degree += 18; // Increment by 18 degrees per frame (20 frames for 360 degrees)
        setRotationDegree(degree);
        
        // At halfway point, change the user type
        if (degree % 360 === 180) {
          setType(newType);
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setMessage('You can only upload up to 3 images.');
      setMessageType('error');
      return;
    }
    setImages(files);
  };

  const uploadImages = async (userId) => {
    const imageUrls = [];

    for (const file of images) {
      const filePath = `${userId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('donor-images')
        .upload(filePath, file);

      if (error) {
        console.error("Image upload failed:", error);
        continue;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('donor-images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrlData.publicUrl);
    }

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType('error');
      return;
    }

    if (type === '') {
      setMessage("Please select a type");
      setMessageType('error');
      return;
    }

    const userData = {
      name,
      email,
      password,
      mobile_number: mobileNumber,
      verify: 'pending',
    };

    try {
      if (type === 'donor') {
        if (donorType === 'individual' && gender === '') {
          setMessage("Please select gender for individual donors.");
          setMessageType('error');
          return;
        }

        const donorData = {
          ...userData,
          organization_name: donorType === 'organization' ? organizationName : null,
          additional_info: additionalInfo,
          portfolio: donorType === 'organization' ? portfolio : null,
          gender: donorType === 'individual' ? gender : null,
        };

        const { data, error } = await supabase
          .from('ngo_user')
          .insert([donorData])
          .select()
          .single();

        if (error) {
          console.error("Signup error:", error);
          setMessage("Signup failed. Please try again.");
          setMessageType('error');
          return;
        }

        if (images.length > 0) {
          const imageUrls = await uploadImages(data.id);
          await supabase
            .from('ngo_user')
            .update({ image_urls: imageUrls })
            .eq('id', data.id);
        }

        setMessage("Signup successful! Your account is pending verification.");
        setMessageType('success');

      } else if (type === 'receiver') {
        const receiverData = {
          ...userData,
          gender,
        };

        const { error } = await supabase.from('user').insert([receiverData]);

        if (error) {
          console.error("Signup error:", error);
          setMessage("Signup failed. Please try again.");
          setMessageType('error');
          return;
        }

        setMessage("Signup successful! Your account is pending verification.");
        setMessageType('success');
      }

      // Add a small delay before navigation
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageType('error');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: 'white',
      fontFamily: '"Nunito Sans", sans-serif',
      overflow: 'hidden',
      position: 'relative'
    },
    imageContainer: {
      width: '40%',
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
      width: '60%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '20px',
      zIndex: '1'
    },
    formWrapper: {
      maxWidth: '550px',
      margin: '0 auto',
      width: '100%',
      perspective: '1000px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    header: {
      textAlign: 'center',
      marginBottom: '15px',
      animation: 'fadeIn 0.8s ease-in-out'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1A685B',
      marginBottom: '4px'
    },
    subtitle: {
      fontSize: '15px',
      color: '#666'
    },
    formCard: {
      transformStyle: 'preserve-3d',
      transition: 'transform 0.05s',
      transform: `rotateY(${rotationDegree}deg)`,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    formBox: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      padding: '20px',
      marginBottom: '10px',
      border: '1px solid rgba(0,0,0,0.05)',
      animation: 'appearScale 0.5s ease-in-out',
      backfaceVisibility: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px'
    },
    tabGroup: {
      display: 'inline-flex',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
    },
    tab: {
      padding: '10px 25px',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontSize: '14px',
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
    formContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    formGroup: {
      marginBottom: '12px'
    },
    formRow: {
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: '-8px',
      marginRight: '-8px',
      marginBottom: '8px'
    },
    formCol: {
      flex: '1 0 50%',
      paddingLeft: '8px',
      paddingRight: '8px'
    },
    formCol3: {
      flex: '1 0 33.333%',
      paddingLeft: '8px',
      paddingRight: '8px'
    },
    label: {
      display: 'block',
      marginBottom: '4px',
      fontSize: '13px',
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
      padding: '10px 12px',
      fontSize: '14px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      transition: 'all 0.3s ease',
      outline: 'none',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px top 50%',
      backgroundSize: '8px auto'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      transition: 'all 0.3s ease',
      outline: 'none',
      height: '60px',
      resize: 'none'
    },
    inputFocus: {
      boxShadow: '0 0 0 2px rgba(26, 104, 91, 0.2)',
      borderColor: '#1A685B'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#666',
      fontSize: '12px',
      padding: '4px'
    },
    fileInput: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#FFAC00',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(255, 172, 0, 0.2)',
      marginTop: '15px'
    },
    submitButtonHover: {
      backgroundColor: '#e69b00',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(255, 172, 0, 0.3)'
    },
    messageSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px',
      borderRadius: '6px',
      marginTop: '12px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out',
      fontSize: '14px'
    },
    messageError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '6px',
      marginTop: '12px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out',
      fontSize: '14px'
    },
    messageWarning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '10px',
      borderRadius: '6px',
      marginTop: '12px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-in-out',
      fontSize: '14px'
    },
    linkText: {
      textAlign: 'center',
      marginTop: '12px',
      fontSize: '14px',
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
    },
    radioGroup: {
      display: 'flex',
      gap: '15px'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '14px'
    },
    radio: {
      marginRight: '6px'
    },
    infoText: {
      fontSize: '12px',
      color: '#666',
      marginTop: '2px'
    }
  };

  // For responsive design (media query emulation)
  if (window.innerWidth < 768) {
    styles.container = { ...styles.container, flexDirection: 'column' };
    styles.formContainer = { ...styles.formContainer, width: '100%', padding: '15px' };
    styles.imageContainer = { ...styles.imageContainer, width: '100%', height: '20vh' };
    styles.formCol = { ...styles.formCol, flex: '1 0 100%' };
    styles.formCol3 = { ...styles.formCol3, flex: '1 0 100%' };
  }

  return (
    <div style={styles.container}>
      {/* Left side - Image */}
      <div style={styles.imageContainer}>
        <img 
          src="/logo.jpg" 
          alt="Signup Illustration"
          style={styles.image}
        />
      </div>

      {/* Right side - Signup Form */}
      <div style={styles.formContainer}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join us today to make a difference</p>
          </div>
          
          <div style={styles.formCard}>
            <div style={styles.formBox}>
              <div style={styles.tabContainer}>
                <div style={styles.tabGroup}>
                  <button 
                    style={{...styles.tab, ...(type === 'receiver' ? styles.activeTab : styles.inactiveTab)}}
                    onClick={() => handleTypeChange('receiver')}
                    disabled={isFlipping}
                    type="button"
                  >
                    Receiver
                  </button>
                  <button 
                    style={{...styles.tab, ...(type === 'donor' ? styles.activeTab : styles.inactiveTab)}}
                    onClick={() => handleTypeChange('donor')}
                    disabled={isFlipping}
                    type="button"
                  >
                    Donor
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} style={styles.formContent}>
                {/* Common Form Fields for Both User Types */}
                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Full Name</label>
                      <div style={styles.inputGroup}>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          style={styles.input}
                          placeholder="Enter your full name"
                          onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.formCol}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Mobile Number</label>
                      <div style={styles.inputGroup}>
                        <input
                          type="text"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          style={styles.input}
                          placeholder="Enter your mobile number"
                          onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formCol}>
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
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {type === 'receiver' && (
                    <div style={styles.formCol}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          style={styles.select}
                          onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          required
                        >
                          <option value="">--Select Gender--</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {type === 'donor' && (
                    <div style={styles.formCol}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Donor Type</label>
                        <div style={styles.radioGroup}>
                          <label style={styles.radioLabel}>
                            <input
                              type="radio"
                              name="donorType"
                              value="individual"
                              checked={donorType === 'individual'}
                              onChange={() => setDonorType('individual')}
                              style={styles.radio}
                            />
                            Individual
                          </label>
                          <label style={styles.radioLabel}>
                            <input
                              type="radio"
                              name="donorType"
                              value="organization"
                              checked={donorType === 'organization'}
                              onChange={() => setDonorType('organization')}
                              style={styles.radio}
                            />
                            Organization
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Password</label>
                      <div style={styles.inputGroup}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={styles.input}
                          placeholder="Create a password"
                          onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          required
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
                  </div>
                  
                  <div style={styles.formCol}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Confirm Password</label>
                      <div style={styles.inputGroup}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={styles.input}
                          placeholder="Confirm your password"
                          onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                          required
                        />
                        <button 
                          type="button" 
                          onClick={toggleConfirmPasswordVisibility}
                          style={styles.passwordToggle}
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional fields based on user type and donor type */}
                {type === 'donor' && (
                  <>
                    {donorType === 'individual' && (
                      <div style={styles.formRow}>
                        <div style={styles.formCol}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Gender</label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              style={styles.select}
                              onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                              onBlur={(e) => e.target.style.boxShadow = 'none'}
                              required
                            >
                              <option value="">--Select Gender--</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                        <div style={styles.formCol}>
                          <div style={styles.formGroup}>
                            <label style={styles.label}>Upload Images (Max 3)</label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              style={styles.fileInput}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {donorType === 'organization' && (
                      <>
                        <div style={styles.formRow}>
                          <div style={styles.formCol}>
                            <div style={styles.formGroup}>
                              <label style={styles.label}>Organization Name</label>
                              <div style={styles.inputGroup}>
                                <input
                                  type="text"
                                  value={organizationName}
                                  onChange={(e) => setOrganizationName(e.target.value)}
                                  style={styles.input}
                                  placeholder="Enter organization name"
                                  onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div style={styles.formCol}>
                            <div style={styles.formGroup}>
                              <label style={styles.label}>Portfolio Link</label>
                              <div style={styles.inputGroup}>
                                <input
                                  type="text"
                                  value={portfolio}
                                  onChange={(e) => setPortfolio(e.target.value)}
                                  style={styles.input}
                                  placeholder="Enter portfolio link (optional)"
                                  onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={styles.formRow}>
                          <div style={styles.formCol}>
                            <div style={styles.formGroup}>
                              <label style={styles.label}>Additional Information</label>
                              <textarea
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                style={styles.textarea}
                                placeholder="Brief description (optional)"
                                onFocus={(e) => e.target.style.boxShadow = styles.inputFocus.boxShadow}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                              />
                            </div>
                          </div>
                          <div style={styles.formCol}>
                            <div style={styles.formGroup}>
                              <label style={styles.label}>Upload Images (Max 3)</label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={styles.fileInput}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                
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
                  Create Account
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
                Already have an account?{' '}
                <a 
                  href="/login" 
                  style={styles.link}
                  onMouseOver={(e) => e.target.style.textDecoration = styles.linkHover.textDecoration}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign in
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

// Add CSS for keyframe animations
if (!document.getElementById('signup-animations')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "signup-animations";
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
}

export default Signup;