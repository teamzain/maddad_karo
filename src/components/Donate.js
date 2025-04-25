import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Donate = ({ userData }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationTotals, setDonationTotals] = useState({});
  const [animatedCards, setAnimatedCards] = useState([]);
  const navigate = useNavigate();
  const cardsContainerRef = useRef(null);

  // Color palette
  const colors = {
    primary: '#1A685B',
    secondary: '#FFAC00',
    light: '#F5F5F5',
    white: '#FFFFFF',
    grey: '#888888',
    lightGrey: '#E8E8E8',
    dark: '#2D2D2D',
    error: '#E53935',
    success: '#43A047',
  };

  useEffect(() => {
    // Check if user is logged in and is a donor
    const userType = localStorage.getItem('userType');
    if (!userType || userType !== 'donor') {
      navigate('/login');
      return;
    }
    
    fetchDonationRequests();
  }, [navigate]);

  // Animation for cards appearing one after another
  useEffect(() => {
    if (!loading && donations.length > 0) {
      let timer;
      const animateCards = () => {
        donations.forEach((donation, index) => {
          timer = setTimeout(() => {
            setAnimatedCards(prev => [...prev, donation.id]);
          }, 150 * index); // Staggered timing for bubble effect
        });
      };
      
      animateCards();
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [loading, donations]);

  const fetchDonationRequests = async () => {
    try {
      setLoading(true);
      setAnimatedCards([]);
      
      // Fetch verified donation requests
      const { data, error } = await supabase
        .from('donation_request')
        .select('*')
        .eq('verify', 'verified');
        
      if (error) throw error;
      
      // Fetch donation totals for all requests
      const totals = await fetchDonationTotals(data || []);
      
      // Filter requests where donated amount is less than requested amount
      const availableRequests = data.filter(req => {
        const donatedAmount = totals[req.id] || 0;
        return donatedAmount < parseFloat(req.requested_amount);
      });
      
      setDonations(availableRequests);
    } catch (error) {
      console.error('Error fetching donation requests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch and calculate donation totals
  const fetchDonationTotals = async (requests) => {
    try {
      const totals = {};
      
      // For each request, get all donations and sum them up
      for (const request of requests) {
        const { data, error } = await supabase
          .from('donated')
          .select('donated_amount')
          .eq('request_id', request.id);
          
        if (error) throw error;
        
        // Calculate total donated amount
        const total = data.reduce((sum, donation) => sum + parseFloat(donation.donated_amount || 0), 0);
        totals[request.id] = total;
      }
      
      setDonationTotals(totals);
      return totals;
    } catch (error) {
      console.error('Error fetching donation totals:', error);
      return {};
    }
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          receiver_id: selectedRequest.user_id,
          donor_id: donor.id,
          donated_amount: parseFloat(donationAmount),
          request_id: selectedRequest.id
        });
        
      if (error) {
        console.error('Detailed error:', error);
        throw error;
      }
      
      // Success toast notification
      showToast('Thank you for your donation!', 'success');
      
      setSelectedRequest(null);
      setDonationAmount('');
      
      // Refresh the donations list
      fetchDonationRequests();
      
    } catch (error) {
      console.error('Error processing donation:', error);
      showToast('Failed to process donation. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelDonation = () => {
    setSelectedRequest(null);
    setDonationAmount('');
  };

  // Toast notification function
  const showToast = (message, type = 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Set style based on type
    const bgColor = type === 'success' ? colors.success : 
                   type === 'error' ? colors.error : 
                   colors.primary;
    
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: bgColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      opacity: 0,
      transform: 'translateY(20px)',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      fontWeight: '500'
    });
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = 1;
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      toast.style.opacity = 0;
      toast.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Function to render the donation image
  const renderDonationImage = (donation) => {
    if (donation.cover_urls) {
      return (
        <div className="donation-image-container">
          <img 
            src={donation.cover_urls} 
            alt={`Image for ${donation.title}`}
            className="donation-image"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg'; // Replace with your placeholder image
              e.target.alt = 'Image not available';
            }}
          />
        </div>
      );
    }
    return null;
  };

  // Calculate the remaining amount needed for a donation request
  const getRemainingAmount = (donation) => {
    const totalDonated = donationTotals[donation.id] || 0;
    const requested = parseFloat(donation.requested_amount);
    return Math.max(0, requested - totalDonated).toFixed(2);
  };

  // Calculate donation progress percentage
  const getProgressPercentage = (donation) => {
    const totalDonated = donationTotals[donation.id] || 0;
    const requested = parseFloat(donation.requested_amount);
    return Math.min(100, (totalDonated / requested) * 100).toFixed(1);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
      <p className="loading-text">Loading donation requests...</p>
    </div>
  );

  // Check if a card is animated
  const isCardAnimated = (id) => {
    return animatedCards.includes(id);
  };

  // CSS for animations and responsive layout
  const styles = `
    /* Global styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: #f7f9fc;
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Container */
    .donate-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* Page header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 15px;
      border-bottom: 3px solid ${colors.secondary};
      flex-wrap: wrap;
    }
    
    .page-header h1 {
      color: ${colors.primary};
      margin: 0;
      font-size: 28px;
      position: relative;
    }
    
    /* Back button */
    .back-button {
      background-color: ${colors.secondary};
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(255, 172, 0, 0.3);
    }
    
    .back-button:hover {
      background-color: #e09900;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 172, 0, 0.4);
    }
    
    .back-button:active {
      transform: translateY(0);
    }
    
    /* Donation cards grid */
    .donation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    /* Card animations */
    .donation-card {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform: scale(0.8);
      opacity: 0;
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
    
    .donation-card.animated {
      transform: scale(1);
      opacity: 1;
    }
    
    .donation-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
    
    /* Card header */
    .card-header {
      background-color: ${colors.primary};
      padding: 16px 20px;
      color: white;
      font-size: 18px;
      font-weight: 600;
      position: relative;
      overflow: hidden;
    }
    
    .card-header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%);
      border-radius: 0 0 0 70px;
    }
    
    /* Card body */
    .card-body {
      padding: 20px;
    }
    
    /* Donation image */
    .donation-image-container {
      overflow: hidden;
      position: relative;
    }
    
    .donation-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .donation-card:hover .donation-image {
      transform: scale(1.05);
    }
    
    /* Progress bar */
    .progress-container {
      width: 100%;
      height: 10px;
      background-color: ${colors.lightGrey};
      border-radius: 20px;
      overflow: hidden;
      margin: 15px 0;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, ${colors.secondary} 0%, #FFD54F 100%);
      border-radius: 20px;
      transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Progress stats */
    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: ${colors.grey};
    }
    
    .progress-stats strong {
      color: ${colors.dark};
      font-weight: 600;
    }
    
    /* Description */
    .card-description {
      margin: 16px 0;
      font-size: 14px;
      line-height: 1.6;
      color: ${colors.dark};
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Category tag */
    .category-tag {
      display: inline-block;
      background-color: ${colors.primary};
      color: white;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      margin-right: 8px;
    }
    
    /* Info row */
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: ${colors.grey};
      margin: 12px 0;
    }
    
    /* Donate button */
    .donate-button {
      width: 100%;
      background-color: ${colors.secondary};
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .donate-button:hover {
      background-color: #e09900;
      transform: translateY(-2px);
    }
    
    .donate-button:active {
      transform: translateY(0);
    }
    
    /* Donation form */
    .donation-form {
      background-color: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      animation: formAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 1px solid rgba(26, 104, 91, 0.1);
    }
    
    @keyframes formAppear {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .form-title {
      color: ${colors.primary};
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${colors.secondary};
      position: relative;
    }
    
    .form-title::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background-color: ${colors.primary};
    }
    
    /* Form details */
    .detail-section {
      margin: 20px 0;
      padding: 15px;
      background-color: #f7f9fc;
      border-radius: 8px;
      border-left: 4px solid ${colors.primary};
    }
    
    .detail-row {
      display: flex;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    }
    
    .detail-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .detail-label {
      font-weight: 600;
      color: ${colors.primary};
      width: 140px;
      min-width: 140px;
    }
    
    .detail-value {
      flex: 1;
    }
    
    /* Amount input */
    .amount-input-container {
      position: relative;
      margin-bottom: 20px;
    }
    
    .amount-input {
      width: 100%;
      padding: 15px 15px 15px 30px;
      border: 2px solid ${colors.lightGrey};
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .amount-input:focus {
      border-color: ${colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(26, 104, 91, 0.1);
    }
    
    .amount-input-container::before {
      content: '$';
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: ${colors.grey};
      font-weight: bold;
    }
    
    /* Form buttons */
    .form-buttons {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    
    .primary-button, .secondary-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .primary-button {
      background-color: ${colors.primary};
      color: white;
    }
    
    .primary-button:hover {
      background-color: #145046;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 104, 91, 0.2);
    }
    
    .secondary-button {
      background-color: #f44336;
      color: white;
    }
    
    .secondary-button:hover {
      background-color: #d32f2f;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
    }
    
    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.5s ease;
    }
    
    .empty-state-icon {
      font-size: 60px;
      margin-bottom: 20px;
      color: ${colors.grey};
    }
    
    .empty-state-title {
      color: ${colors.primary};
      margin-bottom: 10px;
      font-size: 22px;
    }
    
    .empty-state-message {
      color: ${colors.grey};
      max-width: 400px;
      margin: 0 auto;
    }
    
    /* Loading spinner */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: relative;
      animation: rotate 1s linear infinite;
    }
    
    .spinner-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: ${colors.secondary};
      border-right-color: ${colors.secondary};
      position: absolute;
    }
    
    .loading-text {
      margin-top: 20px;
      color: ${colors.primary};
      font-weight: 500;
    }
    
    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding-bottom: 20px;
      }
      
      .back-button {
        align-self: flex-start;
      }
      
      .donation-grid {
        grid-template-columns: 1fr;
      }
      
      .form-buttons {
        flex-direction: column;
      }
      
      .detail-row {
        flex-direction: column;
      }
      
      .detail-label {
        width: 100%;
        margin-bottom: 4px;
      }
    }
    
    /* For medium screens */
    @media (min-width: 769px) and (max-width: 1024px) {
      .donation-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }
  `;

  return (
    <div className="donate-container">
      <style>{styles}</style>
      
      <div className="page-header">
        <h1>Available Donation Requests</h1>
        {/* <button 
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button> */}
      </div>
      
      {selectedRequest ? (
        <div className="donation-form">
          <h2 className="form-title">Make a Donation</h2>
          {renderDonationImage(selectedRequest)}
          
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${getProgressPercentage(selectedRequest)}%` }}
            ></div>
          </div>
          
          <div className="progress-stats">
            <span><strong>${donationTotals[selectedRequest.id] || 0}</strong> raised</span>
            <span><strong>{getProgressPercentage(selectedRequest)}%</strong> of ${selectedRequest.requested_amount} goal</span>
          </div>
          
          <div className="detail-section">
            <h3 style={{ marginBottom: '15px', color: colors.primary }}>Request Details</h3>
            
            <div className="detail-row">
              <div className="detail-label">Title:</div>
              <div className="detail-value">{selectedRequest.title}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">Category:</div>
              <div className="detail-value">{selectedRequest.category}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">Description:</div>
              <div className="detail-value">{selectedRequest.description}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">Location:</div>
              <div className="detail-value">{selectedRequest.Location || selectedRequest.location}</div>
            </div>
            
            {selectedRequest.postal_code && (
              <div className="detail-row">
                <div className="detail-label">Postal Code:</div>
                <div className="detail-value">{selectedRequest.postal_code}</div>
              </div>
            )}
            
            <div className="detail-row">
              <div className="detail-label">Amount Needed:</div>
              <div className="detail-value" style={{ color: colors.primary, fontWeight: 'bold' }}>
                Rs{getRemainingAmount(selectedRequest)}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleDonationSubmit}>
            <div>
              <label htmlFor="amount" style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontWeight: '600',
                color: colors.primary,
              }}>
                How much would you like to donate?
              </label>
              
              <div className="amount-input-container">
                <input
                  type="number"
                  id="amount"
                  className="amount-input"
                  min="0.01"
                  step="0.01"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                  placeholder="Enter donation amount"
                />
              </div>
            </div>
            
            <div className="form-buttons">
              <button 
                type="submit"
                className="primary-button"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span style={{ 
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'rotate 1s linear infinite',
                    }}></span>
                    Processing...
                  </>
                ) : 'Confirm Donation'}
              </button>
              
              <button 
                type="button"
                className="secondary-button"
                onClick={cancelDonation}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : donations.length > 0 ? (
        <div className="donation-grid" ref={cardsContainerRef}>
          {donations.map((donation) => (
            <div 
              key={donation.id} 
              className={`donation-card ${isCardAnimated(donation.id) ? 'animated' : ''}`}
            >
              <div className="card-header">
                {donation.title}
              </div>
              
              {renderDonationImage(donation)}
              
              <div className="card-body">
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${getProgressPercentage(donation)}%` }}
                  ></div>
                </div>
                
                <div className="progress-stats">
                  <span><strong>Rs{donationTotals[donation.id] || 0}</strong> raised</span>
                  <span><strong>{getProgressPercentage(donation)}%</strong> funded</span>
                </div>
                
                <p className="card-description">
                  {donation.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  marginTop: '15px',
                }}>
                  <span className="category-tag">
                    {donation.category}
                  </span>
                  
                  <span style={{ 
                    fontWeight: '600', 
                    color: colors.primary,
                    fontSize: '14px'
                  }}>
                    ${getRemainingAmount(donation)} needed
                  </span>
                </div>
                
                <div className="info-row">
                  <div>{donation.Location || donation.location}</div>
                  {donation.created_at && (
                    <div>Posted: {new Date(donation.created_at).toLocaleDateString()}</div>
                  )}
                </div>
                
                <button 
                  className="donate-button"
                  onClick={() => handleSelectRequest(donation)}
                >
                  <span>Donate Now</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <h3 className="empty-state-title">No Active Donation Requests</h3>
          <p className="empty-state-message">
            There are no donation requests available at the moment that need funding.
            Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Donate;