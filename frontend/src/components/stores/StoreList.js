import React, { useState, useEffect } from 'react';
import StoreCard from './StoreCard';
import StoreSearch from './StoreSearch';
import LoadingSpinner from '../common/LoadingSpinner';
import './StoreList.css';
// Remove this line: import { mockStores } from '../../data/mockData';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage] = useState(8);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterAndSortStores();
  }, [stores, searchTerm, sortBy, filterCategory]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      // Updated to use your backend URL
      const response = await fetch('http://localhost:5000/api/stores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }

      const data = await response.json();
      setStores(data);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStores = () => {
    let filtered = stores;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.description && store.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(store => store.category === filterCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        case 'oldest':
          return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
        default:
          return 0;
      }
    });

    setFilteredStores(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const handleStoreUpdate = (updatedStore) => {
    setStores(prevStores =>
      prevStores.map(store =>
        store.id === updatedStore.id ? updatedStore : store
      )
    );
  };

  const handleStoreDelete = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/stores/${storeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete store');
        }

        setStores(prevStores => prevStores.filter(store => store.id !== storeId));
      } catch (err) {
        setError(err.message);
        console.error('Error deleting store:', err);
      }
    }
  };

  // Pagination
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const categories = [...new Set(stores.map(store => store.category))];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="store-list-container">
      <div className="store-list-header">
        <h2>All Stores</h2>
        <div className="store-count">
          {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'} found
        </div>
      </div>

      <StoreSearch
        onSearch={handleSearch}
        onSort={handleSort}
        onCategoryFilter={handleCategoryFilter}
        categories={categories}
        searchTerm={searchTerm}
        sortBy={sortBy}
        filterCategory={filterCategory}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="stores-grid">
        {currentStores.length > 0 ? (
          currentStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onUpdate={handleStoreUpdate}
              onDelete={handleStoreDelete}
            />
          ))
        ) : (
          <div className="no-stores">
            {searchTerm || filterCategory !== 'all' ? (
              <p>No stores found matching your criteria.</p>
            ) : (
              <p>No stores available yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            );
          })}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreList;