// components/Loading.tsx
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin shadow-lg"></div>
    </div>
  );
};

export default Loading;
