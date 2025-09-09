import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { reviewService } from '../../services/reviewService';
import { PAGINATION_LIMITS } from '../../utils/constants';

const ReviewList = ({ 
  storeId, 
  reviews: propReviews, 
  onReviewUpdated, 
  showStoreInfo = false,
  title = "Reviews"
}) => {
  const [reviews, setReviews] = useState(propReviews || []);
  const [loading, setLoading] = useState(!propReviews);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  const reviewsPerPage = PAGINATION_LIMITS.REVIEWS_PER_PAGE;

  useEffect(() => {
    if (storeId && !propReviews) {
      fetchReviews();
    } else if (propReviews) {
      setReviews(propReviews);
      setTotalReviews(propReviews.length);
      setTotalPages(Math.ceil(propReviews.length / reviewsPerPage));
      setLoading(false);
    }
  }, [storeId, propReviews, currentPage, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: reviewsPerPage,
        sort: sortBy,
        ...(filterRating !== 'all' && { rating: filterRating })
      };

      const data = await reviewService.getReviewsByStore(storeId, params);
      
      setReviews(data.reviews || []);
      setTotalReviews(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / reviewsPerPage));
    } catch (error) {
      setError('Failed to load reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(prev => prev.filter(review => review._id !== reviewId));
    setTotalReviews(prev => prev - 1);
    
    // Refresh if current page becomes empty and not on first page
    const newTotal = totalReviews - 1;
    const newTotalPages = Math.ceil(newTotal / reviewsPerPage);
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilterRating(newFilter);
    setCurrentPage(1);
  };

  const getSortOptions = () => [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' }
  ];

  const getFilterOptions = () => [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      );
    }

    return (
      <div className="pagination">
        {pages}
        <div className="pagination-info">
          Showing {(currentPage - 1) * reviewsPerPage + 1} to {Math.min(currentPage * reviewsPerPage, totalReviews)} of {totalReviews} reviews
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading reviews..." />;
  }

  if (error) {
    return (
      <div className="review-list-error">
        <div className="error-message">
          <h3>Error Loading Reviews</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={fetchReviews}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <h2>{title} ({totalReviews})</h2>

        {reviews.length > 0 && (
          <div className="review-controls">
            <div className="review-sort">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                {getSortOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="review-filter">
              <label>Filter:</label>
              <select 
                value={filterRating} 
                onChange={(e) => handleFilterChange(e.target.value)}
                className="filter-select"
              >
                {getFilterOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="empty-reviews">
          <h3>No reviews yet</h3>
          <p>Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          <div className="reviews-container">
            {reviews.map(review => (
              <ReviewCard
                key={review._id}
                review={review}
                onReviewUpdated={onReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
                showStoreInfo={showStoreInfo}
              />
            ))}
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default ReviewList;