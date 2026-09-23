import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { ProductImage } from '../common/ProductImage';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    total,
    totalItems,
    openCheckout,
  } = useCart();

  // Bloquear scroll do body quando o carrinho estiver aberto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop com desfoque */}
      <div
        className="fixed inset-0 bg-earth-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-cream-200 animate-fade-in">
          {/* Topo do Carrinho */}
          <div className="px-6 py-5 border-b border-cream-200/80 flex items-center justify-between bg-cream-100/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-earth-800" />
              <h3 className="font-serif text-xl font-semibold text-earth-900">
                Sua Sacola
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cream-300/80 text-earth-800">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-xl text-earth-500 hover:text-earth-950 hover:bg-cream-200 transition-colors"
              aria-label="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-earth-400 mb-4">
                  <ShoppingBag className="w-8 h-8 text-earth-500 opacity-60" />
                </div>
                <h4 className="font-serif text-lg font-medium text-earth-900 mb-1">
                  Sua sacola está vazia
                </h4>
                <p className="text-sm text-earth-600 max-w-xs font-light mb-6">
                  Nenhum produto foi adicionado ainda. Explore o catálogo e escolha suas peças artesanais favoritas!
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-earth-800 hover:bg-earth-900 text-cream-50 text-sm font-medium transition-all shadow-soft"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemSubtotal = item.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-cream-100/50 border border-cream-200/90 shadow-xs"
                  >
                    {/* Imagem do Item */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0 border border-cream-200">
                      <ProductImage
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Detalhes do Item */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold uppercase text-sage-600 block">
                            {item.category_name || 'Crochê'}
                          </span>
                          <h5 className="font-serif text-sm font-semibold text-earth-900 line-clamp-1">
                            {item.name}
                          </h5>
                          <span className="text-xs text-earth-600 block mt-0.5">
                            {formatCurrency(item.price)} un.
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-earth-400 hover:text-rose-600 transition-colors"
                          title="Remover produto da sacola"
                          aria-label={`Remover ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Controle de Quantidade e Subtotal */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-cream-300 rounded-lg bg-cream-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-earth-700 hover:bg-cream-200 transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-earth-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-earth-700 hover:bg-cream-200 transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif text-sm font-bold text-earth-900">
                          {formatCurrency(itemSubtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé do Carrinho com Totais e Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-cream-200/80 bg-cream-100/60 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-earth-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-cream-200/80">
                  <span className="font-serif text-base font-semibold text-earth-900">Total do Pedido:</span>
                  <span className="font-serif text-2xl font-bold text-earth-900">
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-[11px] text-earth-500 italic">
                  * O envio e formas de pagamento serão combinados diretamente pelo WhatsApp.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={openCheckout}
                  className="w-full py-3.5 px-6 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 font-medium text-sm transition-all shadow-soft flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>Revisar e Finalizar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full py-2.5 text-xs text-earth-600 hover:text-earth-900 font-medium text-center"
                >
                  Continuar escolhendo produtos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
