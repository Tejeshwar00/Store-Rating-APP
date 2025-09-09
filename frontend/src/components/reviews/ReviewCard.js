import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import StarRating from '../common/StarRating';
import { formatDate, truncateText } from '../../utils/helpers';

const ReviewCard = ({ review, onReviewUpdated, onReviewDeleted, showStoreInfo = false }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(review.likedBy?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(review.likesCount || 0);
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwner = user && review.user && (user._id === review.user._id || user._id === review.user);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like reviews');
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        await reviewService.unlikeReview(review._id);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await reviewService.likeReview(review._id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setLoading(true);
    try {
      await reviewService.deleteReview(review._id);
      if (onReviewDeleted) {
        onReviewDeleted(review._id);
      }
    } catch (error) {
      alert('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (onReviewUpdated) {
      onReviewUpdated(review);
    }
  };

  const getUserInitials = (userName) => {
    if (!userName) return 'U';
    return userName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserName = () => {
    if (review.user?.name) return review.user.name;
    if (review.user?.email) return review.user.email.split('@')[0];
    if (typeof review.user === 'string') return review.user;
    return 'Anonymous User';
  };

  const reviewText = review.comment || review.text || '';
  const shouldTruncate = reviewText.length > 200;
  const displayText = shouldTruncate && !showFullText 
    ? truncateText(reviewText, 200) 
    : reviewText;

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">
          <div className="review-avatar">
            {getUserInitials(getUserName())}
          </div>
          <div className="review-user-info">
            <h4>{getUserName()}</h4>
            <span className="review-date">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <div className="review-header-right">
          <div className="review-rating">
            <StarRating rating={review.rating} size="small" />
          </div>
          
          {isOwner && (
            <div className="review-owner-actions">
              <button
                className="review-action-btn"
                onClick={() => setShowActions(!showActions)}
                disabled={loading}
              >
                ⋮
              </button>
              {showActions && (
                <div className="review-actions-dropdown">
                  <button onClick={handleEdit} disabled={loading}>
                    Edit
                  </button>
                  <button onClick={handleDelete} disabled={loading} className="text-danger">
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showStoreInfo && review.store && (
        <div className="review-store-info">
          <span className="store-name">Review for: {review.store.name}</span>
        </div>
      )}

      <div className="review-content">
        <p className="review-text">{displayText}</p>
        
        {shouldTruncate && (
          <button
            className="review-toggle-text"
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <div className="review-actions">
        <button
          className={`review-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading || !user}
          title={user ? (isLiked ? 'Unlike review' : 'Like review') : 'Login to like'}
        >
          {isLiked ? '❤️' : '🤍'} {likesCount > 0 && likesCount}
        </button>

        {review.createdAt !== review.updatedAt && (
          <span className="review-edited">Edited</span>
        )}
      </div>

      {loading && (
        <div className="review-loading-overlay">
          <div className="spinner-small">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;