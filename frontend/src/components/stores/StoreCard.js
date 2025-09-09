import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';
import { calculateAverageRating, getImageUrl, truncateText } from '../../utils/helpers';
import { mockStores } from '../../data/mockData';

const StoreCard = ({ store }) => {
  const averageRating = calculateAverageRating(store.reviews);
  const reviewCount = store.reviews ? store.reviews.length : 0;

  return (
    <div className="store-card">
      <Link to={`/store/${store._id || store.id}`}>
        <div className="store-image">
          <img 
            src={getImageUrl(store.image)} 
            alt={store.name}
            onError={(e) => {
              e.target.src = '/images/placeholder-store.jpg';
            }}
          />
          <div className="store-category">
            {store.category}
          </div>
        </div>
        
        <div className="store-info">
          <h3 className="store-name">{store.name}</h3>
          <p className="store-address">{truncateText(store.address, 60)}</p>
          
          {store.description && (
            <p className="store-description">
              {truncateText(store.description, 100)}
            </p>
          )}

          <div className="store-rating">
            <StarRating rating={averageRating} size="small" />
            <span className="review-count">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {store.phone && (
            <p className="store-phone">📞 {store.phone}</p>
          )}

          {store.hours && (
            <p className="store-hours">🕒 {store.hours}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default StoreCard;