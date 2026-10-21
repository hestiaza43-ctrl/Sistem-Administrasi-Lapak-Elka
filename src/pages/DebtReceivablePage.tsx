import React, { useState } from 'react';
import { Coins, CheckCircle, Clock, AlertCircle, Building2, User, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';

export const DebtReceivablePage: React.FC = () => {
  const { sales, dewanLoans } = useApp();
  const [activeTab, setActiveTab] = useState<'piutang' | 'hutangVendor' | 'hutangDewan'>('piutang');

  // Piutang filter
  const piutangList = sales.filter(s => s.sisaPiutang > 0);
  const totalPiutang = piutangList.reduce((acc, curr) => acc + curr.sisaPiutang, 0);

  // Dewan loans
  const totalHutangDewan = dewanLoans.reduce((acc, curr) => acc + curr.sisaHutang, 0);
  const totalHutangVendor = 58000000; // PT Axioo & Penerbit Buku

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Rekap Piutang & Hutang Usaha</h1>
          <p className="text-xs text-slate-400">
            Monitoring Penagihan Invoice Sekolah, Hutang Vendor, & Hutang ke Dewan Pengawas
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <Printer size={14} />
          <span>Cetak Laporan</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Piutang Berjalan</p>
          <h3 className="text-xl font-black text-slate-800 tabular-nums mt-1">
            {formatRupiah(totalPiutang)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{piutangList.length} Sekolah Belum Lunas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hutang ke Dewan Pengawas</p>
          <h3 className="text-xl font-black text-indigo-700 tabular-nums mt-1">
            {formatRupiah(totalHutangDewan)}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Pinjaman Modal Bergulir Aktif</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hutang Usaha ke Vendor</p>
          <h3 className="text-xl font-black text-rose-600 tabular-nums mt-1">
            {formatRupiah(totalHutangVendor)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Tempo Suplai Axioo & Penerbit</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('piutang')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'piutang' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          1. Rekap Piutang Sekolah ({piutangList.length})
        </button>
        <button
          onClick={() => setActiveTab('hutangDewan')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'hutangDewan' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          2. Rincian Hutang ke Dewan
        </button>
        <button
          onClick={() => setActiveTab('hutangVendor')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'hutangVendor' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          3. Hutang Usaha Vendor
        </button>
      </div>

      {/* Tab 1: Piutang */}
      {activeTab === 'piutang' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">Daftar Tagihan Piutang Sekolah & Yayasan</h3>
            <span className="text-[11px] text-slate-400">Total: {formatRupiah(totalPiutang)}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Sekolah / Instansi</th>
                  <th className="p-3.5">Jenis</th>
                  <th className="p-3.5">Jatuh Tempo</th>
                  <th className="p-3.5 text-right">Nilai Invoice</th>
                  <th className="p-3.5 text-right">Dibayar</th>
                  <th className="p-3.5 text-right text-rose-600 font-black">Sisa Piutang</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {piutangList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{item.noInvoice}</td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {item.instansi}
                      <p className="text-[11px] text-slate-400 font-normal">{item.namaBarang}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.jenisPenjualan}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{formatDate(item.jatuhTempo)}</td>
                    <td className="p-3.5 text-right font-mono text-slate-700">
                      {formatRupiah(item.totalPenjualan)}
                    </td>
                    <td className="p-3.5 text-right font-mono text-emerald-600">
                      {formatRupiah(item.jumlahDibayar)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-rose-600">
                      {formatRupiah(item.sisaPiutang)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        {item.statusPembayaran}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Hutang ke Dewan */}
      {activeTab === 'hutangDewan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dewanLoans.map(loan => (
              <div
                key={loan.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                      Akad Pinjaman Modal Bergulir
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {loan.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{loan.namaDewan}</h3>
                  <p className="text-xs text-slate-500 mt-1">{loan.peruntukan}</p>

                  <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Jumlah Pinjaman Awal:</span>
                      <span className="font-mono font-bold text-slate-800">{formatRupiah(loan.jumlahPinjaman)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Total Telah Dicicil:</span>
                      <span className="font-mono font-bold">-{formatRupiah(loan.totalDicicil)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-rose-600 border-t border-slate-200 pt-2">
                      <span>Sisa Hutang Pokok:</span>
                      <span className="font-mono">{formatRupiah(loan.sisaHutang)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3 italic leading-relaxed">&ldquo;{loan.catatan}&rdquo;</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Jatuh Tempo: {formatDate(loan.jatuhTempo)}</span>
                  <span>Tgl Akad: {formatDate(loan.tanggalPinjaman)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hutang Usaha Vendor */}
      {activeTab === 'hutangVendor' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">Daftar Hutang Pembelian Barang ke Distributor</h3>
            <span className="text-[11px] text-slate-400 font-mono">Kode COA 2-1001</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Nama Vendor / Distributor</th>
                <th className="p-3.5">Barang yang Dibeli</th>
                <th className="p-3.5">Termin Tempo</th>
                <th className="p-3.5 text-right">Total Hutang</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3.5 font-bold text-slate-800">PT Axioo International Distribution</td>
                <td className="p-3.5 text-slate-600">Laptop Chromebook Axioo & PC AIO Lab</td>
                <td className="p-3.5 text-slate-500">Tempo 60 Hari (Jatuh tempo: 30 Juni 2026)</td>
                <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatRupiah(38000000)}</td>
                <td className="p-3.5 text-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Lancar
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-800">Penerbit Yudhistira & Erlangga Cabang Jatim</td>
                <td className="p-3.5 text-slate-600">Paket Buku Kurikulum Merdeka Fase D & Siswa</td>
                <td className="p-3.5 text-slate-500">Tempo 45 Hari (Jatuh tempo: 15 Juli 2026)</td>
                <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatRupiah(20000000)}</td>
                <td className="p-3.5 text-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Lancar
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
