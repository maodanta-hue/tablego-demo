import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="relative flex items-center">
      {leftIcon && (
        <span className="absolute left-3 text-gray-400 flex items-center justify-center w-5 h-5">
          {leftIcon}
        </span>
      )}
      <input
        className={`
          w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm
          outline-none transition-all duration-150
          focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-200
          placeholder:text-gray-400
          ${leftIcon ? 'pl-10' : 'pl-4'}
          ${rightIcon ? 'pr-10' : 'pr-4'}
          py-2.5 rounded-[12px]
          ${className}
        `.trim()}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 text-gray-400 flex items-center justify-center w-5 h-5 cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  );
}