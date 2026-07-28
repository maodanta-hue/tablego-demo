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
        <span className="absolute left-3 text-[#9A9AAB] flex items-center justify-center w-5 h-5">
          {leftIcon}
        </span>
      )}
      <input
        className={`
          w-full bg-[#F8F9FA] border border-[#EEEEF0] text-[#1A1A2E] text-[14px]
          outline-none transition-all duration-150
          focus:bg-white focus:border-[#1A6B3C] focus:ring-1 focus:ring-[#1A6B3C]/20
          placeholder:text-[#9A9AAB]
          ${leftIcon ? 'pl-10' : 'pl-4'}
          ${rightIcon ? 'pr-10' : 'pr-4'}
          py-2.5 rounded-[12px]
          ${className}
        `.trim()}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 text-[#9A9AAB] flex items-center justify-center w-5 h-5 cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  );
}