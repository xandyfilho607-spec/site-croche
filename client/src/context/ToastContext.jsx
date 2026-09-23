import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container flutuante */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-card border backdrop-blur-sm transition-all duration-300 transform animate-fade-in ${
              item.type === 'success'
                ? 'bg-sage-50/95 border-sage-300 text-sage-800'
                : item.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-800'
                : item.type === 'warning'
                ? 'bg-amber-50/95 border-amber-200 text-amber-800'
                : 'bg-cream-100/95 border-cream-300 text-earth-800'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-sage-600" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-earth-600" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-snug">{item.message}</div>
            <button
              onClick={() => removeToast(item.id)}
              className="flex-shrink-0 text-earth-400 hover:text-earth-700 transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser utilizado dentro de um ToastProvider');
  }
  return context;
}
