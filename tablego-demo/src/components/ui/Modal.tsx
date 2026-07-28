import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop — rgba(0,0,0,0.4) */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel — rounded-t-[20px] (移动端底部滑出) */}
      <div
        className={`
          relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto
          bg-white rounded-t-[20px] sm:rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          animate-slide-up px-5 py-5
          ${className}
        `.trim()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#1A1A2E]">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F9FA] text-[#9A9AAB] hover:bg-[#EEEEF0] transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}