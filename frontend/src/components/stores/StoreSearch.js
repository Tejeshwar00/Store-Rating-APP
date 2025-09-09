import React, { useState, useEffect } from 'react';
import './StoreSearch.css';

const StoreSearch = ({ 
  onSearch, 
  onSort, 
  onCategoryFilter, 
  categories, 
  searchTerm, 
  sortBy, 
  filterCategory 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  const handleCategoryChange = (e) => {
    onCategoryFilter(e.target.value);
  };

  const clearFilters = () => {
    setLocalSearchTerm('');
    onSearch('');
    onSort('name');
    onCategoryFilter('all');
  };

  return (
    <div className="store-search-container">
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search stores by name, category, or location..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="search-icon">🔍</i>
            </button>
          </div>
        </form>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={filterCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {(localSearchTerm || filterCategory !== 'all' || sortBy !== 'name') && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      {/* Active filters display */}
      {(localSearchTerm || filterCategory !== 'all') && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {localSearchTerm && (
            <span className="filter-tag">
              Search: "{localSearchTerm}"
              <button 
                onClick={() => {
                  setLocalSearchTerm('');
                  onSearch('');
                }}
                className="remove-filter"
              >
                ×
              </button>
            </span>
          )}
          {filterCategory !== 'all' && (
            <span className="filter-tag">
              Category: {filterCategory}
              <button 
                onClick={() => onCategoryFilter('all')}
                className="remove-filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreSearch;