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
  const formattedValue = isCurrency && typeof value === 'number' ? formatRupiah(value) : String(value);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-w-0 overflow-hidden">
      {/* Top row: Title and Icon separated */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate flex-1"
            title={title}
          >
            {title}
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
            <Icon size={16} />
          </div>
        </div>

        {/* Large Value: occupies 100% full width of card without horizontal constraint */}
        <h3
          className="text-lg sm:text-xl xl:text-[22px] font-black text-slate-800 tracking-tight tabular-nums truncate block w-full mt-1"
          title={formattedValue}
        >
          {formattedValue}
        </h3>
      </div>

      {/* Bottom row: Trend badge & Subtitle */}
      {(trend || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold text-[11px] shrink-0 ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="whitespace-nowrap">{trend}</span>
            </span>
          )}
          {subtitle && (
            <span
              className="text-[11px] text-slate-400 font-medium truncate text-right ml-auto"
              title={subtitle}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
