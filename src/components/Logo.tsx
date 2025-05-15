
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="relative h-16 w-32 overflow-hidden">
        <img 
          src="https://i.ibb.co/G4Mhks0N/Screenshot-2025-05-16-at-1-07-24-AM-removebg-preview.png"
          alt="SolWeb Logo"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
