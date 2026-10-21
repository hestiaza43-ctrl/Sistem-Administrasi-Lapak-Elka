import React, { useState } from 'react';
import {
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Store,
  Eye,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/common/StatsCard';
import { MonthlySalesBarChart } from '../components/common/ChartComponents';
import { TransactionModal } from '../components/modals/TransactionModal';
import { DetailTransactionModal } from '../components/modals/DetailTransactionModal';
import { formatRupiah, formatDate } from '../utils/formatters';
import { SalesTransaction } from '../types';

export const StaffDashboard: React.FC = () => {
  const { sales, currentUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);
  const [editTransaction, setEditTransaction] = useState<SalesTransaction | null>(null);

  // Staff specific metrics
  const staffSales = sales.filter(s => s.createdBy === 'staff' || s.marketing);
  const totalDiinput = staffSales.reduce((acc, curr) => acc + curr.totalPenjualan, 0);
  const totalTransaksi = staffSales.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const transaksiHariIni = staffSales.filter(s => s.tanggal === todayStr).length;
  const menungguVerifikasi = sales.filter(s => s.status === 'Menunggu Verifikasi').length;
  const perluRevisi = sales.filter(s => s.status === 'Direvisi').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
            Area Kerja Staff Penjualan & Operasional
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-2">
            Selamat Bertugas, {currentUser?.name || 'Staff'}!
          </h1>
          <p className="text-xs text-sky-100 max-w-xl mt-1 leading-relaxed">
            Catat invoice pesanan sekolah, pesanan marketplace SIPLAH, atau pengeluaran operasional.
            Data yang diinput akan masuk ke antrian verifikasi Admin sebelum dibukukan ke laporan laba rugi.
          </p>
        </div>

        <button
          onClick={() => {
            setEditTransaction(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 bg-white text-indigo-700 hover:bg-sky-50 text-xs font-black rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          <span>Input Penjualan Baru</span>
        </button>
      </div>

      {/* Staff 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Penjualan Diinput"
          value={totalDiinput}
          trend="+15.2%"
          isPositive={true}
          subtitle="Tercatat di sistem"
          icon={ShoppingCart}
          variant="cyan"
        />
        <StatsCard
          title="Jumlah Transaksi"
          value={`${totalTransaksi} Transaksi`}
          isCurrency={false}
          trend="Aktif"
          isPositive={true}
          subtitle="SIPLAH & Non-SIPLAH"
          icon={FileText}
          variant="purple"
        />
        <StatsCard
          title="Transaksi Hari Ini"
          value={`${transaksiHariIni} Transaksi`}
          isCurrency={false}
          subtitle="Input tanggal hari ini"
          icon={Clock}
          variant="mint"
        />
        <StatsCard
          title="Menunggu Verifikasi"
          value={`${menungguVerifikasi} Data`}
          isCurrency={false}
          trend={menungguVerifikasi > 0 ? 'Perlu approval' : 'Semua disetujui'}
          isPositive={menungguVerifikasi === 0}
          subtitle="Menunggu tanda tangan Admin"
          icon={AlertCircle}
          variant="coral"
        />
      </div>

      {/* Revision Alert If any */}
      {perluRevisi > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-rose-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Perhatian: {perluRevisi} Transaksi Perlu Diperbaiki (Revisi)
              </h4>
              <p className="text-[11px] text-rose-700">
                Admin mengembalikan invoice untuk koreksi harga atau kelengkapan lampiran BAST.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const revItem = sales.find(s => s.status === 'Direvisi');
              if (revItem) {
                setEditTransaction(revItem);
                setIsAddModalOpen(true);
              }
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Perbaiki Sekarang
          </button>
        </div>
      )}

      {/* Chart & Shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <MonthlySalesBarChart />
        </div>

        {/* Quick Guidelines Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Panduan Penginputan Staff</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">1. Transaksi SIPLAH Kemdikbud</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gunakan kode akun COA 4-1001. Buku pelajaran teks utama Kurikulum Merdeka bebas PPN (0%).
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">2. Transaksi Non-SIPLAH / Reguler</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gunakan kode akun 4-1002. Perangkat IT dan mebel dikenakan PPN 11% sesuai ketentuan perpajakan.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">3. Status Verifikasi</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Input baru berstatus &quot;Menunggu Verifikasi&quot;. Staff dapat mengedit transaksi draft/revisi.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Standar Operasional Lapak Elka</span>
            <span className="font-bold text-indigo-600">v2026.1</span>
          </div>
        </div>
      </div>

      {/* Staff Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Riwayat Transaksi Input Staff</h3>
            <p className="text-xs text-slate-400">Pantau proses approval oleh Admin Lapak Elka</p>
          </div>
          <button
            onClick={() => {
              setEditTransaction(null);
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors"
          >
            + Tambah Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Invoice</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Sekolah / Yayasan</th>
                <th className="p-3.5">Barang</th>
                <th className="p-3.5 text-center">Jenis</th>
                <th className="p-3.5 text-right">Nilai Penjualan</th>
                <th className="p-3.5 text-center">Status Verifikasi</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.slice(0, 6).map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {item.noInvoice}
                  </td>
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{formatDate(item.tanggal)}</td>
                  <td className="p-3.5 font-medium text-slate-800 max-w-[180px] truncate">
                    {item.instansi}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-[200px] truncate">{item.namaBarang}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.jenisPenjualan === 'SIPLAH'
                          ? 'bg-cyan-50 text-cyan-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {item.jenisPenjualan}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    {formatRupiah(item.totalPenjualan)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Menunggu Verifikasi'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
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
                        title="Lihat Detail & Nota"
                      >
                        <Eye size={14} />
                      </button>
                      {(item.status === 'Draft' || item.status === 'Direvisi' || item.status === 'Menunggu Verifikasi') && (
                        <button
                          onClick={() => {
                            setEditTransaction(item);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Perbaiki / Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
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
    </div>
  );
};
