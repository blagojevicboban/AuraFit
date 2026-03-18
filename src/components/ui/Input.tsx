import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, labelClassName, error, icon, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className="space-y-1.5 focus-within:translate-y-[-2px] transition-transform">
        {label && (
          <label 
            htmlFor={inputId} 
            className={twMerge("text-zinc-400 font-semibold text-sm ml-1 uppercase tracking-widest", labelClassName)}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                "w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 px-5 py-3.5 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d6ff3e]/50 text-lg transition-all",
                icon && "pl-12",
                error && "border-rose-500 focus:ring-rose-500",
                className
              )
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-rose-500 text-sm mt-1 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
