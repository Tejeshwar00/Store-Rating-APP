import React, { useState, useEffect } from 'react';
import StarRating from '../common/StarRating';
import { FORM_VALIDATION } from '../../utils/constants';

const ReviewForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null, 
  submitButtonText = 'Submit Review',
  title = 'Write a Review',
  error = ''
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    title: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        rating: initialData.rating || 0,
        comment: initialData.comment || initialData.text || '',
        title: initialData.title || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));

    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rating || formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write a review comment';
    } else if (formData.comment.length > FORM_VALIDATION.MAX_REVIEW_LENGTH) {
      newErrors.comment = `Review must be less than ${FORM_VALIDATION.MAX_REVIEW_LENGTH} characters`;
    }

    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        rating: formData.rating,
        comment: formData.comment.trim(),
        title: formData.title.trim()
      });

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          rating: 0,
          comment: '',
          title: ''
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating) => {
    const labels = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[rating] || '';
  };

  return (
    <div className="review-form">
      <h3>{title}</h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rating-input">
          <label>Your Rating *</label>
          <div className="rating-stars">
            <StarRating
              rating={formData.rating}
              editable={true}
              onRatingChange={handleRatingChange}
              size="large"
            />
            {formData.rating > 0 && (
              <span className="rating-label">
                {getRatingLabel(formData.rating)}
              </span>
            )}
          </div>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="title">Review Title (Optional)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief title for your review..."
            className={errors.title ? 'error' : ''}
            maxLength="100"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
          <small className="form-help">
            {formData.title.length}/100 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review *</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your experience with this store..."
            className={`review-textarea ${errors.comment ? 'error' : ''}`}
            rows="5"
            maxLength={FORM_VALIDATION.MAX_REVIEW_LENGTH}
            required
          />
          {errors.comment && <span className="error-text">{errors.comment}</span>}
          <small className="form-help">
            {formData.comment.length}/{FORM_VALIDATION.MAX_REVIEW_LENGTH} characters
          </small>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || formData.rating === 0}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </div>
      </form>

      <div className="review-guidelines">
        <h4>Review Guidelines</h4>
        <ul>
          <li>Be honest and fair in your review</li>
          <li>Focus on your experience with the store</li>
          <li>Avoid offensive language or personal attacks</li>
          <li>Include specific details to help others</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewForm;