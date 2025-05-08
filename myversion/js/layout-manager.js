// layout-manager.js
import React from 'react';

const LayoutManager = ({ children }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return React.createElement("div", {
    className: "w-full",
    style: {
      minHeight: '100vh',
      paddingBottom: '0' // Removed the conditional padding
    }
  }, children);
};

// Make the component available globally
window.LayoutManager = LayoutManager;

// Export the component
export { LayoutManager };