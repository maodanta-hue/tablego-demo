import { useEffect, useState, useCallback } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let addToastFn: ((message: string, type: ToastItem['type']) => void) | null = null;

/** 全局弹出 toast（不依赖 React 组件树） */
export function showToast(message: string, type: ToastItem['type'] = 'success') {
  addToastFn?.(message, type);
}

const typeIcons: Record<ToastItem['type'], string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const typeClasses: Record<ToastItem['type'], string> = {
  success: 'bg-white text-gray-800 border border-gray-100',
  error: 'bg-red-50 text-red-700 border border-red-100',
  info: 'bg-blue-50 text-blue-700 border border-blue-100',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem['type']) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            toast-enter px-5 py-3 rounded-[14px] shadow-lg text-sm font-medium
            flex items-center gap-2 min-w-[200px] max-w-[340px]
            ${typeClasses[t.type]}
          `.trim()}
        >
          <span className="text-base">{typeIcons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}