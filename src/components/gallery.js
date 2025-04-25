import { useState, useEffect, useRef } from 'react';

export default function ImageGallery() {
  const [images, setImages] = useState([
    { id: 1, url: "/1.jpeg", title: "Community Outreach", size: "large" },
    { id: 2, url: "/2.jpeg", title: "Volunteering", size: "medium" },
    { id: 3, url: "/3.jpeg", title: "Donation Drive", size: "medium" },
    { id: 4, url: "/4.jpeg", title: "Team Building", size: "large" },
    { id: 5, url: "/5.jpeg", title: "Donation Drive", size: "large" },
    { id: 6, url: "/6.jpeg", title: "Team Building", size: "medium" }
  ]);
  
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const modalRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add event listener for escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscapeKey);
      // Disable scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  // Handle image loading
  const handleImageLoad = (imageId) => {
    setLoadingStates(prev => ({ ...prev, [imageId]: false }));
  };

  // Handle image error
  const handleImageError = (imageId) => {
    setErrorStates(prev => ({ ...prev, [imageId]: true }));
  };

  // Open modal
  const openModal = (image) => {
    if (!isDragging) {
      setSelectedImage(image);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Navigate carousel
  const navigateCarousel = (index) => {
    setCurrentIndex(index);
    
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / images.length;
      carouselRef.current.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      });
    }
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left
      const newIndex = Math.min(currentIndex + 1, images.length - 1);
      navigateCarousel(newIndex);
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right
      const newIndex = Math.max(currentIndex - 1, 0);
      navigateCarousel(newIndex);
    }
  };

  // Handle mouse down for drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  // Handle mouse move for drag
  const handleMouseMove = (e) => {
    if (isDragging && carouselRef.current) {
      const deltaX = e.clientX - dragStartX;
      setDragOffset(deltaX);
      const scrollAmount = carouselRef.current.scrollLeft - deltaX;
      carouselRef.current.scrollLeft = scrollAmount;
      setDragStartX(e.clientX);
    }
  };

  // Handle mouse up for drag
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      if (carouselRef.current) {
        // Find closest snap point
        const itemWidth = carouselRef.current.scrollWidth / images.length;
        const snapIndex = Math.round(carouselRef.current.scrollLeft / itemWidth);
        setCurrentIndex(Math.min(Math.max(snapIndex, 0), images.length - 1));
        navigateCarousel(Math.min(Math.max(snapIndex, 0), images.length - 1));
      }
    }
  };

  // Handle mouse leave for drag
  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Handle scroll
  const handleScroll = () => {
    if (carouselRef.current && !isDragging) {
      const itemWidth = carouselRef.current.scrollWidth / images.length;
      const index = Math.round(carouselRef.current.scrollLeft / itemWidth);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    masonryGrid: {
      display: isMobile ? 'block' : 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridTemplateRows: 'auto',
      gridGap: '10px',
      position: 'relative',
    },
    largeItem: {
      gridColumn: 'span 8',
      height: '400px',
    },
    mediumItem: {
      gridColumn: 'span 4',
      height: '400px',
    },
    carousel: {
      display: isMobile ? 'flex' : 'none',
      overflow: 'hidden',
      position: 'relative',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
    },
    carouselItem: {
      flex: '0 0 100%',
      scrollSnapAlign: 'start',
      padding: '10px',
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      animation: 'fadeIn 0.5s ease forwards',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    hoverEffect: {
      transform: 'scale(1.05)',
    },
    imageTitle: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      margin: '0',
      fontSize: '16px',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      background: '#f0f0f0',
    },
    error: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      background: '#ffe6e6',
      color: '#d8000c',
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '999',
      overflowY: 'auto',
    },
    modalContent: {
      position: 'relative',
      maxWidth: '90%',
      maxHeight: '90%',
      margin: '20px',
    },
    modalImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '90vh',
      objectFit: 'contain',
    },
    closeButton: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      cursor: 'pointer',
      zIndex: '1000',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    indicators: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      gap: '10px',
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    activeIndicator: {
      backgroundColor: '#4a90e2',
      transform: 'scale(1.2)',
    },
    swipeInstruction: {
      textAlign: 'center',
      color: '#777',
      fontSize: '12px',
      marginTop: '8px',
    }
  };

  // Get the correct style for each image size
  const getSizeStyle = (size) => {
    switch(size) {
      case 'large':
        return styles.largeItem;
      case 'medium':
        return styles.mediumItem;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
   
      {isMobile ? (
        <>
          <div 
            ref={carouselRef}
            style={styles.carousel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onScroll={handleScroll}
          >
            {images.map((image, index) => (
              <div key={image.id} style={styles.carouselItem}>
                <div 
                  style={styles.imageContainer}
                  onClick={() => openModal(image)}
                >
                  {loadingStates[image.id] !== false && !errorStates[image.id] && (
                    <div style={styles.loading}>Loading...</div>
                  )}
                  {errorStates[image.id] ? (
                    <div style={styles.error}>Image failed to load</div>
                  ) : (
                    <>
                      <img
                        src={image.url}
                        alt={image.title}
                        style={styles.image}
                        onLoad={() => handleImageLoad(image.id)}
                        onError={() => handleImageError(image.id)}
                        draggable="false"
                      />
                      <h3 style={styles.imageTitle}>{image.title}</h3>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* <div style={styles.indicators}>
            {images.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.indicator,
                  ...(index === currentIndex ? styles.activeIndicator : {})
                }}
                onClick={() => navigateCarousel(index)}
              />
            ))}
          </div> */}
          <div style={styles.swipeInstruction}>
            Drag to navigate through images
          </div>
        </>
      ) : (
        <>
          <div style={styles.masonryGrid}>
            {images.map((image) => {
              const sizeStyle = getSizeStyle(image.size);
              return (
                <div
                  key={image.id}
                  style={{
                    ...sizeStyle,
                    margin: '5px',
                  }}
                >
                  <div
                    style={{
                      ...styles.imageContainer,
                      transform: 'scale(1)',
                      height: '100%',
                    }}
                    onClick={() => openModal(image)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {loadingStates[image.id] !== false && !errorStates[image.id] && (
                      <div style={styles.loading}>Loading...</div>
                    )}
                    {errorStates[image.id] ? (
                      <div style={styles.error}>Image failed to load</div>
                    ) : (
                      <>
                        <img
                          src={image.url}
                          alt={image.title}
                          style={styles.image}
                          onLoad={() => handleImageLoad(image.id)}
                          onError={() => handleImageError(image.id)}
                          draggable="false"
                        />
                        <h3 style={styles.imageTitle}>{image.title}</h3>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* <div style={styles.indicators}>
            {images.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.indicator,
                  ...(index === currentIndex ? styles.activeIndicator : {})
                }}
                onClick={() => openModal(images[index])}
              />
            ))}
          </div> */}
        </>
      )}
      
      {selectedImage && (
        <div style={styles.modal} onClick={closeModal} ref={modalRef}>
          <button style={styles.closeButton} onClick={closeModal}>×</button>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              style={styles.modalImage} 
            />
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}