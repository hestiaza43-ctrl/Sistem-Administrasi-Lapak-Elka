import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DetailTransactionModal } from '../components/modals/DetailTransactionModal';
import { formatRupiah, formatDate } from '../utils/formatters';
import { SalesTransaction } from '../types';

export const VerificationPage: React.FC = () => {
  const { sales, verifySales, currentUser } = useApp();

  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [revisionNotes, setRevisionNotes] = useState<{ [id: string]: string }>({});

  const isAdmin = currentUser?.role === 'ADMIN';

  const pendingList = sales.filter(s => s.status === 'Menunggu Verifikasi');
  const approvedList = sales.filter(s => s.status === 'Disetujui');
  const rejectedList = sales.filter(s => s.status === 'Direvisi');

  const handleApprove = (id: string) => {
    verifySales(id, 'Disetujui', 'Dokumen BAST dan invoice valid. Telah disahkan Admin.');
  };

  const handleReject = (id: string) => {
    const note = revisionNotes[id] || 'Periksa kembali kelengkapan BAST fisik sekolah dan tarif PPN.';
    verifySales(id, 'Direvisi', note);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Pusat Validasi & Verifikasi Transaksi</h1>
          <p className="text-xs text-slate-400">
            Alur pengesahan bertingkat dari Staff Penjualan kepada Admin Lapak Elka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            {pendingList.length} Transaksi Menunggu Pengesahan
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'pending' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock size={14} className="text-amber-600" />
          <span>Menunggu Verifikasi ({pendingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'approved' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>Telah Disahkan ({approvedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'rejected' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertCircle size={14} className="text-rose-600" />
          <span>Perlu Revisi ({rejectedList.length})</span>
        </button>
      </div>

      {/* List content */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingList.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Tidak ada transaksi yang menunggu verifikasi</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Semua input draft telah disahkan dan masuk ke laporan keuangan resmi.
                </p>
              </div>
            ) : (
              pendingList.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {item.noInvoice}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                        {item.jenisPenjualan}
                      </span>
                      <span className="text-xs text-slate-400">· {formatDate(item.tanggal)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{item.instansi}</h3>
                    <p className="text-xs text-slate-600">
                      Barang: <strong className="text-slate-800">{item.namaBarang}</strong> ({item.quantity} {item.satuan})
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Pembeli: {item.namaPembeli}</span>
                      <span>Marketing: {item.marketing}</span>
                      <span>Diinput Oleh: {item.createdBy}</span>
                    </div>

                    {item.catatan && (
                      <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 mt-2">
                        Catatan Staff: {item.catatan}
                      </p>
                    )}
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex flex-col md:items-end gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Nilai Penjualan</p>
                      <p className="text-base font-black text-slate-900 font-mono tabular-nums">
                        {formatRupiah(item.totalPenjualan)}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        Laba: {formatRupiah(item.labaKotor)} ({item.profitMarginPercent.toFixed(1)}%)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTransaction(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Lihat Nota</span>
                      </button>

                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors border border-rose-200"
                          >
                            <XCircle size={13} />
                            <span>Kembalikan</span>
                          </button>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-md shadow-emerald-200"
                          >
                            <CheckCircle2 size={13} />
                            <span>Setujui</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Menunggu review Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Approved List */}
        {activeTab === 'approved' && (
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Sekolah</th>
                  <th className="p-3.5">Jenis</th>
                  <th className="p-3.5 text-right">Nilai Penjualan</th>
                  <th className="p-3.5">Diverifikasi Oleh</th>
                  <th className="p-3.5">Tanggal Verifikasi</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{item.noInvoice}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{item.instansi}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.jenisPenjualan}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(item.totalPenjualan)}
                    </td>
                    <td className="p-3.5 text-emerald-700 font-semibold">{item.diverifikasiOleh || 'admin'}</td>
                    <td className="p-3.5 text-slate-500">{formatDate(item.tanggalVerifikasi || item.tanggal)}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedTransaction(item)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Rejected / Need Revision */}
        {activeTab === 'rejected' && (
          <div className="space-y-3">
            {rejectedList.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-slate-400 border border-slate-200">
                Tidak ada transaksi yang perlu revisi.
              </div>
            ) : (
              rejectedList.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      {item.noInvoice}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-1">{item.instansi}</h3>
                    <p className="text-xs text-rose-600 mt-1">
                      Catatan Pengembalian: <strong>{item.catatanRevisi || 'Harap perbaiki kelengkapan dokumen'}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(item)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <Eye size={13} />
                    <span>Lihat Nota</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <DetailTransactionModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
