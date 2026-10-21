import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Plus,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CashFlowModal } from '../components/modals/CashFlowModal';
import { formatRupiah, formatDate } from '../utils/formatters';
import { CashFlowType, CashAccountType } from '../types';

interface CashFlowPageProps {
  defaultTab?: 'all' | 'Pemasukan' | 'Pengeluaran' | 'KasBank';
}

export const CashFlowPage: React.FC<CashFlowPageProps> = ({ defaultTab = 'all' }) => {
  const { cashFlow, stats, currentUser, deleteCashFlow, searchQuery, selectedMonth } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'Pemasukan' | 'Pengeluaran'>(
    defaultTab === 'Pemasukan' ? 'Pemasukan' : defaultTab === 'Pengeluaran' ? 'Pengeluaran' : 'all'
  );
  const [accountFilter, setAccountFilter] = useState<'all' | CashAccountType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<CashFlowType>('Pemasukan');

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF';

  const filteredData = cashFlow.filter(item => {
    const matchesTab = activeTab === 'all' || item.tipe === activeTab;
    const matchesAccount = accountFilter === 'all' || item.akunKasBank === accountFilter;
    const matchesMonth = selectedMonth === 'all' || item.tanggal.split('-')[1] === selectedMonth;
    const matchesSearch =
      searchQuery === '' ||
      item.noBukti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kontakTerkait && item.kontakTerkait.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesAccount && matchesMonth && matchesSearch;
  });

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            {activeTab === 'all'
              ? 'Arus Kas dan Mutasi Bank'
              : activeTab === 'Pemasukan'
              ? 'Buku Kas Masuk (Pemasukan)'
              : 'Buku Kas Keluar (Pengeluaran)'}
          </h1>
          <p className="text-xs text-slate-400">
            Pencatatan real-time Kas Kecil dan Rekening Giro Bank BRI Lapak Elka
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Printer size={14} />
            <span>Cetak Mutasi</span>
          </button>

          {canEdit && (
            <>
              <button
                onClick={() => {
                  setModalType('Pemasukan');
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-200"
              >
                <ArrowDownCircle size={15} />
                <span>+ Kas Masuk</span>
              </button>

              <button
                onClick={() => {
                  setModalType('Pengeluaran');
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-rose-200"
              >
                <ArrowUpCircle size={15} />
                <span>+ Kas Keluar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3 Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Kas & Bank</p>
            <h3 className="text-xl font-black text-slate-800 tabular-nums">
              {formatRupiah(stats.totalKasDanBank)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Likuiditas Operasional</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saldo Rekening Bank BRI</p>
            <h3 className="text-xl font-black text-slate-800 tabular-nums">
              {formatRupiah(stats.saldoBankBRI)}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">No. Rek: 0142-01-002941-50-8</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saldo Kas Kecil Kantor</p>
            <h3 className="text-xl font-black text-slate-800 tabular-nums">
              {formatRupiah(stats.saldoKasKecil)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Brankas Kantor Tunai</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Accounts */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tipe Tab */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua Mutasi
            </button>
            <button
              onClick={() => setActiveTab('Pemasukan')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'Pemasukan' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pemasukan (+BKM)
            </button>
            <button
              onClick={() => setActiveTab('Pengeluaran')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'Pengeluaran' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pengeluaran (-BKK)
            </button>
          </div>

          {/* Account Filter */}
          <select
            value={accountFilter}
            onChange={e => setAccountFilter(e.target.value as 'all' | CashAccountType)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Akun Kas / Bank</option>
            <option value="Bank BRI">Hanya Bank BRI</option>
            <option value="Kas Kecil">Hanya Kas Kecil</option>
          </select>
        </div>

        <span className="text-slate-400 font-medium">
          Menampilkan <strong className="text-slate-700">{filteredData.length}</strong> catatan mutasi
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">No Bukti</th>
                <th className="p-3.5 text-center">Tipe</th>
                <th className="p-3.5">Akun Kas/Bank</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Uraian / Keterangan</th>
                <th className="p-3.5">Kontak Terkait</th>
                <th className="p-3.5 text-right">Nominal (Rp)</th>
                <th className="p-3.5 text-center">Status</th>
                {currentUser?.role === 'ADMIN' && <th className="p-3.5 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Belum ada catatan mutasi kas yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 whitespace-nowrap text-slate-600">{formatDate(item.tanggal)}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {item.noBukti}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.tipe === 'Pemasukan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.tipe}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">{item.akunKasBank}</td>
                    <td className="p-3.5 text-slate-600">{item.kategori}</td>
                    <td className="p-3.5 text-slate-800 max-w-[220px] truncate">{item.keterangan}</td>
                    <td className="p-3.5 text-slate-500">{item.kontakTerkait || '-'}</td>
                    <td className={`p-3.5 text-right font-mono font-bold tabular-nums ${
                      item.tipe === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.tipe === 'Pemasukan' ? '+' : '-'} {formatRupiah(item.jumlah)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.status}
                      </span>
                    </td>
                    {currentUser?.role === 'ADMIN' && (
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus catatan kas ${item.noBukti}?`)) {
                              deleteCashFlow(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CashFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
};
