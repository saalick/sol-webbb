
import React from 'react';

const BackgroundEffect = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[40%] -right-[20%] h-[80vh] w-[80vh] rounded-full bg-solana/20 blur-[120px]" />
      <div className="absolute top-[20%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-solana-accent/10 blur-[120px]" />
      <div className="absolute -bottom-[40%] left-[30%] h-[80vh] w-[80vh] rounded-full bg-solana-secondary/10 blur-[120px]" />
      <div className="hidden lg:block absolute top-[10%] right-[10%] h-[40vh] w-[40vh] rounded-full bg-solana/10 blur-[120px]" />
      <div className="hidden lg:block absolute bottom-[10%] left-[5%] h-[30vh] w-[30vh] rounded-full bg-solana-accent/5 blur-[100px]" />
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
  );
};

export default BackgroundEffect;
