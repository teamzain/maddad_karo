import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('receiver');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [receivers, setReceivers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [popupImages, setPopupImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch receivers data
      const { data: receiverData, error: receiverError } = await supabase.from('user').select('*');
      if (receiverError) {
        console.error('Error fetching receivers:', receiverError);
      } else {
        setReceivers(receiverData);
      }

      // Fetch donors data
      const { data: donorData, error: donorError } = await supabase.from('ngo_user').select('*');
      if (donorError) {
        console.error('Error fetching donors:', donorError);
      } else {
        setDonors(donorData);
      }

      // Fetch donation requests data
      // Fetch donation requests data
const { data: requestData, error: requestError } = await supabase
.from('donation_request')
.select('*');

if (requestError) {
console.error('Error fetching donation requests:', requestError);
} else {
// Fetch user data separately for each request
const requestsWithUserInfo = await Promise.all(
  requestData.map(async (request) => {
    if (request.user_id) {
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('name, email, mobile_number')
        .eq('id', request.user_id)
        .single();
      
      if (!userError && userData) {
        return {
          ...request,
          user: userData
        };
      }
    }
    return request;
  })
);
setDonationRequests(requestsWithUserInfo);
}
   
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Verify function
  const handleVerify = async (userId, type) => {
    const updatedField = { verify: 'verified' };
    const table = type === 'receiver' ? 'user' : 'ngo_user';

    const { error } = await supabase.from(table).update(updatedField).eq('id', userId);
    if (error) {
      alert(`Failed to verify ${type}.`);
    } else {
      alert(`${type} verified.`);
      fetchData();
    }
  };

  // Delete function
  const handleDelete = async (userId, type) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const table = type === 'receiver' ? 'user' : 'ngo_user';
      const { error } = await supabase.from(table).delete().eq('id', userId);
      if (error) {
        alert(`Failed to delete ${type}.`);
      } else {
        alert(`${type} deleted.`);
        fetchData();
      }
    }
  };

  // Edit function
  const handleEdit = (userId, type) => {
    const selectedUser = type === 'receiver'
      ? receivers.find((r) => r.id === userId)
      : donors.find((d) => d.id === userId);

    setFormData(selectedUser);
    setIsEditing(true);
    type === 'receiver' ? setSelectedReceiver(selectedUser) : setSelectedDonor(selectedUser);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...updatedData } = formData;

    const table = selectedReceiver ? 'user' : 'ngo_user';

    const { error } = await supabase.from(table).update(updatedData).eq('id', id);

    if (error) {
      alert('Failed to update user.');
    } else {
      alert('User updated successfully.');
      setIsEditing(false);
      setSelectedReceiver(null);
      setSelectedDonor(null);
      fetchData();
    }
  };

  // Handle donation request approval/rejection
  const handleDonationRequestUpdate = async (requestId, status) => {
    const { error } = await supabase
      .from('donation_request')
      .update({ verify: status })
      .eq('id', requestId);
    
    if (error) {
      alert(`Failed to ${status} donation request.`);
      console.error('Error updating donation request:', error);
    } else {
      alert(`Donation request ${status === 'verified' ? 'approved' : 'rejected'}.`);
      fetchData();
    }
  };

  // Handle image URL popup
  const handleImagePopup = (imageUrls) => {
    setPopupImages(imageUrls);
  };

  // Handle donation images popup
  const handleDonationImagesPopup = (imagesStr) => {
    if (imagesStr) {
      const imageArray = imagesStr.split(',');
      setPopupImages(imageArray);
    }
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Set active tab and close sidebar on mobile
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: sidebarOpen ? (isMobile ? '80%' : '250px') : '0',
        backgroundColor: '#1A685B',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        zIndex: '1000',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ 
            margin: '0', 
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#F4A502'
          }}>Admin Panel</h2>
          {isMobile && (
            <button onClick={toggleSidebar} style={{ 
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer'
            }}>
              &times;
            </button>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '20px 0'
        }}>
          <SidebarItem 
            active={activeTab === 'receiver'} 
            onClick={() => handleTabClick('receiver')} 
            icon="👥"
            text="Receivers"
          />
          <SidebarItem 
            active={activeTab === 'donor'} 
            onClick={() => handleTabClick('donor')}
            icon="🏢" 
            text="Organizations"
          />
          <SidebarItem 
            active={activeTab === 'donation_request'} 
            onClick={() => handleTabClick('donation_request')}
            icon="📋" 
            text="Donation Requests"
          />
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        flexGrow: 1,
        marginLeft: sidebarOpen ? (isMobile ? '0' : '250px') : '0',
        transition: 'margin-left 0.3s ease',
        width: sidebarOpen && !isMobile ? 'calc(100% - 250px)' : '100%',
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#f5f5f5'
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '15px 20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button 
            onClick={toggleSidebar} 
            style={{ 
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              marginRight: '15px',
              color: '#1A685B'
            }}
          >
            ☰
          </button>
          <h1 style={{ 
            margin: '0',
            fontSize: isMobile ? '20px' : '24px',
            color: '#1A685B'
          }}>Dashboard</h1>
        </div>

        {/* Content area */}
        <div style={{ padding: '20px' }}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Tabs for mobile view */}
              <div style={{ 
                display: isMobile ? 'flex' : 'none',
                marginBottom: '20px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                padding: '5px 0'
              }}>
                <TabButton 
                  active={activeTab === 'receiver'} 
                  onClick={() => setActiveTab('receiver')}
                  text="Receivers"
                />
                <TabButton 
                  active={activeTab === 'donor'} 
                  onClick={() => setActiveTab('donor')}
                  text="Organizations"
                />
                <TabButton 
                  active={activeTab === 'donation_request'} 
                  onClick={() => setActiveTab('donation_request')}
                  text="Donation Requests"
                />
              </div>

              {/* Edit form */}
              {isEditing && (
                <div style={{ 
                  marginTop: '20px', 
                  padding: '20px', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}>
                  <h2 style={{ color: '#1A685B', marginTop: '0' }}>
                    Edit {selectedReceiver ? 'Receiver' : 'Organization'}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name:</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleChange} 
                        required 
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'border 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email:</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email || ''} 
                        onChange={handleChange} 
                        required 
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'border 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mobile:</label>
                      <input 
                        type="text" 
                        name="mobile_number" 
                        value={formData.mobile_number || ''} 
                        onChange={handleChange} 
                        required 
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'border 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Gender:</label>
                      <select 
                        name="gender" 
                        value={formData.gender || ''} 
                        onChange={handleChange} 
                        required
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'border 0.3s ease',
                          outline: 'none',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Verify:</label>
                      <select 
                        name="verify" 
                        value={formData.verify || ''} 
                        onChange={handleChange} 
                        required
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'border 0.3s ease',
                          outline: 'none',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="unverified">Unverified</option>
                        <option value="verified">Verified</option>
                      </select>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password:</label>
                      <input 
                        type="text" 
                        name="password" 
                        value={formData.password || '********'} 
                        readOnly 
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          backgroundColor: '#f1f1f1',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    
                    {!selectedReceiver && (
                      <>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Organization Name:</label>
                          <input 
                            type="text" 
                            name="organization_name" 
                            value={formData.organization_name || ''} 
                            onChange={handleChange} 
                            style={{ 
                              width: '100%', 
                              padding: '10px', 
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              transition: 'border 0.3s ease',
                              outline: 'none'
                            }}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Additional Info:</label>
                          <textarea 
                            name="additional_info" 
                            value={formData.additional_info || ''} 
                            onChange={handleChange} 
                            style={{ 
                              width: '100%', 
                              padding: '10px', 
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              transition: 'border 0.3s ease',
                              outline: 'none',
                              minHeight: '100px',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Portfolio:</label>
                          <input 
                            type="text" 
                            name="portfolio" 
                            value={formData.portfolio || ''} 
                            onChange={handleChange} 
                            style={{ 
                              width: '100%', 
                              padding: '10px', 
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              transition: 'border 0.3s ease',
                              outline: 'none'
                            }}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Image URL:</label>
                          <input 
                            type="text" 
                            name="image_urls" 
                            value={formData.image_urls || ''} 
                            onChange={handleChange} 
                            style={{ 
                              width: '100%', 
                              padding: '10px', 
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              transition: 'border 0.3s ease',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </>
                    )}
                    
                    <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button 
                        type="submit"
                        style={{ 
                          backgroundColor: '#1A685B', 
                          color: 'white', 
                          padding: '12px 20px', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                          fontWeight: '500'
                        }}
                      >
                        Update
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        style={{ 
                          backgroundColor: '#f44336', 
                          color: 'white', 
                          padding: '12px 20px', 
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                          fontWeight: '500'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Receivers Tab */}
              {activeTab === 'receiver' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{ color: '#1A685B', margin: '0' }}>Receivers</h2>
                    <div style={{ 
                      backgroundColor: '#F4A502', 
                      color: 'white', 
                      borderRadius: '20px',
                      padding: '5px 15px',
                      fontWeight: '500'
                    }}>
                      Total: {receivers.length}
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    overflowX: 'auto'
                  }}>
                    <table style={{ 
                      borderCollapse: 'collapse', 
                      width: '100%',
                      minWidth: '800px'
                    }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f2f2f2' }}>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Name</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Email</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Mobile</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Gender</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Verify</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivers.map((r) => (
                          <tr key={r.id} style={{ 
                            borderBottom: '1px solid #f2f2f2',
                            transition: 'background-color 0.3s'
                          }}>
                            <td style={{ padding: '15px' }}>{r.name}</td>
                            <td style={{ padding: '15px' }}>{r.email}</td>
                            <td style={{ padding: '15px' }}>{r.mobile_number}</td>
                            <td style={{ padding: '15px' }}>{r.gender || 'Not specified'}</td>
                            <td style={{ padding: '15px' }}>
                              {r.verify === 'verified' ? (
                                <span style={{ 
                                  backgroundColor: 'rgba(26, 104, 91, 0.1)', 
                                  color: '#1A685B',
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  fontSize: '14px'
                                }}>
                                  Verified
                                </span>
                              ) : (
                                <button 
                                  onClick={() => handleVerify(r.id, 'receiver')}
                                  style={{ 
                                    backgroundColor: '#1A685B', 
                                    color: 'white', 
                                    padding: '8px 12px', 
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    fontSize: '14px'
                                  }}
                                >
                                  Verify
                                </button>
                              )}
                            </td>
                            <td style={{ padding: '15px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => handleEdit(r.id, 'receiver')}
                                  style={{ 
                                    backgroundColor: '#F4A502', 
                                    color: 'white', 
                                    padding: '8px 12px', 
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    fontSize: '14px'
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(r.id, 'receiver')}
                                  style={{ 
                                    backgroundColor: '#f44336', 
                                    color: 'white', 
                                    padding: '8px 12px', 
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    fontSize: '14px'
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {receivers.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                              No receivers found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Organizations Tab */}
              {activeTab === 'donor' && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{ color: '#1A685B', margin: '0' }}>Organizations</h2>
                    <div style={{ 
                      backgroundColor: '#F4A502', 
                      color: 'white', 
                      borderRadius: '20px',
                      padding: '5px 15px',
                      fontWeight: '500'
                    }}>
                      Total: {donors.length}
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    overflowX: 'auto'
                  }}>
                    <table style={{ 
                      borderCollapse: 'collapse', 
                      width: '100%',
                      minWidth: '1200px'
                    }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f2f2f2' }}>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Name</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Email</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Mobile</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Organization</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Portfolio</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Image</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Verify</th>
                          <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.map((d) => (
                          <tr key={d.id} style={{ 
                            borderBottom: '1px solid #f2f2f2',
                            transition: 'background-color 0.3s'
                          }}>
                            <td style={{ padding: '15px' }}>{d.name}</td>
                            <td style={{ padding: '15px' }}>{d.email}</td>
                            <td style={{ padding: '15px' }}>{d.mobile_number}</td>
                            <td style={{ padding: '15px' }}>{d.organization_name}</td>
                            <td style={{ padding: '15px' }}>
                              {d.portfolio ? (
                                <a 
                                  href={d.portfolio} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{ color: '#F4A502', textDecoration: 'none' }}
                                >
                                  View
                                </a>
                              ) : 'None'}
                            </td>
                            <td style={{ padding: '15px' }}>
                              {d.image_urls ? (
                                <button 
                                  onClick={() => handleImagePopup(JSON.parse(d.image_urls))}
                                  style={{ 
                                    backgroundColor: '#F4A502', 
                                    color: 'white', 
                                    padding: '8px 12px', 
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  // Continue from where the code was cut off (from line 1120)

                                  fontSize: '14px'
                                }}
                              >
                                View Images
                              </button>
                            ) : 'None'}
                          </td>
                          <td style={{ padding: '15px' }}>
                            {d.verify === 'verified' ? (
                              <span style={{ 
                                backgroundColor: 'rgba(26, 104, 91, 0.1)', 
                                color: '#1A685B',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '14px'
                              }}>
                                Verified
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleVerify(d.id, 'donor')}
                                style={{ 
                                  backgroundColor: '#1A685B', 
                                  color: 'white', 
                                  padding: '8px 12px', 
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s',
                                  fontSize: '14px'
                                }}
                              >
                                Verify
                              </button>
                            )}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleEdit(d.id, 'donor')}
                                style={{ 
                                  backgroundColor: '#F4A502', 
                                  color: 'white', 
                                  padding: '8px 12px', 
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s',
                                  fontSize: '14px'
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(d.id, 'donor')}
                                style={{ 
                                  backgroundColor: '#f44336', 
                                  color: 'white', 
                                  padding: '8px 12px', 
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s',
                                  fontSize: '14px'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {donors.length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ padding: '20px', textAlign: 'center' }}>
                            No organizations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

           {/* Donation Requests Tab */}
{activeTab === 'donation_request' && (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h2 style={{ color: '#1A685B', margin: '0' }}>Donation Requests</h2>
      <div style={{ 
        backgroundColor: '#F4A502', 
        color: 'white', 
        borderRadius: '20px',
        padding: '5px 15px',
        fontWeight: '500'
      }}>
        Total: {donationRequests.length}
      </div>
    </div>
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      overflowX: 'auto'
    }}>
      <table style={{ 
        borderCollapse: 'collapse', 
        width: '100%',
        minWidth: '1200px'
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f2f2f2' }}>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Title</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Requester</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Contact</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Location</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Postal Code</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Category</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Amount</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Description</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Images</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Created At</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#1A685B' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donationRequests.map((req) => (
            <tr key={req.id} style={{ 
              borderBottom: '1px solid #f2f2f2',
              transition: 'background-color 0.3s'
            }}>
              <td style={{ padding: '15px' }}>{req.title || req.item_name}</td>
              <td style={{ padding: '15px' }}>
                {req.user ? req.user.name : 'Unknown User'}
              </td>
              <td style={{ padding: '15px' }}>
                {req.user ? (req.user.mobile_number || req.user.email) : 'N/A'}
              </td>
              <td style={{ padding: '15px' }}>{req.Location || 'N/A'}</td>
              <td style={{ padding: '15px' }}>{req.postal_code || 'N/A'}</td>
              <td style={{ padding: '15px' }}>{req.category || req.item_type || 'N/A'}</td>
              <td style={{ padding: '15px' }}>{req.requested_amount || req.quantity || 'N/A'}</td>
              <td style={{ padding: '15px' }}>
                {req.description ? 
                  (req.description.length > 30 ? `${req.description.substring(0, 30)}...` : req.description) 
                  : 'N/A'}
              </td>
              <td style={{ padding: '15px' }}>
                {(req.image_urls || req.cover_urls) ? (
                  <button 
                    onClick={() => handleDonationImagesPopup(req.image_urls || req.cover_urls)}
                    style={{ 
                      backgroundColor: '#F4A502', 
                      color: 'white', 
                      padding: '8px 12px', 
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      fontSize: '14px'
                    }}
                  >
                    View Images
                  </button>
                ) : 'None'}
              </td>
              <td style={{ padding: '15px' }}>
                {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}
              </td>
              <td style={{ padding: '15px' }}>
                {req.verify === 'verified' ? (
                  <span style={{ 
                    backgroundColor: 'rgba(26, 104, 91, 0.1)', 
                    color: '#1A685B',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    Approved
                  </span>
                ) : req.verify === 'rejected' ? (
                  <span style={{ 
                    backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                    color: '#f44336',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    Rejected
                  </span>
                ) : (
                  <span style={{ 
                    backgroundColor: 'rgba(244, 165, 2, 0.1)', 
                    color: '#F4A502',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    Pending
                  </span>
                )}
              </td>
              <td style={{ padding: '15px' }}>
                {(req.verify === 'unverified' || !req.verify || req.verify === 'pending') && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleDonationRequestUpdate(req.id, 'verified')}
                      style={{ 
                        backgroundColor: '#1A685B', 
                        color: 'white', 
                        padding: '8px 12px', 
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        fontSize: '14px'
                      }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleDonationRequestUpdate(req.id, 'rejected')}
                      style={{ 
                        backgroundColor: '#f44336', 
                        color: 'white', 
                        padding: '8px 12px', 
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        fontSize: '14px'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {donationRequests.length === 0 && (
            <tr>
              <td colSpan="12" style={{ padding: '20px', textAlign: 'center' }}>
                No donation requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

            {/* Images popup */}
            {popupImages.length > 0 && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000,
                padding: '20px'
              }}>
                <button 
                  onClick={() => setPopupImages([])}
                  style={{ 
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '15px',
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}>
                  {popupImages.map((img, index) => (
                    <div key={index} style={{ margin: '10px' }}>
                      <img 
                        src={img} 
                        alt={`Image ${index + 1}`}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '70vh',
                          borderRadius: '5px',
                          border: '2px solid white'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
};

// SidebarItem Component
const SidebarItem = ({ active, onClick, icon, text }) => {
return (
  <div 
    onClick={onClick} 
    style={{ 
      padding: '15px 20px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      color: active ? '#F4A502' : 'white',
      transition: 'all 0.3s ease',
      borderLeft: active ? '4px solid #F4A502' : '4px solid transparent',
    }}
  >
    <span style={{ marginRight: '15px', fontSize: '18px' }}>{icon}</span>
    <span style={{ fontWeight: active ? '600' : '400' }}>{text}</span>
  </div>
);
};

// TabButton Component for mobile view
const TabButton = ({ active, onClick, text }) => {
return (
  <button 
    onClick={onClick} 
    style={{ 
      padding: '10px 20px',
      backgroundColor: active ? '#1A685B' : '#f1f1f1',
      color: active ? 'white' : '#333',
      border: 'none',
      borderRadius: '4px',
      marginRight: '10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      fontWeight: '500'
    }}
  >
    {text}
  </button>
);
};

// Loading Spinner Component
const LoadingSpinner = () => {
return (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '300px' 
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #1A685B',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}
    </style>
  </div>
);
};

export default Dashboard;