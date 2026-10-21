import React, { useState } from 'react';
import { formatRupiah, formatNumber } from '../../utils/formatters';

interface MonthlyData {
  month: string;
  siplah: number;
  nonSiplah: number;
  total: number;
}

export const MonthlySalesBarChart: React.FC<{ data?: MonthlyData[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Realistic fallback monthly sales based on Lapak Elka 2026
  const defaultData: MonthlyData[] = [
    { month: 'Jan', siplah: 59400000, nonSiplah: 0, total: 59400000 },
    { month: 'Feb', siplah: 40848000, nonSiplah: 86580000, total: 127428000 },
    { month: 'Mar', siplah: 23680000, nonSiplah: 52170000, total: 75850000 },
    { month: 'Apr', siplah: 34410000, nonSiplah: 29748000, total: 64158000 },
    { month: 'Mei', siplah: 77894000, nonSiplah: 21413100, total: 99307100 },
    { month: 'Jun', siplah: 65000000, nonSiplah: 35000000, total: 100000000 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const maxVal = Math.max(...chartData.map(d => Math.max(d.siplah, d.nonSiplah, d.total / 1.5))) * 1.15;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Laporan Penjualan Bulanan</h4>
          <p className="text-xs text-slate-400">Komparasi SIPLAH vs Non-SIPLAH (2026)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#06B6D4]"></span>
            <span className="text-slate-600">SIPLAH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#7C5CFC]"></span>
            <span className="text-slate-600">Non-SIPLAH</span>
          </div>
        </div>
      </div>

      <div className="relative h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100">
        {chartData.map((item, idx) => {
          const siplahHeight = (item.siplah / maxVal) * 100;
          const nonSiplahHeight = (item.nonSiplah / maxVal) * 100;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {hoveredIdx === idx && (
                <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-xl shadow-lg pointer-events-none whitespace-nowrap">
                  <p className="font-bold text-indigo-200">{item.month} 2026</p>
                  <p>SIPLAH: {formatRupiah(item.siplah)}</p>
                  <p>Non-SIPLAH: {formatRupiah(item.nonSiplah)}</p>
                  <p className="text-amber-300 font-semibold border-t border-slate-700 mt-0.5 pt-0.5">
                    Total: {formatRupiah(item.total)}
                  </p>
                </div>
              )}

              {/* Bars Pair */}
              <div className="flex items-end gap-1.5 h-full w-full justify-center">
                {/* SIPLAH Bar (Cyan) */}
                <div
                  style={{ height: `${Math.max(siplahHeight, 4)}%` }}
                  className="w-3 sm:w-4 bg-gradient-to-t from-[#06B6D4] to-[#22D3EE] rounded-t-md transition-all duration-300 group-hover:opacity-90"
                />
                {/* Non-SIPLAH Bar (Purple) */}
                <div
                  style={{ height: `${Math.max(nonSiplahHeight, 4)}%` }}
                  className="w-3 sm:w-4 bg-gradient-to-t from-[#6366F1] to-[#818CF8] rounded-t-md transition-all duration-300 group-hover:opacity-90"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Rata-rata penjualan per bulan: <strong className="text-slate-700">Rp 71.023.000</strong></span>
        <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          Tren Naik +18.4%
        </span>
      </div>
    </div>
  );
};

export const IncomeExpenseLineChart: React.FC = () => {
  // SVG coordinates for realistic smooth line chart matching reference 1 & 3
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
  // Scaled values (0 - 100)
  const incomePoints = [42, 68, 55, 62, 88, 79];
  const expensePoints = [30, 48, 38, 44, 52, 49];

  const width = 500;
  const height = 180;
  const padding = 20;

  const getPointsString = (points: number[]) => {
    return points
      .map((p, i) => {
        const x = padding + (i * (width - 2 * padding)) / (points.length - 1);
        const y = height - padding - (p / 100) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const incomePolyline = getPointsString(incomePoints);
  const expensePolyline = getPointsString(expensePoints);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Tren Arus Kas (Pemasukan vs Pengeluaran)</h4>
          <p className="text-xs text-slate-400">Mutasi Kas Kecil dan Rekening Bank BRI 2026</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span>
            <span className="text-slate-600">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
            <span className="text-slate-600">Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-48 py-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Subtle grid lines */}
          {[0.25, 0.5, 0.75].map(ratio => (
            <line
              key={ratio}
              x1={padding}
              y1={height - padding - ratio * (height - 2 * padding)}
              x2={width - padding}
              y2={height - padding - ratio * (height - 2 * padding)}
              stroke="#F1F5F9"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Income Line (Purple) */}
          <polyline
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={incomePolyline}
          />

          {/* Expense Line (Cyan) */}
          <polyline
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={expensePolyline}
          />

          {/* Data Points */}
          {incomePoints.map((p, i) => {
            const x = padding + (i * (width - 2 * padding)) / (incomePoints.length - 1);
            const y = height - padding - (p / 100) * (height - 2 * padding);
            return (
              <circle
                key={`inc-${i}`}
                cx={x}
                cy={y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#6366F1"
                strokeWidth="2.5"
                className="transition-all hover:r-6"
              />
            );
          })}

          {expensePoints.map((p, i) => {
            const x = padding + (i * (width - 2 * padding)) / (expensePoints.length - 1);
            const y = height - padding - (p / 100) * (height - 2 * padding);
            return (
              <circle
                key={`exp-${i}`}
                cx={x}
                cy={y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#06B6D4"
                strokeWidth="2.5"
                className="transition-all hover:r-6"
              />
            );
          })}
        </svg>

        {/* Month labels under chart */}
        <div className="flex justify-between px-2 mt-1 text-[11px] text-slate-400 font-medium">
          {months.map(m => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Arus Kas Bersih Operasional: <strong className="text-emerald-600">+Rp 94.250.000</strong></span>
        <span className="text-slate-400">Likuiditas Sehat</span>
      </div>
    </div>
  );
};

export const CategoryPerformanceGauge: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Distribusi Kategori Produk</h4>
          <p className="text-xs text-slate-400">Proporsi Penjualan Lapak Elka 2026</p>
        </div>
      </div>

      <div className="flex items-center justify-center my-3 relative">
        {/* SVG Donut Ring */}
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          {/* Base */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
          {/* Perangkat IT (45%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#6366F1"
            strokeWidth="12"
            strokeDasharray="107 239"
            strokeDashoffset="0"
          />
          {/* Buku Pelajaran (30%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="12"
            strokeDasharray="71 239"
            strokeDashoffset="-107"
          />
          {/* Lab & Alat Peraga (15%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#10B981"
            strokeWidth="12"
            strokeDasharray="36 239"
            strokeDashoffset="-178"
          />
          {/* ATK & Mebel (10%) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="12"
            strokeDasharray="24 239"
            strokeDashoffset="-214"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-slate-800">82%</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Target Capai</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span>
            Perangkat IT & Komputer
          </span>
          <span className="font-semibold text-slate-800">45%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
            Buku Kurikulum & Teks
          </span>
          <span className="font-semibold text-slate-800">30%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            Laboratorium & Alat Peraga
          </span>
          <span className="font-semibold text-slate-800">15%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            Mebel & ATK Sekolah
          </span>
          <span className="font-semibold text-slate-800">10%</span>
        </div>
      </div>
    </div>
  );
};
