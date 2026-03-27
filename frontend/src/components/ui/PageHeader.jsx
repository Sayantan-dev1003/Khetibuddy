import React from 'react';

function PageHeader({ icon, title, subtitle, className = '' }) {
  return (
    <div className={`page-header mb-12 ${className}`}>
      <div className="relative z-10">
        {icon && <div className="text-6xl mb-6 drop-shadow-md animate-bounce-slow">{icon}</div>}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {/* Decorative leaf/soil element simulation */}
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--secondary)] rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-[var(--accent)] rounded-full blur-3xl opacity-20"></div>
    </div>
  );
}

export default PageHeader;
