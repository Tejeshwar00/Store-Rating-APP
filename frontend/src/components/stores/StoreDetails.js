import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import ReviewList from '../reviews/ReviewList';
import './StoreDetails.css';
import { mockStores } from '../../data/mockData';

const StoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStoreDetails();
    fetchStoreReviews();
  }, [storeId]);

  const fetchStoreDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stores/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Store not found');
          return;
        }
        throw new Error('Failed to fetch store details');
      }

      const data = await response.json();
      setStore(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching store details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stores/${storeId}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleDeleteStore = async () => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/stores/${storeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete store');
        }

        navigate('/stores');
      } catch (err) {
        setError(err.message);
        console.error('Error deleting store:', err);
      }
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
    setStore(prevStore => ({
      ...prevStore,
      reviewCount: (prevStore.reviewCount || 0) + 1,
      averageRating: calculateNewAverageRating(prevStore.averageRating, prevStore.reviewCount, newReview.rating)
    }));
  };

  const calculateNewAverageRating = (currentAvg, currentCount, newRating) => {
    const totalRating = (currentAvg || 0) * (currentCount || 0) + newRating;
    return totalRating / ((currentCount || 0) + 1);
  };

  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    return address;
  };

  const handleImageNavigation = (direction) => {
    const images = store.images && store.images.length > 0 ? store.images : [store.image].filter(Boolean);
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getWorkingHours = () => {
    if (!store.workingHours) return null;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
      day,
      hours: store.workingHours[day.toLowerCase()] || 'Closed'
    }));
  };

  const isStoreOpen = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (store.workingHours && store.workingHours[currentDay]) {
      const hours = store.workingHours[currentDay];
      if (hours === 'Closed' || !hours) return false;
      return hours.toLowerCase() !== 'closed';
    }
    return store.isOpen;
  };

  const getRatingDistribution = () => {
    if (!reviews.length) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    
    return distribution;
  };

  const openInMaps = () => {
    const query = encodeURIComponent(store.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const isOwner = currentUser.id === store?.owner?._id;

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!store) return <div className="error-message">Store not found</div>;

  const images = store.images && store.images.length > 0 ? store.images : [store.image].filter(Boolean);
  const workingHours = getWorkingHours();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="store-details-container">
      {/* Header Section */}
      <div className="store-header">
        <div className="store-images">
          {images.length > 0 ? (
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={images[currentImageIndex]}
                  alt={store.name}
                  className="store-main-image"
                />
                {images.length > 1 && (
                  <>
                    <button className="image-nav prev" onClick={() => handleImageNavigation('prev')}>‹</button>
                    <button className="image-nav next" onClick={() => handleImageNavigation('next')}>›</button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="image-thumbnails">
                  {images.slice(0, 4).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${store.name} ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                  {images.length > 4 && (
                    <div className="more-images" onClick={() => setShowAllImages(true)}>
                      +{images.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="no-image-placeholder">
              <span>📍</span>
              <p>No images available</p>
            </div>
          )}
        </div>

        <div className="store-info-header">
          <div className="store-title">
            <h1>{store.name}</h1>
            <div className="store-badges">
              {store.isVerified && <span className="verified-badge">✓ Verified</span>}
              {store.featured && <span className="featured-badge">⭐ Featured</span>}
              {store.priceRange && <span className="price-badge">{store.priceRange}</span>}
            </div>
          </div>

          <div className="store-rating-section">
            <div className="rating-main">
              <StarRating rating={store.averageRating || 0} readOnly={true} size="large" />
              <div className="rating-details">
                <span className="rating-number">
                  {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings'}
                </span>
                <span className="review-count">Based on {store.reviewCount || 0} reviews</span>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingDistribution[rating];
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="rating-bar">
                      <span className="rating-label">{rating}★</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="rating-count">({count})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="store-category-status">
            <span className="category-badge">{store.category || 'General'}</span>
            <span className={`status-badge ${isStoreOpen() ? 'open' : 'closed'}`}>
              {isStoreOpen() ? 'Open Now' : 'Closed'}
            </span>
          </div>

          <div className="store-actions-header">
            <Link to={`/stores/${store._id}/reviews/add`} className="btn btn-primary">Write Review</Link>
            <button onClick={() => setShowContactModal(true)} className="btn btn-secondary">Contact Info</button>
            {isOwner && (
              <div className="owner-actions">
                <Link to={`/stores/${store._id}/edit`} className="btn btn-outline">Edit Store</Link>
                <button onClick={handleDeleteStore} className="btn btn-danger">Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="store-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({store.reviewCount || 0})</button>
        <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Information</button>
      </div>

      {/* Tab Content */}
      <div className="store-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="overview-main">
              <div className="store-description">
                <h3>About This Store</h3>
                <p>{store.description || 'No description available for this store.'}</p>
              </div>

              {store.amenities && store.amenities.length > 0 && (
                <div className="store-amenities">
                  <h3>Amenities</h3>
                  <ul>
                    {store.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <ReviewList reviews={reviews} onReviewAdded={handleReviewAdded} />
        )}

        {activeTab === 'info' && (
          <div className="info-content">
            <h3>Store Information</h3>
            <p><strong>Address:</strong> {formatAddress(store.address)}</p>
            <p><strong>Contact:</strong> {store.contact || 'No contact info available'}</p>
            {workingHours && (
              <div className="working-hours">
                <h4>Working Hours</h4>
                <ul>
                  {workingHours.map((day, index) => (
                    <li key={index}>{day.day}: {day.hours}</li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={openInMaps} className="btn btn-link">Open in Google Maps</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;