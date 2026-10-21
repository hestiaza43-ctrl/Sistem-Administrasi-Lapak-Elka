import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  DollarSign,
  PieChart,
  Printer,
  Download,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/common/StatsCard';
import { MonthlySalesBarChart, IncomeExpenseLineChart, CategoryPerformanceGauge } from '../components/common/ChartComponents';
import { EvaluationModal } from '../components/modals/EvaluationModal';
import { formatRupiah, formatPercent, formatDate } from '../utils/formatters';

export const DpkDashboard: React.FC = () => {
  const { stats, evaluations, setActiveMenu, sales } = useApp();
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner DPK */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
            Dewan Pengawas Keuangan (DPK) — Audit & Evaluasi
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-2">
            Ikhtisar Pengawasan Finansial Lapak Elka 2026
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl mt-1 leading-relaxed">
            Portal audit independen untuk memastikan integritas pembukuan penjualan, kepatuhan margin kotor,
            dan kelancaran likuiditas kas operasional sesuai amanat Dewan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all backdrop-blur-xs border border-white/20"
          >
            <Download size={15} />
            <span>Unduh Laporan PDF</span>
          </button>
          <button
            onClick={() => setIsEvaluationModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/20"
          >
            <CheckCircle2 size={16} />
            <span>Beri Catatan Evaluasi</span>
          </button>
        </div>
      </div>

      {/* DPK 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 xl:gap-4">
        <StatsCard
          title="Total Pendapatan"
          value={stats.totalPenjualan}
          trend="+18.4%"
          isPositive={true}
          subtitle="Omzet Resmi Disahkan"
          icon={TrendingUp}
          variant="mint"
        />
        <StatsCard
          title="Total Pengeluaran"
          value={stats.totalPengeluaran}
          trend="Terkendali"
          isPositive={true}
          subtitle="Pagu Operasional"
          icon={DollarSign}
          variant="coral"
        />
        <StatsCard
          title="Laba Bersih Berjalan"
          value={stats.totalLabaBersih}
          trend="+22.8%"
          isPositive={true}
          subtitle="Setelah HPP & Beban"
          icon={PieChart}
          variant="purple"
        />
        <StatsCard
          title="Profit Margin"
          value={formatPercent(stats.profitMarginPercent)}
          isCurrency={false}
          trend="Target: >25%"
          isPositive={stats.profitMarginPercent >= 25}
          subtitle="Kondisi Finansial Prima"
          icon={Scale}
          variant="indigo"
        />
      </div>

      {/* Ratios & Liquidity Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Likuiditas Kas & Bank</p>
          <p className="text-xl font-black text-slate-800 mt-1 tabular-nums">
            {formatRupiah(stats.totalKasDanBank)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Kas Kecil: {formatRupiah(stats.saldoKasKecil)} · Bank BRI: {formatRupiah(stats.saldoBankBRI)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rasio Piutang vs Hutang</p>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-sm font-bold text-slate-700">Piutang: {formatRupiah(stats.totalPiutang)}</span>
            <span className="text-xs text-rose-600 font-semibold">Hutang: {formatRupiah(stats.totalHutang)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{
                width: `${Math.min((stats.totalPiutang / (stats.totalPiutang + stats.totalHutang || 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Evaluasi DPK</p>
            <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>{evaluations.length} Laporan Telah Dievaluasi</span>
            </p>
          </div>
          <button
            onClick={() => setActiveMenu('dpk-evaluation')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left mt-2"
          >
            Lihat Rekomendasi Resmi →
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <MonthlySalesBarChart />
        </div>
        <div>
          <CategoryPerformanceGauge />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <IncomeExpenseLineChart />
        </div>

        {/* Latest Evaluation Note Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-800">Catatan Evaluasi DPK Terkini</h4>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Skor: {evaluations[0]?.skorPenilaian || 95}/100
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mb-3">
              Periode: {evaluations[0]?.periode || 'Triwulan 2026'} · Evaluator: {evaluations[0]?.namaEvaluator}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div>
                <span className="font-bold text-slate-700">Ringkasan:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{evaluations[0]?.ringkasan}</p>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="font-bold text-emerald-800">Rekomendasi DPK:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{evaluations[0]?.rekomendasi}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEvaluationModalOpen(true)}
            className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center"
          >
            + Tambah Catatan Evaluasi Baru
          </button>
        </div>
      </div>

      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
      />
    </div>
  );
};
