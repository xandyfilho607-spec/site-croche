import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DashboardPage } from './DashboardPage';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminCategoriesPage } from './AdminCategoriesPage';
import { AdminNewSalePage } from './AdminNewSalePage';
import { AdminSalesHistoryPage } from './AdminSalesHistoryPage';
import { AdminSettingsPage } from './AdminSettingsPage';

export function AdminDashboardHub({ onBackToShop }) {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Proteção de rotas do painel: Usuários não autenticados veem a tela de login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onBackToShop={onBackToShop}
        onLoginSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBackToShop={onBackToShop}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          onNavigateToNewSale={() => setActiveTab('new-sale')}
          onNavigateToProducts={() => setActiveTab('products')}
        />
      )}

      {activeTab === 'products' && <AdminProductsPage />}

      {activeTab === 'categories' && <AdminCategoriesPage />}

      {activeTab === 'new-sale' && (
        <AdminNewSalePage
          onSaleRegistered={() => setActiveTab('sales-history')}
        />
      )}

      {activeTab === 'sales-history' && <AdminSalesHistoryPage />}

      {activeTab === 'settings' && <AdminSettingsPage />}
    </AdminLayout>
  );
}
