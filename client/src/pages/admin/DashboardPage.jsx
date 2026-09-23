import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Calendar,
  PlusCircle,
  ArrowUpRight,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';
import { StatCard } from '../../components/admin/StatCard';
import { SalesChart } from '../../components/admin/SalesChart';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { SaleDetailModal } from '../../components/admin/SaleDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function DashboardPage({ onNavigateToNewSale, onNavigateToProducts }) {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
      toast.error('Não foi possível carregar as métricas da dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleOpenSale = (sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const handleDeleteSale = async (id) => {
    try {
      await api.deleteSale(id);
      toast.success('Venda excluída do Neon com sucesso.');
      loadStats();
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir venda.');
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner size="lg" text="Atualizando métricas em tempo real..." />
      </div>
    );
  }

  const today = stats?.today || { sales: 0, revenue: 0 };
  const month = stats?.month || { sales: 0, revenue: 0 };
  const products = stats?.products || { total: 0, available: 0, sold_out: 0 };
  const chartData = stats?.chartData || [];
  const recentSales = stats?.recentSales || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Topo com Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Visão Geral das Vendas
          </h1>
          <p className="text-xs text-earth-600 font-light mt-0.5">
            Acompanhe o faturamento confirmado no WhatsApp e o estoque cadastrado no Neon.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadStats}
            className="p-2.5 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-200 text-earth-700 transition-colors"
            title="Recarregar métricas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToNewSale}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth-800 hover:bg-earth-900 text-cream-50 text-xs font-medium shadow-soft transition-all active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Grid de Cards Métricos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Faturamento de Hoje */}
        <StatCard
          title="Faturamento de Hoje"
          value={formatCurrency(today.revenue)}
          subtitle={`${today.sales} venda(s) realizada(s)`}
          icon={DollarSign}
          color="sage"
        />

        {/* Faturamento do Mês */}
        <StatCard
          title="Faturamento do Mês"
          value={formatCurrency(month.revenue)}
          subtitle={`${month.sales} vendas no mês atual`}
          icon={TrendingUp}
          color="gold"
        />

        {/* Vendas do Mês */}
        <StatCard
          title="Vendas Registradas"
          value={month.sales}
          subtitle="Total acumulado no mês"
          icon={ShoppingBag}
          color="emerald"
        />

        {/* Total de Produtos */}
        <StatCard
          title="Produtos no Catálogo"
          value={products.total}
          subtitle={`${products.available} disponíveis • ${products.sold_out} esgotados`}
          icon={Package}
          color="earth"
        />
      </div>

      {/* Seção Central: Gráfico de 7 Dias e Vendas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gráfico de Faturamento dos Últimos 7 Dias */}
        <div className="lg:col-span-7 bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-earth-900">
                Evolução do Faturamento
              </h3>
              <p className="text-xs text-earth-500 font-light">
                Histórico dos últimos 7 dias no Neon
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sage-100 text-sage-800">
              7 Dias
            </span>
          </div>

          <SalesChart data={chartData} />
        </div>

        {/* Lista de Vendas Recentes */}
        <div className="lg:col-span-5 bg-cream-50 rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-earth-900">
              Últimas Vendas
            </h3>
            <span className="text-xs text-earth-500 font-light">
              Registradas recentemente
            </span>
          </div>

          {recentSales.length === 0 ? (
            <div className="py-10 text-center text-xs text-earth-500 font-light italic">
              Nenhuma venda registrada ainda. Quando fechar uma encomenda no WhatsApp, clique em "Registrar Nova Venda".
            </div>
          ) : (
            <div className="divide-y divide-cream-200/80">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="py-3 flex items-center justify-between gap-3 group"
                >
                  <div>
                    <h5 className="font-serif text-sm font-semibold text-earth-900">
                      {sale.customer_name}
                    </h5>
                    <span className="text-[11px] text-earth-500 block">
                      {formatDate(sale.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif text-sm font-bold text-earth-900">
                      {formatCurrency(sale.total)}
                    </span>
                    <button
                      onClick={() => handleOpenSale(sale)}
                      className="p-1.5 rounded-lg text-earth-500 hover:text-earth-900 hover:bg-cream-200 transition-colors"
                      title="Ver detalhes da venda"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes da Venda */}
      <SaleDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        sale={selectedSale}
        onDelete={handleDeleteSale}
      />
    </div>
  );
}
