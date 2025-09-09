import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'circular',
  color = '#3498db',
  text = null 
}) => {
  // Add CSS styles to document head
  React.useEffect(() => {
    const styleId = 'loading-spinner-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        .spinner-large {
          width: 60px;
          height: 60px;
          border-width: 6px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .spinner-dots {
          display: inline-block;
          position: relative;
          width: 40px;
          height: 40px;
        }

        .spinner-dots div {
          position: absolute;
          top: 16px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3498db;
          animation: spinner-dots 1.2s linear infinite;
        }

        .spinner-dots div:nth-child(1) { left: 4px; animation-delay: -0.24s; }
        .spinner-dots div:nth-child(2) { left: 16px; animation-delay: -0.12s; }
        .spinner-dots div:nth-child(3) { left: 28px; animation-delay: 0; }

        @keyframes spinner-dots {
          0%, 80%, 100% {
            transform: scale(0);
          } 
          40% {
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'spinner-small';
      case 'large': return 'spinner-large';
      default: return '';
    }
  };

  const getSpinnerStyle = () => {
    if (type === 'circular') {
      return {
        borderTopColor: color,
      };
    }
    return {};
  };

  const renderSpinner = () => {
    if (type === 'dots') {
      return (
        <div className="spinner-dots">
          <div style={{ backgroundColor: color }}></div>
          <div style={{ backgroundColor: color }}></div>
          <div style={{ backgroundColor: color }}></div>
        </div>
      );
    }

    return (
      <div 
        className={`spinner ${getSizeClass()}`} 
        style={getSpinnerStyle()}
      ></div>
    );
  };

  return (
    <div className="spinner-container">
      {renderSpinner()}
      {text && <span style={{ marginLeft: '10px', color: '#666' }}>{text}</span>}
    </div>
  );
};

// Create an alias for backward compatibility
export const LoadSpinner = LoadingSpinner;

export default LoadingSpinner;