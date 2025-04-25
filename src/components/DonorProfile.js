import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path if needed
import DonorSetup from './DonorSetup.js';

const DonorProfile = () => {
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [donorData, setDonorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [cardHover, setCardHover] = useState(false);

  useEffect(() => {
    // Get user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      fetchDonorData(user.id);
      fetchUserData(user.id);
      fetchTotalDonations(user.id);
    } else {
      setLoading(false);
      setError("User not logged in");
    }
  }, []);

  const fetchDonorData = async (id) => {
    try {
      const { data, error } = await supabase
        .from('donor_data')
        .select('*')
        .eq('donor_id', id)
        .single();

      if (error) {
        console.error('Error fetching donor data:', error);
        // If no data found, it's not necessarily an error for a new user
        if (error.code === 'PGRST116') {
          setDonorData(null);
        } else {
          setError("Error fetching profile data");
        }
      } else {
        setDonorData(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Something went wrong fetching your profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const { data, error } = await supabase
        .from('ngo_user')
        .select('name, email, mobile_number, organization_name, gender')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setError("Error fetching user information");
      } else {
        setUserData(data);
      }
    } catch (err) {
      console.error('User data fetch error:', err);
      setError("Something went wrong fetching your user information");
    }
  };

  const fetchTotalDonations = async (id) => {
    try {
      const { data, error } = await supabase
        .from('donated')
        .select('donated_amount')
        .eq('donor_id', id);

      if (error) {
        console.error('Error fetching donation data:', error);
      } else {
        // Calculate total donation amount
        const total = data.reduce((sum, donation) => sum + parseFloat(donation.donated_amount || 0), 0);
        setTotalDonations(total);
      }
    } catch (err) {
      console.error('Donation data fetch error:', err);
    }
  };

  const handleProfileUpdated = () => {
    setShowSetupForm(false);
    if (userId) {
      fetchDonorData(userId);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        fontSize: '18px',
        color: '#1A685B'
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          border: '3px solid rgba(26, 104, 91, 0.3)',
          borderRadius: '50%',
          borderTopColor: '#1A685B',
          animation: 'spin 1s ease-in-out infinite',
          marginRight: '10px'
        }}></div>
        Loading profile data...
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    }}>
      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#E76F51', 
          padding: '10px 20px', 
          borderRadius: '5px',
          marginBottom: '15px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {error}
        </div>
      )}

      {showSetupForm ? (
        <DonorSetup 
          existingData={donorData} 
          userId={userId}
          onProfileUpdated={handleProfileUpdated} 
          onCancel={() => setShowSetupForm(false)}
        />
      ) : (
        <div>
          {/* Profile Card Section */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: cardHover 
                ? '0 15px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(26, 104, 91, 0.2)' 
                : '0 5px 20px rgba(0,0,0,0.08)',
              marginBottom: '30px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              transform: cardHover ? 'translateY(-5px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            {/* Header with gradient background */}
            <div style={{
              background: 'linear-gradient(135deg, #1A685B 0%, #E39A04 100%)',
              height: '150px',
              position: 'relative',
            }}>
              {/* Animated background circles */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                animation: 'floatBubble 8s infinite ease-in-out'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '15%',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                animation: 'floatBubble 6s infinite ease-in-out 1s'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '20%',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                animation: 'floatBubble 10s infinite ease-in-out 2s'
              }}></div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px 25px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: '500',
                  opacity: '0.95',
                }}>
                  <span style={{ 
                    marginRight: '8px', 
                    fontSize: '18px' 
                  }}>📊</span>
                  Dashboard
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: '500',
                  opacity: '0.95',
                }}>
                  <span style={{
                    marginRight: '8px',
                    fontSize: '18px'
                  }}>🔔</span>
                  Notifications
                </div>
              </div>
            </div>
            
            {/* Profile Image */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '-75px',
            }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '5px solid white',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                transform: cardHover ? 'scale(1.05)' : 'scale(1)',
              }}>
                {donorData?.profile_image ? (
                  <img 
                    src={donorData.profile_image} 
                    alt="Donor Profile" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                    color: '#1A685B',
                    fontWeight: 'bold'
                  }}>
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
            </div>
            
            {/* User Information */}
            <div style={{
              textAlign: 'center',
              padding: '10px 20px 30px',
            }}>
              <h2 style={{
                margin: '10px 0 5px',
                fontSize: '28px',
                fontWeight: '600',
                color: '#333',
              }}>
                {userData?.name || 'Donor Name'}
              </h2>
              
              <p style={{
                margin: '0 0 15px',
                color: '#666',
                fontSize: '16px',
              }}>
                {userData?.organization_name ? `${userData.organization_name}, ` : ''}
                {donorData?.location || 'Location not specified'}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '15px 0',
              }}>
                <p style={{
                  margin: '0',
                  padding: '5px 15px',
                  backgroundColor: 'rgba(26, 104, 91, 0.1)',
                  color: '#1A685B',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease',
                  cursor: 'default',
                }}>
                  {userData?.email || 'Email not available'}
                </p>
              </div>
              
              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px auto',
                maxWidth: '500px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  flex: '1',
                  minWidth: '120px',
                  textAlign: 'center',
                  padding: '15px',
                  transition: 'transform 0.2s ease',
                }}>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: '#E39A04',
                  }}>
                   Rs{totalDonations.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#777',
                  }}>
                    Total Donations
                  </div>
                </div>
                
                <div style={{
                  flex: '1',
                  minWidth: '120px',
                  textAlign: 'center',
                  padding: '15px',
                  transition: 'transform 0.2s ease',
                }}>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: '#E39A04',
                  }}>
                    {donorData?.skills ? donorData.skills.split(',').length : '0'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#777',
                  }}>
                    Skills
                  </div>
                </div>
                
                <div style={{
                  flex: '1',
                  minWidth: '120px',
                  textAlign: 'center',
                  padding: '15px',
                  transition: 'transform 0.2s ease',
                }}>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: '#E39A04',
                  }}>
                    {donorData?.projects_count || '0'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#777',
                  }}>
                    Projects
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSetupForm(true)}
                style={{ 
                  padding: '10px 24px', 
                  backgroundColor: '#1A685B', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: '0 4px 10px rgba(26, 104, 91, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '10px',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#155a4e';
                  e.target.style.boxShadow = '0 6px 12px rgba(26, 104, 91, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#1A685B';
                  e.target.style.boxShadow = '0 4px 10px rgba(26, 104, 91, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {donorData ? 'Edit Profile' : 'Setup Profile'}
              </button>
            </div>
          </div>
          
          {/* About Section */}
          <div style={{
            animation: 'fadeInUp 0.5s ease-out',
          }}>
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '25px 30px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(26, 104, 91, 0.04)',
                borderRadius: '0 0 0 100%',
              }}></div>
              
              <h3 style={{
                margin: '0 0 15px',
                color: '#1A685B',
                fontSize: '22px',
                fontWeight: '600',
                position: 'relative',
                display: 'inline-block',
              }}>
                About
                <span style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '0',
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(to right, #1A685B, #E39A04)',
                  borderRadius: '10px',
                }}></span>
              </h3>
              
              <div style={{
                position: 'relative',
                zIndex: '1',
              }}>
                <p style={{
                  margin: '15px 0 20px',
                  color: '#444',
                  lineHeight: '1.7',
                  fontSize: '16px',
                  textAlign: 'justify',
                }}>
                  {donorData?.about || 'No information provided. Tell others about yourself, your interests, and why you support this cause.'}
                </p>
                
                {/* Why I Donate section - only shown when profile has an about */}
                {donorData?.about && (
                  <div style={{
                    marginTop: '25px',
                    padding: '20px',
                    backgroundColor: 'rgba(227, 154, 4, 0.05)',
                    borderRadius: '10px',
                    position: 'relative',
                  }}>
                    <h4 style={{
                      margin: '0 0 15px',
                      fontSize: '18px',
                      color: '#E39A04',
                      fontWeight: '500',
                    }}>
                      Why I Donate
                    </h4>
                    
                    <p style={{
                      margin: '0',
                      color: '#555',
                      lineHeight: '1.6',
                      fontSize: '15px',
                    }}>
                      I believe in making a positive impact in our community and supporting causes that align with my values. Through donations and volunteering, I hope to contribute to meaningful change.
                    </p>
                  </div>
                )}
                
                {/* Call to action for users without about info */}
                {!donorData?.about && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '30px',
                    padding: '25px',
                    backgroundColor: 'rgba(26, 104, 91, 0.05)',
                    borderRadius: '12px',
                    borderLeft: '4px solid #1A685B',
                  }}>
                    <span style={{
                      fontSize: '40px',
                      marginBottom: '15px',
                    }}>✏️</span>
                    <h4 style={{
                      margin: '0 0 10px',
                      color: '#1A685B',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}>
                      Complete Your Profile
                    </h4>
                    <p style={{
                      margin: '0 0 20px',
                      color: '#666',
                      textAlign: 'center',
                      fontSize: '15px',
                      maxWidth: '400px',
                    }}>
                      Tell your story and share what motivates you to support causes. A complete profile helps connect you with like-minded organizations.
                    </p>
                    <button
                      onClick={() => setShowSetupForm(true)}
                      style={{
                        backgroundColor: '#1A685B',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(26, 104, 91, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#155a4e';
                        e.target.style.boxShadow = '0 6px 12px rgba(26, 104, 91, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#1A685B';
                        e.target.style.boxShadow = '0 4px 8px rgba(26, 104, 91, 0.2)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Add Your Story
                    </button>
                  </div>
                )}
                
                {/* Premium Supporter badge - only shown when profile is complete */}
                {donorData?.about && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    marginTop: '30px',
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(26, 104, 91, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}>
                      🏆
                    </div>
                    <div>
                      <h5 style={{
                        margin: '0 0 5px',
                        fontSize: '16px',
                        color: '#333',
                      }}>
                        Premium Supporter
                      </h5>
                      <p style={{
                        margin: '0',
                        fontSize: '14px',
                        color: '#777',
                      }}>
                        Thank you for your continued support!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Global animations and Media Queries for responsiveness */}
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
          
          @keyframes floatBubble {
            0% { transform: translate(0, 0); }
            50% { transform: translate(10px, -10px); }
            100% { transform: translate(0, 0); }
          }
          
          /* Media Queries for Responsiveness */
          @media (max-width: 768px) {
            h2 {
              font-size: 24px !important;
            }
            
            h3 {
              font-size: 20px !important;
            }
          }
          
          @media (max-width: 480px) {
            h2 {
              font-size: 22px !important;
            }
            
            h3 {
              font-size: 18px !important;
            }
            
            .stats-container {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DonorProfile;