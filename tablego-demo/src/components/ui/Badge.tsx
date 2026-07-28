import React from 'react';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'gray';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#E8F5E9] text-[#1A6B3C]',
  accent: 'bg-[#FBE9E7] text-[#D84315]',
  success: 'bg-[#E8F5E9] text-[#1A6B3C]',
  warning: 'bg-[#FEF3C7] text-[#F59E0B]',
  gray: 'bg-[#F8F9FA] text-[#9A9AAB]',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-[12px] px-2.5 py-1',
};

export default function Badge({
  variant = 'gray',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}