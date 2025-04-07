import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-75 z-50">
      <CircularProgress />
    </div>
  );
}

export default LoadingOverlay;