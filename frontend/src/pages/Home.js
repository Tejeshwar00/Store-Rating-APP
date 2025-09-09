import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalStores: 0,
    totalReviews: 0,
    totalCategories: 0,
    averageRating: 0
  });
  const [featuredStores, setFeaturedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch all stores to calculate stats
      const storesResponse = await fetch('http://localhost:5000/api/stores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!storesResponse.ok) {
        throw new Error('Failed to fetch stores data');
      }

      const stores = await storesResponse.json();
      
      // Calculate stats
      const totalStores = stores.length;
      const totalReviews = stores.reduce((sum, store) => sum + (store.reviews ? store.reviews.length : 0), 0);
      const totalCategories = [...new Set(stores.map(store => store.category))].length;
      const averageRating = stores.length > 0 
        ? stores.reduce((sum, store) => sum + (store.rating || 0), 0) / stores.length 
        : 0;

      setStats({
        totalStores,
        totalReviews,
        totalCategories,
        averageRating: Math.round(averageRating * 10) / 10
      });

      // Get featured stores (top rated ones)
      const featured = stores
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
      
      setFeaturedStores(featured);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/stores?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/stores');
    }
  };

  const handleJoinCommunity = () => {
    navigate('/register');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover & Rate Local Stores</h1>
          <p>
            Find the best stores in your area and share your experiences with the community. 
            Help others make informed decisions with your honest reviews.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search stores by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <i className="search-icon">🔍</i>
              </button>
            </div>
          </form>

          <button onClick={handleJoinCommunity} className="cta-button">
            Join Community
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{stats.totalStores}</div>
            <div className="stat-label">Total Stores</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalReviews}</div>
            <div className="stat-label">Reviews</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalCategories}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.averageRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      {/* Featured Stores Section */}
      {featuredStores.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Stores</h2>
            <p>Discover highly-rated stores in various categories</p>
          </div>
          
          <div className="featured-grid">
            {featuredStores.map(store => (
              <div key={store.id} className="featured-card">
                <div className="store-info">
                  <h3 className="store-name">{store.name}</h3>
                  <p className="store-category">{store.category}</p>
                  <p className="store-location">{store.location}</p>
                  <div className="store-rating">
                    <span className="rating-stars">
                      {'★'.repeat(Math.floor(store.rating || 0))}
                      {'☆'.repeat(5 - Math.floor(store.rating || 0))}
                    </span>
                    <span className="rating-number">({store.rating || 0})</span>
                  </div>
                  <p className="review-count">
                    {store.reviews ? store.reviews.length : 0} reviews
                  </p>
                </div>
                <Link to={`/stores/${store.id}`} className="view-store-btn">
                  View Store
                </Link>
              </div>
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/stores" className="view-all-btn">
              View All Stores
            </Link>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find stores in your favorite categories</p>
        </div>
        
        <div className="categories-grid">
          {[...new Set(featuredStores.map(store => store.category))].slice(0, 4).map(category => (
            <Link 
              key={category} 
              to={`/stores?category=${encodeURIComponent(category)}`}
              className="category-card"
            >
              <div className="category-icon">
                {getCategoryIcon(category)}
              </div>
              <h3>{category}</h3>
              <p>{featuredStores.filter(store => store.category === category).length} stores</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Share Your Experience?</h2>
          <p>Join our community and help others discover great local businesses</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">Sign Up</Link>
            <Link to="/stores" className="btn-secondary">Browse Stores</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Electronics': '📱',
    'Clothing': '👕',
    'Food & Beverage': '🍕',
    'Books': '📚',
    'Health & Beauty': '💄',
    'Sports & Outdoors': '⚽',
    'Home & Garden': '🏠',
    'Automotive': '🚗',
  };
  return icons[category] || '🏪';
};

export default Home;