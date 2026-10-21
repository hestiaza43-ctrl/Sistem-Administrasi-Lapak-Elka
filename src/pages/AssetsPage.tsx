import React, { useState } from 'react';
import { Package, Truck, Wrench, Shield, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';

export const AssetsPage: React.FC = () => {
  const { assets } = useApp();
  const [filterKategori, setFilterKategori] = useState<string>('all');

  const filteredAssets = assets.filter(
    a => filterKategori === 'all' || a.kategori === filterKategori
  );

  const totalNilaiPerolehan = filteredAssets.reduce((acc, curr) => acc + curr.nilaiPerolehan, 0);
  const totalAkumulasiPenyusutan = filteredAssets.reduce((acc, curr) => acc + curr.akumulasiPenyusutan, 0);
  const totalNilaiBuku = filteredAssets.reduce((acc, curr) => acc + curr.nilaiBuku, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Daftar Aset & Kendaraan Operasional</h1>
          <p className="text-xs text-slate-400">
            Peralatan Gudang, Inventaris Kantor, dan Armada Pengiriman Lapak Elka 2026
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <Printer size={14} />
          <span>Cetak Rekap Aset</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Nilai Perolehan Awal</p>
          <h3 className="text-xl font-black text-slate-800 tabular-nums mt-1 font-mono">
            {formatRupiah(totalNilaiPerolehan)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{filteredAssets.length} Unit Aset Terdaftar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Akumulasi Penyusutan</p>
          <h3 className="text-xl font-black text-rose-600 tabular-nums mt-1 font-mono">
            {formatRupiah(totalAkumulasiPenyusutan)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Metode Garis Lurus (Straight-Line)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nilai Buku Bersih (Net Book Value)</p>
          <h3 className="text-xl font-black text-indigo-700 tabular-nums mt-1 font-mono">
            {formatRupiah(totalNilaiBuku)}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Dicatat pada Neraca Keuangan</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setFilterKategori('all')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterKategori === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Semua Aset ({assets.length})
        </button>
        <button
          onClick={() => setFilterKategori('Kendaraan Operasional')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterKategori === 'Kendaraan Operasional'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Kendaraan Operasional
        </button>
        <button
          onClick={() => setFilterKategori('Peralatan Lapak')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterKategori === 'Peralatan Lapak'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Peralatan & Inventaris
        </button>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Kode Aset</th>
                <th className="p-3.5">Nama Aset / Spesifikasi</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Tgl Perolehan</th>
                <th className="p-3.5 text-right">Nilai Perolehan</th>
                <th className="p-3.5 text-right text-rose-600">Akum. Penyusutan</th>
                <th className="p-3.5 text-right font-black text-indigo-900">Nilai Buku Saat Ini</th>
                <th className="p-3.5 text-center">Kondisi</th>
                <th className="p-3.5">Penanggung Jawab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-700 whitespace-nowrap">{item.kodeAset}</td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    {item.namaAset}
                    {item.nopol && (
                      <span className="ml-2 font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                        {item.nopol}
                      </span>
                    )}
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">Lokasi: {item.lokasi}</p>
                  </td>
                  <td className="p-3.5 text-slate-600">{item.kategori}</td>
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{formatDate(item.tanggalPerolehan)}</td>
                  <td className="p-3.5 text-right font-mono text-slate-700 tabular-nums">
                    {formatRupiah(item.nilaiPerolehan)}
                  </td>
                  <td className="p-3.5 text-right font-mono text-rose-600 tabular-nums">
                    ({formatRupiah(item.akumulasiPenyusutan)})
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-indigo-700 tabular-nums">
                    {formatRupiah(item.nilaiBuku)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.kondisi}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-[160px] truncate">{item.penanggungJawab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
