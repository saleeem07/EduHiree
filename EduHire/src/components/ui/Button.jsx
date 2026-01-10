import React from 'react';

const VARIANTS = {
  primary: 'inline-flex items-center justify-center bg-gradient-to-r from-brand-green to-brand-light text-white px-5 py-2 rounded-xl-2 shadow-elevated hover:scale-105 transition-transform',
  secondary: 'inline-flex items-center justify-center bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:shadow-md transition',
  ghost: 'inline-flex items-center justify-center bg-transparent text-gray-800 px-3 py-1.5 rounded'
};

const SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

const Button = ({ variant = 'primary', size = 'md', className = '', leftIcon, rightIcon, children, ...props }) => {
  const base = `${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
  return (
    <button className={base} {...props}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
