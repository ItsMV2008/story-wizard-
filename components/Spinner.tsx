
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
