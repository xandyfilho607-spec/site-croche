import React from 'react';
import { User, Calendar, FileText, ShoppingBag, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function SaleDetailModal({ isOpen, onClose, sale, onDelete }) {
  if (!sale) return null;

  const rawItems = typeof sale.items === 'string' ? JSON.parse(sale.items || '[]') : (sale.items || []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalhes da Venda #${sale.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Informações Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-cream-100/60 border border-cream-200">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-sage-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-earth-500 block">Cliente</span>
              <span className="text-sm font-semibold text-earth-900">{sale.customer_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-gold-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-earth-500 block">Data e Hora</span>
              <span className="text-sm font-medium text-earth-800">{formatDate(sale.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos Comprados */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-earth-700" />
            <h4 className="font-serif text-sm font-semibold text-earth-900">
              Produtos da Venda
            </h4>
          </div>

          <div className="border border-cream-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-cream-200 text-xs">
              <thead className="bg-cream-100 text-earth-700 font-semibold uppercase text-[10px]">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left">Item</th>
                  <th scope="col" className="px-2 py-2 text-center">Qtd</th>
                  <th scope="col" className="px-3 py-2 text-right">Unitário</th>
                  <th scope="col" className="px-3 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/70 bg-cream-50">
                {rawItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 font-medium text-earth-900">
                      {item.name}
                    </td>
                    <td className="px-2 py-2 text-center text-earth-700">
                      {item.quantity}x
                    </td>
                    <td className="px-3 py-2 text-right text-earth-600">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-earth-900">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Geral */}
            <div className="p-3.5 bg-cream-100/90 border-t border-cream-200 flex justify-between items-baseline">
              <span className="font-serif text-sm font-semibold text-earth-900">Total Faturado:</span>
              <span className="font-serif text-xl font-bold text-earth-900">
                {formatCurrency(sale.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Observações da Venda */}
        {sale.notes && (
          <div className="p-3.5 rounded-xl bg-cream-100/40 border border-cream-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-earth-700">
              <FileText className="w-3.5 h-3.5 text-earth-500" />
              <span>Observações / Detalhes de Entrega:</span>
            </div>
            <p className="text-xs text-earth-700 whitespace-pre-line font-light">
              {sale.notes}
            </p>
          </div>
        )}

        {/* Ações do Modal */}
        <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Deseja realmente excluir o registro da venda #${sale.id}? Esta ação não pode ser desfeita.`)) {
                onDelete(sale.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir esta venda</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-earth-800 hover:bg-earth-900 text-cream-50 shadow-soft transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
