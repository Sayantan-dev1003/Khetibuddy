import React from 'react';

function Select({ 
  label, 
  name,
  value, 
  onChange, 
  options = [],
  required = false,
  disabled = false,
  error = '',
  helperText = '',
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-4 text-lg border-2 border-[var(--primary-light)]/20 bg-white/50 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-300 disabled:bg-[var(--bg-alt)] disabled:cursor-not-allowed appearance-none ${error ? 'border-red-500' : ''} group-hover:bg-white`}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235d4037' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '3rem'
          }}
        >
          <option value="">Select an option</option>
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default Select;
