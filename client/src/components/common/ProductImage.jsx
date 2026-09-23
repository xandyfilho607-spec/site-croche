import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export function ProductImage({ src, alt, className = '', imgClassName = '' }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-cream-100 flex items-center justify-center ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-cream-200/60 animate-pulse flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-gold-500 animate-spin opacity-40" />
        </div>
      )}

      {src && !hasError ? (
        <img
          src={src}
          alt={alt || 'Produto de Crochê'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${imgClassName}`}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-earth-400 bg-gradient-to-br from-cream-100 to-cream-200">
          <div className="w-12 h-12 rounded-full bg-cream-300/60 flex items-center justify-center mb-2">
            <ImageIcon className="w-6 h-6 text-earth-500" />
          </div>
          <span className="text-xs font-serif italic text-earth-600">Peça Feita à Mão</span>
        </div>
      )}
    </div>
  );
}
