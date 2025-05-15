
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="relative h-12 w-12 overflow-hidden">
        <img 
          src="https://i.ibb.co/qMkKzK3V/Screenshot-2025-05-16-at-12-53-22-AM-removebg-preview.png"
          alt="SolWeb Logo"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
