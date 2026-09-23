import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const STORAGE_KEY = 'mereca_croche_cart';

export function CartProvider({ children }) {
  const toast = useToast();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Erro ao ler carrinho do localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sincronizar com localStorage sempre que items mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Erro ao salvar carrinho no localStorage:', err);
    }
  }, [items]);

  // Adicionar produto ao carrinho
  const addItem = (product, quantity = 1) => {
    if (!product || product.available === false) {
      toast.warning('Este produto está esgotado no momento.');
      return false;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image_url: product.image_url,
            category_name: product.category_name,
            quantity: qty,
          },
        ];
      }
    });

    toast.success(`"${product.name}" adicionado ao carrinho!`);
    return true;
  };

  // Atualizar quantidade de um item
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // Remover item do carrinho
  const removeItem = (productId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.id === productId);
      if (itemToRemove) {
        toast.info(`"${itemToRemove.name}" removido do carrinho.`);
      }
      return prevItems.filter((i) => i.id !== productId);
    });
  };

  // Limpar todo o carrinho
  const clearCart = () => {
    setItems([]);
  };

  // Métricas calculadas
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotal = total;

  const value = {
    items,
    totalItems,
    subtotal,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    isCheckoutOpen,
    setIsCheckoutOpen,
    openCheckout: () => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    },
    closeCheckout: () => setIsCheckoutOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser utilizado dentro de um CartProvider');
  }
  return context;
}
