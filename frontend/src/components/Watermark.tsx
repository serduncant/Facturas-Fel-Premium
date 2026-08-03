import React from 'react';

interface WatermarkProps {
  show: boolean;
  children: React.ReactNode;
}

export const Watermark: React.FC<WatermarkProps> = ({ show, children }) => {
  if (!show) return <>{children}</>;
  
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-10">
        <div className="text-6xl font-bold text-gray-900 rotate-[-45deg] select-none">
          PLAN GRATUITO
        </div>
      </div>
    </div>
  );
};
