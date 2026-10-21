import React, { useState } from 'react';
import {
  Plus,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SalesTransaction, SalesType } from '../types';
import { TransactionModal } from '../components/modals/TransactionModal';
import { DetailTransactionModal } from '../components/modals/DetailTransactionModal';
import { ExcelImportModal } from '../components/modals/ExcelImportModal';
import { formatRupiah, formatDate, formatPercent } from '../utils/formatters';

interface SalesPageProps {
  initialFilter?: 'all' | 'SIPLAH' | 'Non-SIPLAH';
}

export const SalesPage: React.FC<SalesPageProps> = ({ initialFilter = 'all' }) => {
  const { sales, deleteSales, currentUser, searchQuery, selectedMonth } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'SIPLAH' | 'Non-SIPLAH'>(initialFilter);
  const [marketingFilter, setMarketingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);
  const [editTransaction, setEditTransaction] = useState<SalesTransaction | null>(null);

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF';
  const canDelete = currentUser?.role === 'ADMIN';

  // Filtering
  const filteredData = sales.filter(item => {
    const matchesSearch =
      searchQuery === '' ||
      item.noInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaPembeli.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marketing.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.jenisPenjualan === typeFilter;
    const matchesMonth = selectedMonth === 'all' || item.tanggal.split('-')[1] === selectedMonth;
    const matchesMarketing = marketingFilter === 'all' || item.marketing === marketingFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesMonth && matchesMarketing && matchesStatus;
  });

  // Calculate totals of current filtered view
  const sumModal = filteredData.reduce((acc, curr) => acc + curr.totalModal, 0);
  const sumPenjualan = filteredData.reduce((acc, curr) => acc + curr.totalPenjualan, 0);
  const sumLaba = filteredData.reduce((acc, curr) => acc + curr.labaKotor, 0);

  const handleDelete = (id: string, inv: string) => {
    if (!canDelete) return;
    if (confirm(`Apakah Anda yakin ingin menghapus data penjualan invoice ${inv}?`)) {
      deleteSales(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Tanggal',
      'No Invoice',
      'COA',
      'Jenis Penjualan',
      'Marketing',
      'Sekolah/Yayasan',
      'Nama Pembeli',
      'Barang',
      'Qty',
      'Satuan',
      'Modal Unit',
      'Jual Unit',
      'Total Modal (HPP)',
      'Total Penjualan',
      'Keuntungan',
      'Status',
    ];

    const rows = filteredData.map((item, idx) => [
      idx + 1,
      item.tanggal,
      item.noInvoice,
      item.coaCode,
      item.jenisPenjualan,
      `"${item.marketing}"`,
      `"${item.instansi}"`,
      `"${item.namaPembeli}"`,
      `"${item.namaBarang}"`,
      item.quantity,
      item.satuan,
      item.hargaModalUnit,
      item.hargaJualUnit,
      item.totalModal,
      item.totalPenjualan,
      item.labaKotor,
      item.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_Lapak_Elka_2026_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            {typeFilter === 'all'
              ? 'Laporan Rincian Penjualan'
              : typeFilter === 'SIPLAH'
              ? 'Laporan Penjualan SIPLAH'
              : 'Laporan Penjualan Non-SIPLAH'}
          </h1>
          <p className="text-xs text-slate-400">
            Berdasarkan format sheet Excel Lapak Elka 2026 (1).xlsx
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
            title="Download CSV / Excel"
          >
            <Download size={14} />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
            title="Cetak Laporan / PDF"
          >
            <Printer size={14} />
            <span>Cetak / PDF</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet size={14} />
              <span>Impor Excel</span>
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => {
                setEditTransaction(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-100"
            >
              <Plus size={15} />
              <span>Tambah Penjualan</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Jenis Tab */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua Jenis
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

          {/* Marketing Filter */}
          <select
            value={marketingFilter}
            onChange={e => setMarketingFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Marketing</option>
            <option value="Ahmad Fadhil">Ahmad Fadhil</option>
            <option value="Siti Rahma">Siti Rahma</option>
            <option value="Rizky Pratama">Rizky Pratama</option>
            <option value="Budi Santoso">Budi Santoso</option>
            <option value="Dewi Lestari">Dewi Lestari</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Draft">Draft</option>
            <option value="Direvisi">Direvisi</option>
          </select>
        </div>

        <div className="text-slate-400 font-medium">
          Ditemukan <strong className="text-slate-700">{filteredData.length}</strong> transaksi
        </div>
      </div>

      {/* Summary Aggregate Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Modal (HPP)</p>
          <p className="text-lg font-black text-slate-700 mt-0.5 tabular-nums font-mono">{formatRupiah(sumModal)}</p>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Nilai Penjualan</p>
          <p className="text-lg font-black text-indigo-700 mt-0.5 tabular-nums font-mono">{formatRupiah(sumPenjualan)}</p>
        </div>
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Keuntungan (Laba Kotor)</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5 tabular-nums font-mono">{formatRupiah(sumLaba)}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5 text-center">No</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">No Invoice</th>
                <th className="p-3.5 text-center">Jenis</th>
                <th className="p-3.5">Nama Pembeli</th>
                <th className="p-3.5">Sekolah / Yayasan</th>
                <th className="p-3.5">Marketing</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Total Modal</th>
                <th className="p-3.5 text-right">Total Penjualan</th>
                <th className="p-3.5 text-right">Keuntungan</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-slate-400">
                    Tidak ada transaksi penjualan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="p-3.5 whitespace-nowrap text-slate-600">{formatDate(item.tanggal)}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {item.noInvoice}
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
                    <td className="p-3.5 text-slate-700 font-medium max-w-[130px] truncate">{item.namaPembeli}</td>
                    <td className="p-3.5 text-slate-800 font-semibold max-w-[170px] truncate">{item.instansi}</td>
                    <td className="p-3.5 text-slate-600">{item.marketing}</td>
                    <td className="p-3.5 text-center font-bold text-slate-700">
                      {item.quantity} {item.satuan}
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
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedTransaction(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Lihat Nota & Detail"
                        >
                          <Eye size={14} />
                        </button>
                        {canEdit && (item.status !== 'Disetujui' || currentUser?.role === 'ADMIN') && (
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
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item.id, item.noInvoice)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data (Admin)"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
