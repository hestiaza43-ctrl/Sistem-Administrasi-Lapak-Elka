import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  PiggyBank,
  Percent,
  Coins,
  Plus,
  FileSpreadsheet,
  Download,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/common/StatsCard';
import { MonthlySalesBarChart, IncomeExpenseLineChart, CategoryPerformanceGauge } from '../components/common/ChartComponents';
import { TransactionModal } from '../components/modals/TransactionModal';
import { DetailTransactionModal } from '../components/modals/DetailTransactionModal';
import { ExcelImportModal } from '../components/modals/ExcelImportModal';
import { formatRupiah, formatDate, formatPercent } from '../utils/formatters';
import { SalesTransaction } from '../types';

export const AdminDashboard: React.FC = () => {
  const { sales, stats, deleteSales, searchQuery, selectedMonth, setActiveMenu } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);
  const [editTransaction, setEditTransaction] = useState<SalesTransaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'SIPLAH' | 'Non-SIPLAH'>('all');

  // Filter sales
  const filteredSales = sales.filter(item => {
    const matchesSearch =
      searchQuery === '' ||
      item.noInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaPembeli.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.jenisPenjualan === typeFilter;

    const matchesMonth =
      selectedMonth === 'all' || item.tanggal.split('-')[1] === selectedMonth;

    return matchesSearch && matchesType && matchesMonth;
  });

  const handleDelete = (id: string, invoice: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data invoice ${invoice}?`)) {
      deleteSales(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Ringkasan Eksekutif</h1>
          <p className="text-xs text-slate-400">
            Kinerja finansial Lapak Elka berdasarkan data terpadu Excel 2026
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <FileSpreadsheet size={15} />
            <span>Impor Excel 2026</span>
          </button>

          <button
            onClick={() => {
              setEditTransaction(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={15} />
            <span>Input Transaksi</span>
          </button>
        </div>
      </div>

      {/* 8 Stats Cards Grid (Matching reference layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Penjualan"
          value={stats.totalPenjualan}
          trend="+18.4%"
          isPositive={true}
          subtitle="SIPLAH & Non-SIPLAH"
          icon={ShoppingCart}
          variant="purple"
        />
        <StatsCard
          title="Total Pemasukan Kas"
          value={stats.totalPemasukan}
          trend="+12.5%"
          isPositive={true}
          subtitle="Kas Kecil & Rekening BRI"
          icon={ArrowDownCircle}
          variant="cyan"
        />
        <StatsCard
          title="Total Pengeluaran"
          value={stats.totalPengeluaran}
          trend="-4.2%"
          isPositive={true}
          subtitle="Operasional, Gaji & Logistik"
          icon={ArrowUpCircle}
          variant="coral"
        />
        <StatsCard
          title="Total Beban Pokok (HPP)"
          value={stats.totalModalHPP}
          trend="+8.1%"
          isPositive={true}
          subtitle="Modal Beli Barang Terjual"
          icon={Coins}
          variant="amber"
        />
        <StatsCard
          title="Laba Bersih Usaha"
          value={stats.totalLabaBersih}
          trend="+22.8%"
          isPositive={true}
          subtitle="Setelah Beban & Pajak"
          icon={PiggyBank}
          variant="mint"
        />
        <StatsCard
          title="Profit Margin Rata-rata"
          value={formatPercent(stats.profitMarginPercent)}
          isCurrency={false}
          trend="+3.4%"
          isPositive={true}
          subtitle="Margin Penjualan Bersih"
          icon={Percent}
          variant="indigo"
        />
        <StatsCard
          title="Saldo Kas & Bank"
          value={stats.totalKasDanBank}
          trend="Likuiditas Prima"
          isPositive={true}
          subtitle={`BRI: ${formatRupiah(stats.saldoBankBRI)}`}
          icon={Wallet}
          variant="cyan"
        />
        <StatsCard
          title="Total Piutang Berjalan"
          value={stats.totalPiutang}
          trend={`${sales.filter(s => s.sisaPiutang > 0).length} Invoice`}
          isPositive={stats.totalPiutang < 80000000}
          subtitle={`Hutang: ${formatRupiah(stats.totalHutang)}`}
          icon={Coins}
          variant="coral"
        />
      </div>

      {/* Charts Section */}
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
        
        {/* Quick Audit & Status Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">Status & Verifikasi Sistem</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Persetujuan transaksi diperlukan agar catatan draft yang diinput oleh staff resmi masuk ke laporan laba rugi dan neraca.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="font-semibold text-amber-900">Menunggu Verifikasi Admin</span>
                </div>
                <span className="font-bold text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                  {stats.pendingVerificationCount} Transaksi
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Transaksi Telah Disahkan</span>
                </div>
                <span className="font-bold text-emerald-900 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  {stats.totalTransaksiPenjualan} Transaksi
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveMenu('verification')}
            className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center"
          >
            Buka Panel Verifikasi Transaksi →
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Tabel Transaksi Penjualan Terbaru</h3>
            <p className="text-xs text-slate-400">Menampilkan {filteredSales.length} transaksi berdasarkan filter</p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTypeFilter('SIPLAH')}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'SIPLAH' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              SIPLAH
            </button>
            <button
              onClick={() => setTypeFilter('Non-SIPLAH')}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'Non-SIPLAH' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Non-SIPLAH
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Invoice</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Sekolah / Yayasan</th>
                <th className="p-3.5">Barang</th>
                <th className="p-3.5 text-center">Jenis</th>
                <th className="p-3.5 text-right">Modal (HPP)</th>
                <th className="p-3.5 text-right">Penjualan</th>
                <th className="p-3.5 text-right">Keuntungan</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.slice(0, 8).map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {item.noInvoice}
                  </td>
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{formatDate(item.tanggal)}</td>
                  <td className="p-3.5 font-medium text-slate-800 max-w-[180px] truncate">
                    {item.instansi}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-[200px] truncate" title={item.namaBarang}>
                    {item.namaBarang}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.jenisPenjualan === 'SIPLAH'
                          ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {item.jenisPenjualan}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-600">
                    {formatRupiah(item.totalModal)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    {formatRupiah(item.totalPenjualan)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-600">
                    {formatRupiah(item.labaKotor)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Menunggu Verifikasi'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedTransaction(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Lihat Nota & Detail"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditTransaction(item);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.noInvoice)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditTransaction(null);
        }}
        initialData={editTransaction}
      />

      <DetailTransactionModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};
