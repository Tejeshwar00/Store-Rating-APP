import React, { useState } from 'react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange = null, 
  readonly = false, 
  size = 'medium',
  showLabel = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClass = {
    small: 'stars-small',
    medium: 'stars-medium',
    large: 'stars-large'
  }[size];

  const handleStarClick = (starValue) => {
    if (readonly) return;
    
    setCurrentRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getRatingLabel = (ratingValue) => {
    const labels = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[ratingValue] || 'No Rating';
  };

  const displayRating = hoverRating || currentRating;
  const numericRating = parseFloat(rating) || 0;

  return (
    <div className={`star-rating ${readonly ? 'readonly' : 'interactive'}`}>
      <div className={`stars ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = readonly 
            ? star <= numericRating 
            : star <= displayRating;
            
          return (
            <span
              key={star}
              className={`star ${isFilled ? 'filled' : 'empty'}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              style={{ cursor: readonly ? 'default' : 'pointer' }}
            >
              {isFilled ? '★' : '☆'}
            </span>
          );
        })}
      </div>
      
      {showLabel && (
        <span className="rating-label">
          {readonly 
            ? `${numericRating.toFixed(1)} (${getRatingLabel(Math.round(numericRating))})`
            : getRatingLabel(displayRating)
          }
        </span>
      )}
    </div>
  );
};

export default StarRating;