import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/shop/HomePage';
import { AdminDashboardHub } from './pages/admin/AdminDashboardHub';

export function App() {
  const [currentView, setCurrentView] = useState(() => {
    // Detectar se a URL inicial é /admin
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        return 'admin';
      }
    }
    return 'shop';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('shop');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin');
    window.scrollTo(0, 0);
  };

  const navigateToShop = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('shop');
    window.scrollTo(0, 0);
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {currentView === 'admin' ? (
            <AdminDashboardHub onBackToShop={navigateToShop} />
          ) : (
            <HomePage onNavigateToAdmin={navigateToAdmin} />
          )}
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
