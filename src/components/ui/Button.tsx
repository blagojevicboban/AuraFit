import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = 'primary', 
      size = 'md', 
      isLoading, 
      fullWidth, 
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    // Base styles all buttons share
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
    
    // Variant specific styles (matching UI kit)
    const variants = {
      primary: 'bg-[#d6ff3e] text-[#1c1c1c] hover:bg-[#c2e638] shadow-[0_4px_14px_0_rgba(214,255,62,0.39)]',
      secondary: 'bg-[#afa3ff] text-[#1c1c1c] hover:bg-[#9d92e6] shadow-[0_4px_14px_0_rgba(175,163,255,0.39)]',
      ghost: 'bg-transparent text-white hover:bg-white/10',
      outline: 'bg-transparent border-2 border-zinc-700 text-white hover:bg-zinc-800'
    };

    // Size specific styles
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
          )
        )}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
