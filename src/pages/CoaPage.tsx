import React, { useState } from 'react';
import { ListTree, Search, Printer, Download, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export const CoaPage: React.FC = () => {
  const { coa, searchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Aset Lancar',
    'Aset Tetap',
    'Kewajiban Lancar',
    'Kewajiban Jangka Panjang',
    'Ekuitas',
    'Pendapatan',
    'HPP',
    'Beban Operasional',
  ];

  const filteredCoa = coa.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Chart of Accounts (COA)</h1>
          <p className="text-xs text-slate-400">
            Daftar Bagan Akun Standar Pembukuan Finansial Lapak Elka 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Printer size={14} />
            <span>Cetak COA</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? 'Semua Kategori Akun' : cat}
          </button>
        ))}
      </div>

      {/* COA Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Kode Akun</th>
                <th className="p-3.5">Nama Akun Akuntansi</th>
                <th className="p-3.5">Klasifikasi Kategori</th>
                <th className="p-3.5 text-center">Saldo Normal</th>
                <th className="p-3.5 text-right">Saldo Awal (Rp)</th>
                <th className="p-3.5">Keterangan / Fungsi Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoa.map(item => (
                <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{item.name}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        item.normalBalance === 'Debet'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.normalBalance}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-slate-700 tabular-nums">
                    {formatRupiah(item.initialBalance)}
                  </td>
                  <td className="p-3.5 text-slate-500 max-w-[260px]">{item.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
