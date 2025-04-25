import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { FiHome, FiClock, FiCheckCircle, FiXCircle, FiCheckSquare, FiPlus, FiChevronDown, FiChevronUp, FiMenu, FiX } from 'react-icons/fi';

const ReceiverDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStats, setRequestStats] = useState({
    totalRequests: 0,
    verifiedRequests: 0,
    totalDonations: 0
  });
  const [activeTab, setActiveTab] = useState('inProgress');
  const [requests, setRequests] = useState({
    inProgress: [],
    verified: [],
    rejected: [],
    completed: []
  });
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Custom color palette
  const colors = {
    primary: '#1A685B',        // Primary green
    secondary: '#e6f7f4',      // Light green background
    accent: '#FFAC00',         // Accent orange
    success: '#2C9E7E',        // Success green
    warning: '#FFAC00',        // Warning orange (same as accent)
    danger: '#E74C3C',         // Danger red
    dark: '#2C3E50',           // Dark text
    light: '#FFFFFF',          // Light background
    gray: '#6c757d',           // Gray text
    background: '#F8F9FA'      // Page background
  };

  useEffect(() => {
    // Check if user is logged in and is a receiver
    const storedUser = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!storedUser || userType !== 'receiver') {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    fetchRequestStats(userData.id);
    fetchRequests(userData.id);

    // Responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initialize on first load
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const fetchRequestStats = async (userId) => {
    try {
      setLoading(true);
      
      // Fetch total number of requests
      const { data: totalRequestsData, error: totalError } = await supabase
        .from('donation_request')
        .select('id')
        .eq('user_id', userId);
        
      if (totalError) throw totalError;
      
      // Fetch verified requests
      const { data: verifiedRequestsData, error: verifiedError } = await supabase
        .from('donation_request')
        .select('id')
        .eq('user_id', userId)
        .eq('verify', 'verified');
        
      if (verifiedError) throw verifiedError;
      
      // Fetch total donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donated')
        .select('donated_amount')
        .eq('receiver_id', userId);
        
      if (donationsError) throw donationsError;
      
      // Calculate total donation amount
      const totalDonations = donationsData.reduce(
        (sum, donation) => sum + parseFloat(donation.donated_amount || 0), 
        0
      );
      
      setRequestStats({
        totalRequests: totalRequestsData.length,
        verifiedRequests: verifiedRequestsData.length,
        totalDonations: totalDonations.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching request stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (userId) => {
    try {
      // Get all requests for the user
      const { data: allRequests, error: requestsError } = await supabase
        .from('donation_request')
        .select('*')
        .eq('user_id', userId);
        
      if (requestsError) throw requestsError;
      
      // Get all donations for the user's requests
      const donationsPromises = allRequests.map(async (request) => {
        const { data: donationsData, error: donationsError } = await supabase
          .from('donated')
          .select('donated_amount')
          .eq('request_id', request.id);
          
        if (donationsError) throw donationsError;
        
        const totalDonated = donationsData.reduce(
          (sum, donation) => sum + parseFloat(donation.donated_amount || 0),
          0
        );
        
        return {
          ...request,
          totalDonated
        };
      });
      
      const requestsWithDonations = await Promise.all(donationsPromises);
      
      // Categorize requests
      const inProgress = requestsWithDonations.filter(req => req.verify === 'pending');
      const verified = requestsWithDonations.filter(req => req.verify === 'verified' && 
                                                 req.totalDonated < parseFloat(req.requested_amount));
      const rejected = requestsWithDonations.filter(req => req.verify === 'rejected');
      const completed = requestsWithDonations.filter(req => req.verify === 'verified' && 
                                                 req.totalDonated >= parseFloat(req.requested_amount));
      
      setRequests({
        inProgress,
        verified,
        rejected,
        completed
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const toggleCardExpansion = (requestId) => {
    setExpandedCardId(expandedCardId === requestId ? null : requestId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return colors.success;
      case 'rejected':
        return colors.danger;
      case 'pending':
        return colors.warning;
      default:
        return colors.gray;
    }
  };

  const renderStatusBadge = (status) => {
    const statusLabels = {
      pending: 'In Review',
      verified: 'Verified',
      rejected: 'Rejected'
    };

    return (
      <span
        style={{
          backgroundColor: getStatusColor(status),
          color: status === 'pending' ? colors.dark : 'white',
          padding: '4px 8px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'inline-block'
        }}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  const renderRequestCard = (request) => {
    const isExpanded = expandedCardId === request.id;
    const progressPercentage = Math.min(100, (request.totalDonated / parseFloat(request.requested_amount)) * 100);
    
    return (
      <div 
        key={request.id} 
        style={{ 
          border: '1px solid #eaeaea',
          margin: '15px 0', 
          padding: '0',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          backgroundColor: colors.light,
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          style={{ 
            padding: '15px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={() => toggleCardExpansion(request.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 10px 0', color: colors.dark }}>{request.title}</h3>
            <div>
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>{renderStatusBadge(request.verify)}</div>
            <div style={{ fontSize: '14px', color: colors.gray }}>
              {request.created_at && new Date(request.created_at).toLocaleDateString()}
            </div>
          </div>
            
          {request.cover_urls && (
            <div style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden' }}>
              <img 
                src={request.cover_urls} 
                alt={`Image for ${request.title}`}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  e.target.alt = 'Image not available';
                }}
              />
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', color: colors.dark }}>
              ${request.totalDonated.toFixed(2)}
            </span>
            <span style={{ color: colors.gray }}>
              of ${request.requested_amount}
            </span>
          </div>
          
          <div style={{ 
            width: '100%',
            backgroundColor: '#e9ecef',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: getStatusColor(request.verify),
              borderRadius: '4px',
              transition: 'width 0.5s ease-in-out'
            }}></div>
          </div>
          
          {!isExpanded && (
            <p style={{ 
              margin: '10px 0 0 0',
              color: colors.gray,
              fontSize: '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {request.description}
            </p>
          )}
        </div>
        
        {isExpanded && (
          <div 
            style={{ 
              padding: '0 15px 15px 15px',
              borderTop: '1px solid #eaeaea',
              backgroundColor: '#f8f9fa'
            }}
          >
            <h4 style={{ color: colors.dark, margin: '15px 0 10px 0' }}>Category</h4>
            <p style={{ margin: '0 0 15px 0', color: colors.gray }}>{request.category}</p>
            
            <h4 style={{ color: colors.dark, margin: '0 0 10px 0' }}>Full Description</h4>
            <p style={{ margin: '0 0 15px 0', color: colors.gray, lineHeight: '1.6' }}>{request.description}</p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              backgroundColor: colors.secondary,
              padding: '15px',
              borderRadius: '8px',
              marginTop: '10px'
            }}>
              <div>
                <h5 style={{ margin: '0 0 5px 0', color: colors.dark }}>Requested</h5>
                <p style={{ margin: '0', fontWeight: 'bold', color: colors.dark }}>${request.requested_amount}</p>
              </div>
              <div>
                <h5 style={{ margin: '0 0 5px 0', color: colors.dark }}>Received</h5>
                <p style={{ margin: '0', fontWeight: 'bold', color: colors.dark }}>${request.totalDonated.toFixed(2)}</p>
              </div>
              <div>
                <h5 style={{ margin: '0 0 5px 0', color: colors.dark }}>Remaining</h5>
                <p style={{ margin: '0', fontWeight: 'bold', color: colors.dark }}>
                  ${(parseFloat(request.requested_amount) - request.totalDonated).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Sidebar tab configuration
  const tabs = [
    { id: 'inProgress', label: 'In Progress', icon: <FiClock />, count: requests.inProgress.length },
    { id: 'verified', label: 'Verified', icon: <FiCheckCircle />, count: requests.verified.length },
    { id: 'rejected', label: 'Rejected', icon: <FiXCircle />, count: requests.rejected.length },
    { id: 'completed', label: 'Completed', icon: <FiCheckSquare />, count: requests.completed.length }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      backgroundColor: colors.background,
      minHeight: '100vh'
    }}>
      {/* Sidebar */}
      <div 
        style={{ 
          width: sidebarOpen ? '250px' : '0px',
          backgroundColor: colors.primary,
          color: 'white',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          position: 'fixed',
          height: '100vh',
          zIndex: 100
        }}
      >
        <div style={{ padding: '20px' }}>
          <h2 style={{ 
            margin: '0 0 30px 0', 
            color: 'white',
            textAlign: 'center',
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiHome style={{ marginRight: '10px' }} /> Dashboard
          </h2>
          
          <div style={{ marginBottom: '40px' }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '14px', 
              margin: '0 0 10px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Welcome
            </p>
            <h3 style={{ margin: '0', fontSize: '18px' }}>{user ? user.name : 'Loading...'}</h3>
          </div>
          
          <div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '14px', 
              margin: '0 0 10px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Navigation
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 15px',
                    backgroundColor: activeTab === tab.id ? colors.accent : 'rgba(255, 255, 255, 0.1)',
                    color: activeTab === tab.id ? colors.dark : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>{tab.icon}</span>
                    {tab.label}
                  </div>
                  <span style={{ 
                    backgroundColor: activeTab === tab.id ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
              
              <button
                onClick={() => navigate('/request-funds')}
                style={{
                  padding: '12px 15px',
                  backgroundColor: colors.accent,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                <FiPlus style={{ marginRight: '5px' }} /> New Request
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '0', 
          width: '100%',
          padding: '0 20px'
        }}>
          <button 
            onClick={() => navigate('/main-dashboard')}
            style={{ 
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Main Dashboard
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div style={{ 
        flex: 1,
        padding: '20px',
        marginLeft: sidebarOpen ? '250px' : '0',
        transition: 'margin-left 0.3s ease',
        width: '100%',
        overflowX: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Toggle button inline with Dashboard title */}
              <button
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <h1 style={{ 
                margin: '0',
                color: colors.primary,
                fontSize: '28px'
              }}>
                Donation Requests
              </h1>
            </div>
          </div>
          
          {/* Stats cards */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ 
              backgroundColor: colors.light,
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderLeft: `4px solid ${colors.primary}`
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: colors.gray }}>Total Requests</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: colors.dark }}>{requestStats.totalRequests}</p>
            </div>
            
            <div style={{ 
              backgroundColor: colors.light,
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderLeft: `4px solid ${colors.success}`
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: colors.gray }}>Verified Requests</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: colors.dark }}>{requestStats.verifiedRequests}</p>
            </div>
            
            <div style={{ 
              backgroundColor: colors.light,
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderLeft: `4px solid ${colors.accent}`
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: colors.gray }}>Total Donations</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: colors.dark }}>Rs{requestStats.totalDonations}</p>
            </div>
          </div>
          
          {/* Selected tab title */}
          <div style={{ 
            backgroundColor: colors.light,
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            borderLeft: `4px solid ${
              activeTab === 'inProgress' ? colors.warning :
              activeTab === 'verified' ? colors.success :
              activeTab === 'rejected' ? colors.danger :
              colors.primary
            }`
          }}>
            {tabs.find(tab => tab.id === activeTab)?.icon}
            <h2 style={{ 
              margin: '0 0 0 10px',
              color: colors.dark,
              fontSize: '18px'
            }}>
              {tabs.find(tab => tab.id === activeTab)?.label} Requests
            </h2>
          </div>
          
          {/* Request cards */}
          <div>
            {loading ? (
              <div style={{ 
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: colors.light,
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <p>Loading requests...</p>
              </div>
            ) : requests[activeTab].length > 0 ? (
              requests[activeTab].map(request => renderRequestCard(request))
            ) : (
              <div style={{ 
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: colors.light,
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <p>No {activeTab === 'inProgress' ? 'in progress' : activeTab} requests found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;