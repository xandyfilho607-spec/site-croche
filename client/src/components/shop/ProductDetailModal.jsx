import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Sparkles, Check, Heart } from 'lucide-react';
import { Modal } from '../common/Modal';
import { ProductImage } from '../common/ProductImage';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export function ProductDetailModal({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAdded(false);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const isAvailable = product.available !== false;
  const unitPrice = parseFloat(product.price) || 0;
  const subtotal = unitPrice * quantity;

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    const success = addItem(product, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Foto Ampliada com tratamento */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="w-full h-full"
          />

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
        </div>

        {/* Informações e Ações */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">
                {product.category_name || 'Artesanal'}
              </span>
              <span className="text-[11px] text-earth-500 font-light flex items-center gap-1">
                <Heart className="w-3 h-3 text-sage-600" />
                Feito à mão
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-earth-900 leading-tight">
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-earth-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-earth-500">/ unidade</span>
            </div>

            {/* Descrição do Produto */}
            <div className="mt-4 pt-4 border-t border-cream-200/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-earth-600 mb-1.5">
                Detalhes da Peça
              </h4>
              <p className="text-sm text-earth-700 leading-relaxed font-light whitespace-pre-line">
                {product.description || 'Peça confeccionada artesanalmente em crochê com acabamento cuidadoso e materiais de excelente qualidade.'}
              </p>
            </div>
          </div>

          {/* Seleção de Quantidade e Botão */}
          <div className="pt-4 border-t border-cream-200/80 space-y-4">
            {isAvailable ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-earth-800">Quantidade:</span>
                  <div className="flex items-center border border-cream-300 rounded-xl bg-cream-100/80 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="p-2 text-earth-700 hover:bg-cream-200 disabled:opacity-40 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-earth-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="p-2 text-earth-700 hover:bg-cream-200 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-earth-600 px-1">
                  <span>Subtotal selecionado:</span>
                  <span className="font-bold text-earth-900 text-sm">{formatCurrency(subtotal)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-soft active:scale-[0.99] ${
                    isAdded
                      ? 'bg-sage-600 text-cream-50'
                      : 'bg-earth-800 hover:bg-earth-900 text-cream-50'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Adicionar ao carrinho</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <p className="text-sm font-medium text-rose-800">
                  Este produto está esgotado no momento.
                </p>
                <p className="text-xs text-rose-600 mt-1">
                  Você pode entrar em contato pelo WhatsApp para encomendar uma nova peça sob medida!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
