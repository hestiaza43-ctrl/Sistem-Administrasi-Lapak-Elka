import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface StatsCardProps {
  title: string;
  value: number | string;
  isCurrency?: boolean;
  trend?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'purple' | 'cyan' | 'mint' | 'coral' | 'indigo' | 'amber';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  isCurrency = true,
  trend,
  isPositive = true,
  subtitle,
  icon: Icon,
  variant = 'purple',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return {
          iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
          accent: 'text-cyan-600',
        };
      case 'mint':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          accent: 'text-emerald-600',
        };
      case 'coral':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          accent: 'text-rose-600',
        };
      case 'indigo':
        return {
          iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
          accent: 'text-indigo-600',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          accent: 'text-amber-600',
        };
      case 'purple':
      default:
        return {
          iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
          accent: 'text-purple-600',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-xl lg:text-2xl font-extrabold text-slate-800 tracking-tight tabular-nums mt-0.5">
              {isCurrency && typeof value === 'number' ? formatRupiah(value) : value}
            </h3>
          </div>
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-[11px] text-slate-400 font-medium ml-auto">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
