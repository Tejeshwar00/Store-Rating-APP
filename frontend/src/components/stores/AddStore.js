import React, { useState } from 'react';
// ... your other imports
import LoadingSpinner from '../common/LoadingSpinner';

const AddStore = () => {
  // Add this line right here - inside the component, at the top
  const LoadSpinner = () => <div>Loading...</div>;
  
  // Your existing state variables
  const [formData, setFormData] = useState({
    // your form fields
  });
  const [loading, setLoading] = useState(false);
  
  // Your existing functions
  const handleSubmit = (e) => {
    e.preventDefault();
    // your submit logic
  };
  
  const handleInputChange = (e) => {
    // your input change logic
  };
  
  // Your existing JSX return
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Your existing form fields */}
        
        {/* Your existing LoadSpinner usage on lines 269 and 549 will now work */}
        {loading && <LoadSpinner />}
        
        <button type="submit" disabled={loading}>
          {loading ? <LoadSpinner /> : 'Add Store'}
        </button>
      </form>
    </div>
  );
};

export default AddStore;