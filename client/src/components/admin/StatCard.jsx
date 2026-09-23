import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'sage' }) {
  const colorSchemes = {
    sage: {
      bg: 'bg-sage-50',
      border: 'border-sage-200',
      iconBg: 'bg-sage-100',
      iconColor: 'text-sage-700',
    },
    gold: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
    },
    earth: {
      bg: 'bg-cream-100',
      border: 'border-cream-300',
      iconBg: 'bg-cream-200',
      iconColor: 'text-earth-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.sage;

  return (
    <div className={`p-5 rounded-2xl border ${scheme.border} ${scheme.bg} shadow-soft flex items-center gap-4 transition-all duration-300 hover:shadow-card`}>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl ${scheme.iconBg} ${scheme.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-earth-600 block truncate">
          {title}
        </span>
        <div className="font-serif text-2xl font-bold text-earth-900 mt-0.5 tracking-tight truncate">
          {value}
        </div>
        {subtitle && (
          <span className="text-[11px] text-earth-500 font-light block mt-0.5 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
