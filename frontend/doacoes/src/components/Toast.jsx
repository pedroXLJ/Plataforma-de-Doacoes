import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose && onClose(), 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const bg = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${bg} text-white px-6 py-4 rounded-md shadow-lg max-w-2xl w-[min(90vw,640px)]`} role="status">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="font-medium">{toast.title || (toast.type === 'success' ? 'Sucesso' : toast.type === 'error' ? 'Erro' : 'Info')}</div>
            <div className="text-sm mt-1">{toast.message}</div>
          </div>
          <button onClick={() => onClose && onClose()} className="text-white opacity-90 hover:opacity-100 ml-4">✕</button>
        </div>
      </div>
    </div>
  );
}
