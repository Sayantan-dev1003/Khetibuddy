import React from 'react';

function PrimaryButton({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'lg',
  className = '',
  fullWidth = false,
  icon
}) {
  const baseClasses = 'font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:ring-[var(--primary)]/20 focus:outline-none active:scale-[0.98]';
  
  const variantClasses = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--earth-deep)] text-white',
    secondary: 'bg-[var(--secondary)] hover:opacity-90 text-white',
    outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5',
    accent: 'bg-[var(--accent)] hover:opacity-90 text-white',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg md:text-xl',
    xl: 'px-10 py-5 text-xl md:text-2xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

export default PrimaryButton;
