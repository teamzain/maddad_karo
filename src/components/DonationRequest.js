import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import { supabase } from './supabaseClient'; // adjust the path if needed

const DonationRequest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    postal_code: '',
    category: '',
    requested_amount: '',
    description: '',
    title: '',
    cover_urls: [],
  });
  const [country, setCountry] = useState('PK'); // default to Pakistan
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [coverFiles, setCoverFiles] = useState([]);
  const [keywords] = useState([
    'Medical Emergency', 'Orphan Support', 'Education', 'Food Supplies', 'Shelter',
    'Job Loss', 'Natural Disaster', 'Disability Support', 'Debt Relief', 'Funeral Expenses',
    'Animal Rescue', 'Women Empowerment', 'Old Age Help', 'Children Aid', 'Community Project'
  ]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('next');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const totalSteps = 5;
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleCoverUpload = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data, error } = await supabase
        .storage
        .from('request-donation-images') // replace with your storage bucket name
        .upload(fileName, file);
      if (error) {
        console.error('Upload error:', error.message);
        setError(`Upload error: ${error.message}`);
      } else {
        const { data: { publicUrl } } = supabase
          .storage
          .from('request-donation-images')
          .getPublicUrl(data.path);
        uploadedUrls.push(publicUrl);
      }
    }
    return uploadedUrls;
  };
  
  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !form.postal_code) {
      setError("Please enter a postal code");
      return;
    }
    
    if (currentStep === 2 && (!province || !city)) {
      setError("Please select both province and city");
      return;
    }
    
    if (currentStep === 3) {
      if (selectedKeywords.length === 0) {
        setError("Please select at least one category");
        return;
      }
      if (!form.requested_amount) {
        setError("Please enter the requested donation amount");
        return;
      }
    }
    
    if (currentStep === 4) {
      if (!form.title) {
        setError("Please enter a title for your donation request");
        return;
      }
    }
    
    // Clear any previous errors
    setError(null);
    
    // Proceed to next step with animation
    setSlideDirection('next');
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setSlideDirection('prev');
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate final step
    if (!form.description) {
      setError("Please provide a description");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      
      const countryName = Country.getCountryByCode(country)?.name || '';
      const provinceName = State.getStateByCodeAndCountry(province, country)?.name || '';
      const location = `${countryName}/${provinceName}/${city}`;
      
      // Upload files and get URLs
      const uploadedUrls = await handleCoverUpload(coverFiles);
      
      // Insert data directly into Supabase table
      const { data, error } = await supabase
        .from('donation_request')
        .insert([{
          Location: location,
          postal_code: form.postal_code,
          category: selectedKeywords.join(', '),
          requested_amount: parseFloat(form.requested_amount),
          cover_urls: uploadedUrls.join(','),
          description: form.description,
          title: form.title,
          user_id: userId,
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Database error:', error);
        setError(`Failed to submit request: ${error.message}`);
      } else {
        setShowSuccessPopup(true);
        // Don't navigate immediately, let user see the success popup
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Success popup component
  const SuccessPopup = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          margin: '0 auto 20px',
          backgroundColor: '#ebf7eb',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            color: '#4CAF50',
            fontSize: '35px',
            fontWeight: 'bold'
          }}>✓</div>
        </div>
        <h2 style={{
          color: '#333',
          fontSize: '24px',
          marginBottom: '15px'
        }}>Request Received!</h2>
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '25px'
        }}>
          Your donation request has been successfully submitted and will be reviewed by our team. 
          We'll contact you if we need any additional information.
        </p>
        <button onClick={() => navigate('/dashboard')} style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
  
  // Render step content
  const renderStepContent = () => {
    const slideClass = slideDirection === 'next' ? 'slide-in-right' : 'slide-in-left';
    
    switch(currentStep) {
      case 1:
        return (
          <div className={slideClass} key="step1">
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '20px'
            }}>
              Where will the funds go?
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#555',
              marginBottom: '20px'
            }}>
              Choose the location where you plan to withdraw your funds. 
              <a href="#" style={{ color: '#4CAF50', textDecoration: 'none' }}> Countries we support fundraisers in.</a>
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Country</label>
              <select 
                value={country} 
                onChange={(e) => { setCountry(e.target.value); setProvince(''); setCity(''); }} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px top 50%',
                  backgroundSize: '10px auto',
                  paddingRight: '30px'
                }}
              >
                <option value="PK">Pakistan</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Zip code</label>
              <input 
                type="text" 
                value={form.postal_code} 
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className={slideClass} key="step2">
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '20px'
            }}>
              Select your location
            </h2>
          
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Select Province/State:</label>
              <select 
                value={province} 
                onChange={(e) => { setProvince(e.target.value); setCity(''); }} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px top 50%',
                  backgroundSize: '10px auto',
                  paddingRight: '30px'
                }}
              >
                <option value="">--Select State--</option>
                {State.getStatesOfCountry(country).map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Select City:</label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px top 50%',
                  backgroundSize: '10px auto',
                  paddingRight: '30px'
                }}
              >
                <option value="">--Select City--</option>
                {City.getCitiesOfState(country, province).map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={slideClass} key="step3">
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '20px'
            }}>
              What best describes why you're fundraising?
            </h2>
          
            <div style={{ marginBottom: '30px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Select up to 3 categories that best describe your cause
              </p>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px',
                marginBottom: '20px'
              }}>
                {keywords.slice(0, 6).map((word) => (
                  <label 
                    key={word} 
                    style={{ 
                      padding: '10px 15px',
                      border: `1px solid ${selectedKeywords.includes(word) ? '#4CAF50' : '#ddd'}`,
                      borderRadius: '100px',
                      backgroundColor: selectedKeywords.includes(word) ? '#ebf7eb' : '#fff',
                      color: selectedKeywords.includes(word) ? '#4CAF50' : '#333',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <input
                      type="checkbox"
                      value={word}
                      checked={selectedKeywords.includes(word)}
                      onChange={() => {
                        if (selectedKeywords.includes(word)) {
                          setSelectedKeywords(selectedKeywords.filter(k => k !== word));
                        } else if (selectedKeywords.length < 3) {
                          setSelectedKeywords([...selectedKeywords, word]);
                        } else {
                          alert('You can select a maximum of 3 categories');
                        }
                      }}
                      style={{ display: 'none' }}
                    /> 
                    {word}
                  </label>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px',
                marginBottom: '20px'
              }}>
                {keywords.slice(6, 12).map((word) => (
                  <label 
                    key={word} 
                    style={{ 
                      padding: '10px 15px',
                      border: `1px solid ${selectedKeywords.includes(word) ? '#4CAF50' : '#ddd'}`,
                      borderRadius: '100px',
                      backgroundColor: selectedKeywords.includes(word) ? '#ebf7eb' : '#fff',
                      color: selectedKeywords.includes(word) ? '#4CAF50' : '#333',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <input
                      type="checkbox"
                      value={word}
                      checked={selectedKeywords.includes(word)}
                      onChange={() => {
                        if (selectedKeywords.includes(word)) {
                          setSelectedKeywords(selectedKeywords.filter(k => k !== word));
                        } else if (selectedKeywords.length < 3) {
                          setSelectedKeywords([...selectedKeywords, word]);
                        } else {
                          alert('You can select a maximum of 3 categories');
                        }
                      }}
                      style={{ display: 'none' }}
                    /> 
                    {word}
                  </label>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px'
              }}>
                {keywords.slice(12).map((word) => (
                  <label 
                    key={word} 
                    style={{ 
                      padding: '10px 15px',
                      border: `1px solid ${selectedKeywords.includes(word) ? '#4CAF50' : '#ddd'}`,
                      borderRadius: '100px',
                      backgroundColor: selectedKeywords.includes(word) ? '#ebf7eb' : '#fff',
                      color: selectedKeywords.includes(word) ? '#4CAF50' : '#333',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <input
                      type="checkbox"
                      value={word}
                      checked={selectedKeywords.includes(word)}
                      onChange={() => {
                        if (selectedKeywords.includes(word)) {
                          setSelectedKeywords(selectedKeywords.filter(k => k !== word));
                        } else if (selectedKeywords.length < 3) {
                          setSelectedKeywords([...selectedKeywords, word]);
                        } else {
                          alert('You can select a maximum of 3 categories');
                        }
                      }}
                      style={{ display: 'none' }}
                    /> 
                    {word}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Donation Amount:</label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '12px', 
                  fontSize: '16px',
                  color: '#555'
                }}>PKR</span>
                <input 
                  type="number" 
                  value={form.requested_amount} 
                  onChange={(e) => setForm({ ...form, requested_amount: e.target.value })} 
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    paddingLeft: '45px',
                    fontSize: '16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0"
                />
              </div>
              <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>
                Enter the total amount you hope to raise
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={slideClass} key="step4">
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '20px'
            }}>
              Upload media and create a title
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Upload Cover (2 images + 1 video):</label>
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple 
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  if (selectedFiles.length > 3) {
                    alert('You can only select up to 2 images and 1 video.');
                  } else {
                    setCoverFiles(selectedFiles);
                  }
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>
                Media helps to increase your chances of receiving donations
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Title:</label>
              <input 
                type="text" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
                placeholder="E.g., Help me with medical expenses"
              />
              <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>
                Create a clear, attention-grabbing title that describes your cause
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={slideClass} key="step5">
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '20px'
            }}>
              Describe your fundraising needs
            </h2>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Description:</label>
              <textarea 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                required 
                rows="8"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical',
                  minHeight: '180px',
                  boxSizing: 'border-box'
                }}
                placeholder="Please provide details about why you're requesting donations and how the funds will be used..."
              />
              <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>
                Be specific about your situation, how the funds will help, and share your story in a personal way
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f9f8f5',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-30px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          .slide-in-right {
            animation: slideInRight 0.4s forwards;
          }
          
          .slide-in-left {
            animation: slideInLeft 0.4s forwards;
          }

          @media (min-width: 768px) {
            .container {
              flex-direction: row;
            }
            
            .left-panel {
              flex: 1;
              max-width: 33.333%;
            }
            
            .right-panel {
              flex: 2;
            }
          }
          
          @media (max-width: 767px) {
            .container {
              flex-direction: column;
            }
            
            .left-panel {
              padding: 20px;
            }
            
            .right-panel {
              padding: 20px;
            }
          }
        `}
      </style>
    
      <div className="container" style={{ 
        display: 'flex', 
        flex: 1,
        width: '100%',
        height: '100%'
      }}>
        {/* Left side - Description */}
        <div className="left-panel" style={{ 
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#f2f7f2'
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '16px'
          }}>
            Let's begin your fundraising journey
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#555',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            We're here to guide you every step of the way. Your story matters and can make a real difference.
          </p>
          
          {/* Progress indicator */}
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#555' }}>Step {currentStep} of {totalSteps}</div>
              <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: '500' }}>
                {currentStep === 1 && 'Basic Information'}
                {currentStep === 2 && 'Location Details'}
                {currentStep === 3 && 'Fundraising Category'}
                {currentStep === 4 && 'Media & Title'}
                {currentStep === 5 && 'Final Description'}
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#ddd', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(currentStep / totalSteps) * 100}%`, 
                height: '100%', 
                backgroundColor: '#4CAF50',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>Tips for success:</h3>
            <ul style={{ paddingLeft: '20px', color: '#555', fontSize: '14px', lineHeight: '1.5' }}>
              <li style={{ marginBottom: '8px' }}>Be specific about how funds will be used</li>
              <li style={{ marginBottom: '8px' }}>Share your story with authentic details</li>
              <li style={{ marginBottom: '8px' }}>Upload clear, high-quality images</li>
              <li style={{ marginBottom: '8px' }}>Set a realistic fundraising goal</li>
            </ul>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="right-panel" style={{ 
          padding: '40px',
          backgroundColor: '#ffffff',
          flex: 1
        }}>
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {error && (
              <div style={{ 
                padding: '12px', 
                marginBottom: '20px', 
                backgroundColor: '#ffebee', 
                color: '#c62828', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '40px'
            }}>
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  onClick={prevStep}
                  style={{ 
                    padding: '12px 24px',
                    backgroundColor: '#ffffff',
                    color: '#4CAF50',
                    border: '1px solid #4CAF50',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < totalSteps ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  style={{ 
                    padding: '12px 24px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    padding: '12px 24px',
                    backgroundColor: loading ? '#9acea0' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '16px', 
                        height: '16px', 
                        border: '3px solid rgba(255,255,255,0.3)', 
                        borderRadius: '50%', 
                        borderTopColor: '#fff', 
                        animation: 'rotate 1s linear infinite' 
                      }}></span>
                      Processing...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Add animation for spinner */}
      <style>
        {`
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Show success popup when submission is successful */}
      {showSuccessPopup && <SuccessPopup />}
    </div>
  );
};

export default DonationRequest;