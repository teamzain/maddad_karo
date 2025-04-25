import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  useEffect(() => {
    // Check user session and type
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
    
    // Only fetch data when ID is available
    if (id) {
      fetchRequestDetails();
    }
    
    // Add event listener for responsive behavior
    window.addEventListener('resize', handleResize);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [id]);
  
  const handleResize = () => {
    // This is just to trigger re-render on resize for responsive behavior
    // You can add actual logic here if needed
  };
  
  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch the donation request details
      const { data: requestData, error: requestError } = await supabase
        .from('donation_request')
        .select('*')
        .eq('id', id)
        .single();
      
      if (requestError) throw requestError;
      
      // Fetch donations total for this request
      const { data: donationsData, error: donationsError } = await supabase
        .from('donated')
        .select('donated_amount')
        .eq('request_id', id);
      
      if (donationsError) throw donationsError;
      
      // Calculate total donated amount
      const total = donationsData.reduce(
        (sum, donation) => sum + parseFloat(donation.donated_amount || 0),
        0
      );
      
      setRequestData(requestData);
      setTotalDonated(total);
      
    } catch (error) {
      console.error('Error fetching request details:', error);
      setError('Failed to load request details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate progress
  const calculateProgress = () => {
    if (!requestData) return 0;
    const requestedAmount = parseFloat(requestData.requested_amount || 0);
    return requestedAmount > 0 
      ? Math.min(100, Math.round((totalDonated / requestedAmount) * 100))
      : 0;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleDonateClick = () => {
    setShowDonationPopup(true);
  };
  
  const handleCloseDonationPopup = () => {
    setShowDonationPopup(false);
    setDonationAmount('');
  };
  
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const donor = JSON.parse(localStorage.getItem('user'));
      
      if (!donor) {
        alert('You must be logged in to donate');
        setIsProcessing(false);
        return;
      }
      
      // Insert into donated table
      const { error } = await supabase
        .from('donated')
        .insert({ 
          receiver_id: requestData.user_id,
          donor_id: donor.id,
          donated_amount: parseFloat(donationAmount),
          request_id: id
        });
        
      if (error) {
        console.error('Detailed error:', error);
        throw error;
      }
      
      // Show success notification and close donation popup
      setShowDonationPopup(false);
      setShowSuccessNotification(true);
      setDonationAmount('');
      
      // Hide success notification after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      
      // Refresh the request details to update the total donated amount
      fetchRequestDetails();
      
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'white',
        fontFamily: '"Nunito Sans", sans-serif',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            display: 'inline-block',
            height: '3rem',
            width: '3rem',
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: '#10b981',
            borderRightColor: 'transparent',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#4b5563', fontSize: '18px', fontWeight: '500' }}>Loading request details...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem', margin: '0 auto' }}>
          <div style={{ 
            backgroundColor: '#fee2e2', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ color: '#dc2626', fontSize: '16px' }}>{error}</p>
          </div>
          <button 
            onClick={handleBack}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4b5563',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4b5563'}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // Not found state
  if (!requestData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem', margin: '0 auto' }}>
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ color: '#b45309', fontSize: '16px' }}>Request not found or has been removed.</p>
          </div>
          <button 
            onClick={handleBack}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4b5563',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4b5563'}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // Main content
  return (
    <div style={{ 
      backgroundColor: '#f3f4f6', 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Success Notification */}
      {showSuccessNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#059669',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '400px',
          animation: 'slideIn 0.5s ease'
        }}>
          <div style={{ marginRight: '15px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontWeight: '600' }}>Thank you for your donation!</h4>
            <p style={{ margin: '0', fontSize: '14px' }}>Your support makes a difference.</p>
          </div>
          <button onClick={() => setShowSuccessNotification(false)} style={{
            background: 'none',
            border: 'none',
            color: 'white',
            marginLeft: 'auto',
            cursor: 'pointer',
            padding: '5px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <style>
            {`
              @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}

      {/* Donation Popup */}
      {showDonationPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            animation: 'scaleIn 0.3s ease'
          }}>
            <button 
              onClick={handleCloseDonationPopup}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ×
            </button>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#111827', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Make a Donation
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#4b5563', 
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              Your generosity helps <strong>{requestData.user_name || 'someone'}</strong> reach their goal of ${requestData.requested_amount}.
            </p>
            <form onSubmit={handleDonationSubmit}>
              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="donationAmount" style={{ 
                  display: 'block', 
                  color: '#374151', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Donation Amount ($)
                </label>
                <input
                  type="number"
                  id="donationAmount"
                  style={{ 
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  required
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    opacity: isProcessing ? 0.7 : 1,
                    fontSize: '16px',
                    width: '100%',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => !isProcessing && (e.target.style.backgroundColor = '#047857')}
                  onMouseOut={(e) => !isProcessing && (e.target.style.backgroundColor = '#059669')}
                >
                  {isProcessing ? 'Processing...' : 'Confirm Donation'}
                </button>
              </div>
            </form>
          </div>
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes scaleIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Back button */}
        <button 
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#4b5563',
            marginBottom: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            fontWeight: '500',
            fontSize: '16px',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = '#111827'}
          onMouseOut={(e) => e.target.style.color = '#4b5563'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 9H17a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Fundraisers
        </button>
        
        <div style={{ 
          backgroundColor: 'white', 
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', 
          borderRadius: '16px', 
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {/* Image Banner */}
          <div style={{ position: 'relative', height: '20rem', width: '100%', backgroundColor: '#e5e7eb' }}>
            {requestData.cover_urls ? (
              <img 
                src={requestData.cover_urls} 
                alt={requestData.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = "/api/placeholder/1200/600";
                  e.target.alt = "Image not available";
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                <p style={{ color: '#9ca3af' }}>No image available</p>
              </div>
            )}
            
            {/* Category tag */}
            {requestData.category && (
              <div style={{ 
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                {requestData.category}
              </div>
            )}
          </div>

          {/* Main Content Area - Title and Two Column Layout */}
          <div style={{ padding: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '1rem'
            }}>{requestData.title}</h1>
            
            {/* Two column layout */}
            <div style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: '2rem',
            }}>
              {/* Left column - 60% width */}
              <div style={{ 
                flex: '3',
                order: window.innerWidth < 768 ? 2 : 1
              }}>
                {/* Description */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>About this fundraiser</h2>
                  <div style={{ 
                    color: '#4b5563', 
                    fontSize: '1rem', 
                    lineHeight: '1.7',
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p style={{ whiteSpace: 'pre-line' }}>{requestData.description}</p>
                  </div>
                </div>
                
                {/* Meta Information - Grid */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Fundraiser Details</h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(2, 1fr)', 
                    gap: '1rem' 
                  }}>
                    <div style={{ 
                      backgroundColor: '#f9fafb', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Created by</h3>
                      <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.user_name || 'Anonymous'}</p>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#f9fafb', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Created on</h3>
                      <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{formatDate(requestData.created_at)}</p>
                    </div>
                    
                    {requestData.location && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Location</h3>
                        <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.location}</p>
                      </div>
                    )}
                    
                    {requestData.postal_code && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Postal Code</h3>
                        <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.postal_code}</p>
                      </div>
                    )}
                    
                    {requestData.contact_email && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Contact Email</h3>
                        <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.contact_email}</p>
                      </div>
                    )}
                    
                    {requestData.contact_phone && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Contact Phone</h3>
                        <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.contact_phone}</p>
                      </div>
                    )}
                    
                    {requestData.status && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Status</h3>
                        <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.status}</p>
                      </div>
                    )}
                    
                    {requestData.verify && (
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Verification Status</h3>
                        <p style={{ color: '#111827', fontWeight: '600', fontSize: '1rem' }}>{requestData.verify}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Share buttons */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#4b5563', fontWeight: '600', fontSize: '1.125rem', marginBottom: '1rem' }}>Share this fundraiser</h3>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ 
                      padding: '0.75rem',
                      backgroundColor: '#1877f2',
                      borderRadius: '9999px',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                    </button>
                    <button style={{ 
                      padding: '0.75rem',
                      backgroundColor: '#1da1f2',
                      borderRadius: '9999px',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button style={{ 
                      padding: '0.75rem',
                      backgroundColor: '#25d366',
                      borderRadius: '9999px',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.68 1.1 5.09 2.85 6.82l-0.72 2.59L7 20.25a9.859 9.859 0 0 0 5.04 1.38h0.01c5.45 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2zm0 18.08h-0.01a8.186 8.186 0 0 1-4.2-1.15l-0.3-0.18-3.12.82.83-3.04-0.2-0.31a8.132 8.132 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.21 8.23z"/>
                        <path d="M17.15 14.86c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31s-.86.85-.86 2.07c0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.22-.16-.47-.28z"/>
                      </svg>
                    </button>
                    <button style={{ 
                      padding: '0.75rem',
                      backgroundColor: '#4b5563',
                      borderRadius: '9999px',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right column - 40% width */}
              <div style={{ 
                flex: '2',
                order: window.innerWidth < 768 ? 1 : 2
              }}>
                {/* Donation Card */}
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e5e7eb',
                  position: 'sticky',
                  top: '20px'
                }}>
                  {/* Progress section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem' 
                    }}>
                      <div>
                        <span style={{ 
                          fontSize: '2rem', 
                          fontWeight: '700', 
                          color: '#059669',
                          display: 'block'
                        }}>
                          ${totalDonated.toFixed(2)}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          raised of ${requestData.requested_amount} goal
                        </span>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: '#ecfdf5', 
                        color: '#059669', 
                        fontWeight: '600',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                      }}>
                        {calculateProgress()}% 
                      </div>
                    </div>
                    
                    {/* Progress bar with animation */}
                    <div style={{ 
                      width: '100%', 
                      height: '0.75rem', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '9999px', 
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        backgroundColor: '#10b981', 
                        borderRadius: '9999px', 
                        width: `${calculateProgress()}%`,
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Donate button - only show for donors */}
                  {userType === 'donor' && (
                    <button 
                      onClick={handleDonateClick}
                      style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: '1.5rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#047857';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#059669';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Donate Now
                    </button>
                  )}
                  
                  {/* FAQ section */}
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                      Frequently Asked Questions
                    </h3>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                        How can I be sure this is legitimate?
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                        All fundraisers on our platform undergo a verification process. This fundraiser's status is <strong>{requestData.verify || 'Pending'}</strong>.
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                        When will the recipient receive my donation?
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                        Donations are transferred to the recipient within 3-5 business days after they are made.
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                        Is my donation tax-deductible?
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                        Please consult with a tax professional regarding the deductibility of your donation.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Recent activity card (optional addition) */}
                {/* <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e5e7eb',
                  marginTop: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                    Recent Activity
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>Fundraiser created</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>{formatDate(requestData.created_at)}</p>
                      </div>
                    </div>
                    
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: '#ecfdf5',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#059669'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>Anonymous donated $50</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>1 day ago</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: '#ecfdf5',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#059669'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>John D. donated $25</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default RequestDetail;