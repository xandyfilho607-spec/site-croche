import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export function SalesChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-earth-500 text-sm italic font-light">
        Ainda não há dados suficientes para gerar o gráfico dos últimos 7 dias.
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.total_revenue), 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-earth-600">
        <span>Faturamento diário (Últimos 7 dias)</span>
        <span className="font-semibold text-earth-900">
          Pico: {formatCurrency(maxRevenue)}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-cream-200">
        {data.map((item, index) => {
          const heightPercent = maxRevenue > 0 ? (item.total_revenue / maxRevenue) * 100 : 0;
          const displayHeight = Math.max(heightPercent, 4); // Altura mínima visível

          return (
            <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip no hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-12 bg-earth-900 text-cream-50 text-[10px] py-1 px-2 rounded-md pointer-events-none shadow-md whitespace-nowrap z-20">
                {item.sales_count} venda(s): {formatCurrency(item.total_revenue)}
              </div>

              {/* Barra */}
              <div className="w-full max-w-[36px] bg-cream-200 rounded-t-lg overflow-hidden flex items-end relative h-full">
                <div
                  style={{ height: `${displayHeight}%` }}
                  className={`w-full transition-all duration-500 rounded-t-lg ${
                    item.total_revenue > 0
                      ? 'bg-gradient-to-t from-sage-600 to-sage-400 group-hover:from-sage-700 group-hover:to-sage-500'
                      : 'bg-cream-300/40'
                  }`}
                />
              </div>

              {/* Rótulo do dia */}
              <span className="text-[11px] font-medium text-earth-600 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
