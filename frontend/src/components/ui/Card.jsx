import React from 'react';

function Card({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'sm',
  hover = true,
  bordered = true 
}) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  const hoverActive = hover ? 'hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 hover:border-[var(--primary-light)]/30' : '';
  const borderStyle = bordered ? 'border border-[var(--primary-light)]/15' : '';
  
  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverActive} ${borderStyle} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
