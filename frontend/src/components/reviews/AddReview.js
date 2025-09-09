import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import LoadingSpinner from '../common/LoadingSpinner';

const AddReview = ({ storeId, onReviewAdded, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (reviewData) => {
    if (!user) {
      setError('You must be logged in to add a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newReview = await reviewService.createReview({
        ...reviewData,
        storeId
      });

      setSuccess(true);
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }

      // Reset form after short delay to show success
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) {
          onCancel();
        }
      }, 2000);

    } catch (error) {
      setError(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Submitting your review..." />;
  }

  if (success) {
    return (
      <div className="review-form">
        <div className="success-message">
          <h3>Review Submitted Successfully!</h3>
          <p>Thank you for sharing your experience.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="review-form">
        <div className="error-message">
          <h3>Login Required</h3>
          <p>You must be logged in to add a review.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-review">
      <ReviewForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitButtonText="Submit Review"
        title="Write a Review"
        error={error}
      />
    </div>
  );
};

export default AddReview;