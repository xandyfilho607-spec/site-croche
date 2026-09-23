import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop com desfoque elegante */}
      <div
        className="fixed inset-0 bg-earth-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Janela Modal */}
      <div
        className={`relative bg-cream-50 rounded-2xl shadow-elevated border border-cream-200 w-full ${maxWidth} overflow-hidden z-10 animate-fade-in flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200/80 bg-cream-100/50">
            <h3 className="font-serif text-xl font-medium text-earth-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-earth-500 hover:text-earth-900 hover:bg-cream-200/60 transition-colors"
              aria-label="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Conteúdo com rolagem se necessário */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
