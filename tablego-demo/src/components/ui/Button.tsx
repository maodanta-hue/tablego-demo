import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1A6B3C] text-white hover:bg-[#0D4A2A] active:bg-[#0D4A2A] shadow-xs',
  secondary:
    'bg-[#F8F9FA] text-[#4A4A5A] hover:bg-[#EEEEF0] active:bg-[#E0E0E5]',
  outline:
    'bg-white text-[#1A6B3C] border border-[#1A6B3C] hover:bg-[#E8F5E9] active:bg-[#C8E6C9]',
  ghost:
    'bg-transparent text-[#4A4A5A] hover:bg-[#F8F9FA] active:bg-[#EEEEF0]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-[11px] px-3 h-8 rounded-[8px]',
  md: 'text-[14px] px-4 h-10 rounded-[12px] font-medium',
  lg: 'text-[16px] px-6 h-12 rounded-[14px] font-semibold',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center transition-all duration-150
        active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        select-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}