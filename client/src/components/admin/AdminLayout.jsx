import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  PlusCircle,
  History,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminLayout({
  activeTab,
  onTabChange,
  onBackToShop,
  children,
}) {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: FolderTree },
    { id: 'new-sale', label: 'Registrar Venda', icon: PlusCircle },
    { id: 'sales-history', label: 'Histórico de Vendas', icon: History },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Sessão encerrada com sucesso.');
      onBackToShop();
    } catch (err) {
      toast.error('Erro ao encerrar a sessão.');
    }
  };

  const handleSelectTab = (id) => {
    onTabChange(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-earth-900 text-cream-100 border-r border-earth-800 flex-shrink-0">
        {/* Topo do Sidebar */}
        <div className="p-6 border-b border-earth-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-earth-800 border border-gold-400/30 flex items-center justify-center text-gold-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-wide text-cream-50 leading-tight">
              Mereça Crochê
            </h1>
            <span className="text-[10px] uppercase font-semibold text-sage-400 tracking-wider">
              Painel de Gestão
            </span>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-earth-800 text-gold-300 shadow-sm border border-earth-700/60 font-semibold'
                    : 'text-cream-300 hover:text-cream-50 hover:bg-earth-850'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-cream-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé do Sidebar */}
        <div className="p-4 border-t border-earth-800 space-y-2">
          <button
            onClick={onBackToShop}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-cream-300 hover:text-white hover:bg-earth-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Loja Virtual</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Topbar Mobile */}
      <div className="md:hidden bg-earth-900 text-cream-100 px-4 py-3 flex items-center justify-between border-b border-earth-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-400" />
          <span className="font-serif font-bold text-cream-50 text-base">Painel Mereça</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToShop}
            className="p-1.5 rounded-lg text-cream-300 hover:text-white"
            title="Ver Loja"
          >
            <ExternalLink className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-cream-300 hover:text-white"
            aria-label="Menu administrativo"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Retrátil */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-earth-900 text-cream-100 border-b border-earth-800 p-4 space-y-2 animate-fade-in z-20">
          <div className="pb-2 mb-2 border-b border-earth-800 flex items-center gap-2 text-xs text-cream-400">
            <User className="w-4 h-4 text-gold-400" />
            <span>{currentUser?.email || 'Administradora'}</span>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-earth-800 text-gold-300'
                    : 'text-cream-300 hover:bg-earth-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-earth-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      )}

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Superior Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-cream-50 border-b border-cream-200">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-earth-500">
              Painel Administrativo
            </span>
            <h2 className="font-serif text-xl font-bold text-earth-900 capitalize">
              {menuItems.find((m) => m.id === activeTab)?.label || 'Visão Geral'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-200/80 text-earth-800 text-xs font-medium border border-cream-300">
              <User className="w-3.5 h-3.5 text-sage-600" />
              <span>{currentUser?.email || 'Administradora'}</span>
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
