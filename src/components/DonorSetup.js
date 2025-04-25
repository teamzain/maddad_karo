import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path if needed

const DonorSetup = ({ existingData, userId, onProfileUpdated, onCancel }) => {
  const [form, setForm] = useState({
    about: '',
    image_url: null
  });
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formHover, setFormHover] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [submitHover, setSubmitHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  useEffect(() => {
    // Populate form with existing data if available
    if (existingData) {
      setForm({
        about: existingData.about || '',
        image_url: existingData.profile_image || null
      });
      if (existingData.profile_image) {
        setPreviewUrl(existingData.profile_image);
      }
    }
  }, [existingData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (file) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase
      .storage
      .from('donor-profile-image')
      .upload(fileName, file, { upsert: true });
    
    if (error) {
      throw new Error(`Upload error: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase
      .storage
      .from('donor-profile-image')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!userId) {
        throw new Error("User not logged in");
      }
      
      // Upload profile image if one was selected
      let profileImageUrl = form.image_url;
      if (profileFile) {
        profileImageUrl = await uploadProfileImage(profileFile);
      }
      
      const donorData = {
        donor_id: userId,
        about: form.about,
        profile_image: profileImageUrl
      };
      
      // If we have existing data, update it; otherwise insert new record
      let result;
      if (existingData) {
        result = await supabase
          .from('donor_data')
          .update(donorData)
          .eq('donor_id', userId);
      } else {
        result = await supabase
          .from('donor_data')
          .insert([donorData]);
      }
      
      if (result.error) {
        throw new Error(`Database error: ${result.error.message}`);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onProfileUpdated();
      }, 1500);
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: formHover 
        ? '0 15px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(26, 104, 91, 0.2)' 
        : '0 5px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      transform: formHover ? 'translateY(-5px)' : 'translateY(0)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    }}
    onMouseEnter={() => setFormHover(true)}
    onMouseLeave={() => setFormHover(false)}
    >
      {/* Header with gradient background */}
      <div style={{
        background: 'linear-gradient(135deg, #1A685B 0%, #E39A04 100%)',
        margin: '-20px -20px 20px -20px',
        padding: '25px 30px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background circles */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          animation: 'floatBubble 8s infinite ease-in-out'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          animation: 'floatBubble 6s infinite ease-in-out 1s'
        }}></div>
        
        <h2 style={{
          margin: '0',
          fontSize: '28px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: '1',
        }}>
          <span style={{ marginRight: '12px', fontSize: '24px' }}>
            {existingData ? '✏️' : '✨'}
          </span>
          {existingData ? 'Edit Your Donor Profile' : 'Create Your Donor Profile'}
        </h2>
        <p style={{
          margin: '10px 0 0',
          opacity: '0.85',
          fontSize: '16px',
          maxWidth: '600px',
          position: 'relative',
          zIndex: '1',
        }}>
          Tell your story to connect with causes that matter to you
        </p>
      </div>

      {/* Success message with animation */}
      {success && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            animation: 'scaleIn 0.5s ease-out',
          }}>
            <span style={{ color: 'white', fontSize: '40px' }}>✓</span>
          </div>
          <h3 style={{ 
            color: '#333', 
            margin: '0 0 10px', 
            fontSize: '24px',
            animation: 'fadeInUp 0.5s ease-out 0.3s both'
          }}>
            Profile Updated Successfully!
          </h3>
          <p style={{ 
            color: '#666', 
            textAlign: 'center',
            animation: 'fadeInUp 0.5s ease-out 0.5s both'
          }}>
            Redirecting to your profile...
          </p>
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#E76F51', 
          padding: '15px 20px', 
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          animation: 'shakeX 0.5s ease-in-out'
        }}>
          <span style={{ marginRight: '10px', fontSize: '20px' }}>⚠️</span>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Profile Picture Section */}
        <div style={{ 
          marginBottom: '30px',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            color: '#1A685B',
            fontSize: '16px',
            fontWeight: '600',
          }}>
            Profile Picture
          </label>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: 'rgba(245, 245, 245, 0.5)',
            borderRadius: '10px',
            border: '1px dashed rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(245, 245, 245, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(26, 104, 91, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(245, 245, 245, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
          }}
          >
            {previewUrl ? (
              <div style={{ 
                position: 'relative', 
                marginBottom: '20px',
                transition: 'transform 0.3s ease',
                transform: activeField === 'image' ? 'scale(1.05)' : 'scale(1)',
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  border: '5px solid white',
                }}>
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  backgroundColor: '#E39A04',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '16px' }}>✏️</span>
                </div>
              </div>
            ) : (
              <div style={{ 
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                border: '5px solid white',
                fontSize: '50px',
                color: '#ccc',
              }}>
                <span>👤</span>
              </div>
            )}
            
            <label htmlFor="profile-upload" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              backgroundColor: '#1A685B',
              color: 'white',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#155a4e';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              setActiveField('image');
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1A685B';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
              setActiveField(null);
            }}
            >
              <span style={{ marginRight: '8px' }}>📷</span>
              {previewUrl ? 'Change Photo' : 'Upload Photo'}
            </label>
            <input 
              id="profile-upload"
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            
            <p style={{ 
              margin: '15px 0 0', 
              fontSize: '14px', 
              color: '#666',
              textAlign: 'center',
            }}>
              Recommended: Square image, at least 300x300 pixels
            </p>
          </div>
        </div>
        
        {/* About Section */}
        <div style={{ 
          marginBottom: '25px',
          animation: 'fadeInUp 0.5s ease-out 0.2s both',
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            color: '#1A685B',
            fontSize: '16px',
            fontWeight: '600',
          }}>
            About Me
          </label>
          
          <div style={{
            position: 'relative',
          }}>
            <textarea 
              value={form.about} 
              onChange={(e) => setForm({ ...form, about: e.target.value })} 
              rows="5"
              placeholder="Tell us about yourself, your background, expertise, and why you want to donate..."
              style={{ 
                width: '100%', 
                padding: '15px',
                fontSize: '15px',
                border: activeField === 'about' 
                  ? '2px solid #1A685B' 
                  : '1px solid #ddd',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: activeField === 'about'
                  ? '0 0 0 3px rgba(26, 104, 91, 0.1)'
                  : 'none',
                lineHeight: '1.6',
                resize: 'vertical',
              }}
              onFocus={() => setActiveField('about')}
              onBlur={() => setActiveField(null)}
            />
            <div style={{
              position: 'absolute',
              right: '15px',
              bottom: '15px',
              fontSize: '14px',
              color: '#999',
            }}>
              {form.about.length} / 500
            </div>
          </div>
          <p style={{ 
            margin: '8px 0 0', 
            fontSize: '14px', 
            color: '#666',
          }}>
            A compelling bio helps NGOs understand your motivations and expertise
          </p>
        </div>
        
        {/* Buttons - UPDATED for better responsiveness */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '20px',
          animation: 'fadeInUp 0.5s ease-out 0.4s both',
          gap: '15px', // Add gap between buttons
        }}
        className="buttons-container" // Add a class for media query targeting
        >
          <button 
            type="button" 
            onClick={onCancel}
            style={{ 
              padding: '12px 25px', 
              backgroundColor: cancelHover ? '#e9ecef' : '#f8f9fa', 
              border: '1px solid #ddd',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              color: '#495057',
              transition: 'all 0.3s ease',
              boxShadow: cancelHover ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
              transform: cancelHover ? 'translateY(-2px)' : 'translateY(0)',
              minWidth: '120px', // Ensure minimum width
              whiteSpace: 'nowrap', // Prevent text wrapping
            }}
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            className="cancel-button" // Add class for specific targeting
          >
            <span style={{ marginRight: '8px' }}>✖️</span>
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 25px', 
              backgroundColor: submitHover ? '#155a4e' : '#1A685B', 
              border: 'none',
              borderRadius: '30px',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              color: 'white',
              transition: 'all 0.3s ease',
              boxShadow: submitHover ? '0 4px 10px rgba(26, 104, 91, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
              transform: submitHover ? 'translateY(-2px)' : 'translateY(0)',
              minWidth: '120px', // Ensure minimum width
              whiteSpace: 'nowrap' // Prevent button from shrinking too much
            }}
            onMouseEnter={() => !loading && setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            className="submit-button" // Add class for specific targeting
          >
            {loading ? (
              <>
                <span style={{ 
                  display: 'inline-block',
                  width: '13px',
                  height: '18px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  borderTopColor: 'white',
                  animation: 'spin 1s ease-in-out infinite',
                  marginRight: '10px'
                }}></span>
                Saving...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>
                  {existingData ? '✅' : '✨'}
                </span>
                {existingData ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Global styles for animations and responsiveness */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.5);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes floatBubble {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes shakeX {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          /* Media queries for responsive design */
          @media (max-width: 768px) {
            .two-column-layout {
              flex-direction: column;
            }
          }
          
          @media (max-width: 600px) {
            .buttons-container {
              flex-direction: column-reverse;
              gap: 15px;
            }
            
            .cancel-button, .submit-button {
              width: 100%;
              padding: 15px !important;
            }
          }
          
          @media (max-width: 480px) {
            h2 {
              font-size: 24px !important;
            }
            
            .buttons-container {
              margin-top: 30px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DonorSetup;