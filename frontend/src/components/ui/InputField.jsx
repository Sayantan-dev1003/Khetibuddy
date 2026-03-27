import React from 'react';

function InputField({ 
  label, 
  name,
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  icon,
  className = ''
}) {
  return (
    <div className={`mb-6 group ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-[var(--primary)] text-lg font-bold mb-2 transition-colors group-focus-within:text-[var(--accent)]">
          {label} {required && <span className="text-[var(--accent)]">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4 text-base border-2 border-[var(--primary-light)]/20 bg-white/50 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-300 disabled:bg-[var(--bg-alt)] disabled:cursor-not-allowed ${error ? 'border-red-500' : ''} group-hover:bg-white`}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-[var(--text-muted)] text-sm mt-2">{helperText}</p>
      )}
    </div>
  );
}

export default InputField;
