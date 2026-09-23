import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  ShoppingBag,
  Calendar,
  DollarSign,
  User,
} from 'lucide-react';
import { api } from '../../services/api';
import { SaleDetailModal } from '../../components/admin/SaleDetailModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function AdminSalesHistoryPage() {
  const toast = useToast();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal de detalhes
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadSales = async () => {
    setLoading(true);
    try {
      const res = await api.getSales({ limit: 100 });
      setSales(res?.data || []);
    } catch (err) {
      console.error('Erro ao carregar histórico de vendas:', err);
      toast.error('Erro ao carregar vendas do banco Neon.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleOpenSale = (sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const handleDeleteSale = async (id) => {
    try {
      await api.deleteSale(id);
      toast.success('Venda excluída do Neon com sucesso.');
      loadSales();
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir venda.');
    }
  };

  // Filtragem local por cliente ou notas
  const filteredSales = sales.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      s.customer_name.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
  });

  const totalFaturadoHistorico = filteredSales.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Topo da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Histórico de Vendas
          </h1>
          <p className="text-xs text-earth-600 font-light mt-0.5">
            Registro detalhado de todas as encomendas confirmadas e faturadas no Neon.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadSales}
            className="p-2.5 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-200 text-earth-700 transition-colors"
            title="Recarregar histórico"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de Busca e Totais Rápidos */}
      <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome da cliente..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-cream-300 bg-white text-earth-900 focus:outline-none focus:border-sage-500"
          />
        </div>

        <div className="text-xs text-earth-700 font-medium">
          Total listado: <strong className="font-serif text-sm text-earth-900 font-bold">{formatCurrency(totalFaturadoHistorico)}</strong> ({filteredSales.length} vendas)
        </div>
      </div>

      {/* Conteúdo: Tabela de Vendas */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner size="lg" text="Carregando vendas do banco Neon..." />
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="py-20 text-center bg-cream-50 rounded-2xl border border-cream-200 p-8 space-y-3">
          <History className="w-12 h-12 text-earth-400 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-earth-900">
            Nenhuma venda encontrada
          </h3>
          <p className="text-xs text-earth-600 font-light max-w-sm mx-auto">
            Quando fechar pedidos com clientes no WhatsApp, use o menu "Registrar Venda" para incluí-las aqui.
          </p>
        </div>
      ) : (
        <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cream-200 text-xs">
              <thead className="bg-cream-100 text-earth-700 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left">Data</th>
                  <th scope="col" className="px-4 py-3.5 text-left">Cliente</th>
                  <th scope="col" className="px-4 py-3.5 text-left">Produtos Comprados</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Total Faturado</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/80 bg-cream-50">
                {filteredSales.map((sale) => {
                  const rawItems = typeof sale.items === 'string'
                    ? JSON.parse(sale.items || '[]')
                    : (sale.items || []);

                  return (
                    <tr key={sale.id} className="hover:bg-cream-100/40 transition-colors">
                      {/* Data */}
                      <td className="px-4 py-3 whitespace-nowrap text-earth-600">
                        {formatDate(sale.created_at)}
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3 whitespace-nowrap font-serif font-semibold text-earth-900 text-sm">
                        {sale.customer_name}
                      </td>

                      {/* Resumo de Produtos */}
                      <td className="px-4 py-3 text-earth-700 max-w-xs truncate">
                        {rawItems.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 whitespace-nowrap text-right font-serif font-bold text-earth-900 text-sm">
                        {formatCurrency(sale.total)}
                      </td>

                      {/* Ações: Ver Detalhes e Excluir Individual */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenSale(sale)}
                            className="p-1.5 rounded-lg text-earth-600 hover:text-earth-950 hover:bg-cream-200 transition-colors"
                            title="Ver detalhes da venda"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja excluir a venda #${sale.id} da cliente "${sale.customer_name}"?`)) {
                                handleDeleteSale(sale.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Excluir venda individual"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
