import React from 'react';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ProductImage } from '../common/ProductImage';
import { Badge } from '../common/Badge';

export function ProductCard({ product, onOpenDetails, onQuickAdd }) {
  const isAvailable = product.available !== false;

  return (
    <div className="group bg-cream-50 rounded-2xl overflow-hidden border border-cream-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Imagem do Produto */}
      <div 
        className="relative aspect-square w-full cursor-pointer overflow-hidden"
        onClick={() => onOpenDetails(product)}
      >
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="w-full h-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Flutuantes */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <Badge variant="gold" size="sm" className="shadow-sm">
              <Sparkles className="w-3 h-3 mr-1 text-gold-600" />
              Destaque
            </Badge>
          )}
          {!isAvailable && (
            <Badge variant="danger" size="sm" className="shadow-sm">
              Esgotado
            </Badge>
          )}
        </div>

        {/* Overlay com botão de espiar */}
        <div className="absolute inset-0 bg-earth-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-50/95 text-earth-900 text-xs font-medium shadow-md backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5" />
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Categoria */}
          <div className="text-[11px] font-semibold uppercase tracking-wider text-sage-600 mb-1">
            {product.category_name || 'Artesanato'}
          </div>

          {/* Nome */}
          <h3 
            className="font-serif text-base sm:text-lg font-semibold text-earth-900 line-clamp-1 group-hover:text-earth-700 transition-colors cursor-pointer"
            onClick={() => onOpenDetails(product)}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Descrição Curta */}
          {product.description && (
            <p className="text-xs text-earth-600 line-clamp-2 mt-1 font-light leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Preço e Ação */}
        <div className="pt-4 mt-3 border-t border-cream-200/70 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-earth-500 block">Preço</span>
            <span className="font-serif text-lg font-bold text-earth-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenDetails(product)}
              className="p-2 rounded-xl text-earth-600 hover:text-earth-950 hover:bg-cream-200 transition-colors"
              title="Visualizar detalhes do produto"
              aria-label={`Ver detalhes de ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onQuickAdd(product)}
              disabled={!isAvailable}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isAvailable
                  ? 'bg-earth-800 hover:bg-earth-900 text-cream-50 shadow-sm active:scale-95'
                  : 'bg-cream-200 text-earth-400 cursor-not-allowed'
              }`}
              title={isAvailable ? 'Adicionar ao carrinho' : 'Produto indisponível no momento'}
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
