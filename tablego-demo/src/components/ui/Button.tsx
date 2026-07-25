import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#E53935] text-white hover:bg-[#C62828] active:bg-[#B71C1C] shadow-sm shadow-red-200',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
  outline:
    'bg-white text-[#E53935] border border-[#E53935] hover:bg-red-50 active:bg-red-100',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-[10px]',
  md: 'text-sm px-4 py-2.5 rounded-[12px] font-medium',
  lg: 'text-base px-6 py-3.5 rounded-[14px] font-semibold',
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