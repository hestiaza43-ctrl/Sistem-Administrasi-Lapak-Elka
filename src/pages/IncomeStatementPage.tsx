import React from 'react';
import { ReceiptText, Printer, Download, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatPercent } from '../utils/formatters';

export const IncomeStatementPage: React.FC = () => {
  const { sales, cashFlow, stats } = useApp();

  const handlePrint = () => window.print();

  // Accounting calculations from real sales transactions
  const approvedSales = sales.filter(s => s.status === 'Disetujui');
  
  const revSiplah = approvedSales
    .filter(s => s.jenisPenjualan === 'SIPLAH')
    .reduce((acc, curr) => acc + curr.totalPenjualan, 0);

  const revNonSiplah = approvedSales
    .filter(s => s.jenisPenjualan === 'Non-SIPLAH')
    .reduce((acc, curr) => acc + curr.totalPenjualan, 0);

  const totalPendapatanPenjualan = revSiplah + revNonSiplah;

  const otherIncome = cashFlow
    .filter(c => c.tipe === 'Pemasukan' && c.status === 'Disetujui' && c.coaCode === '4-2001')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalPendapatanKotor = totalPendapatanPenjualan + otherIncome;

  // HPP (Cost of Goods Sold / Modal Barang Terjual)
  const hppBukuDanBarang = approvedSales.reduce((acc, curr) => acc + curr.totalModal, 0);
  const labaKotor = totalPendapatanKotor - hppBukuDanBarang;

  // Beban Operasional
  const bebanGaji = cashFlow
    .filter(c => c.tipe === 'Pengeluaran' && c.status === 'Disetujui' && c.coaCode === '6-1001')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const bebanKantor = cashFlow
    .filter(c => c.tipe === 'Pengeluaran' && c.status === 'Disetujui' && c.coaCode === '6-1002')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const bebanLogistik = cashFlow
    .filter(c => c.tipe === 'Pengeluaran' && c.status === 'Disetujui' && c.coaCode === '6-1003')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const bebanPemeliharaan = cashFlow
    .filter(c => c.tipe === 'Pengeluaran' && c.status === 'Disetujui' && c.coaCode === '6-1004')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  // Amortisasi / Penyusutan bulanan (Rp 2.500.000 estimasi buku aset)
  const bebanPenyusutan = 12500000;

  const totalBebanOperasional =
    bebanGaji + bebanKantor + bebanLogistik + bebanPemeliharaan + bebanPenyusutan;

  const labaBersih = labaKotor - totalBebanOperasional;
  const netMargin = totalPendapatanKotor > 0 ? (labaBersih / totalPendapatanKotor) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Laporan Laba Rugi Komprehensif</h1>
          <p className="text-xs text-slate-400">
            Periode Berjalan Tahun Anggaran 2026 · Format Standar Akuntansi Keuangan (SAK ETAP)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-100"
          >
            <Printer size={15} />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Financial Report Document */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 max-w-4xl mx-auto space-y-6 print:m-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">LAPAK ELKA (CV. ELKA MULTI USAHA)</h2>
          <h3 className="text-base font-bold text-indigo-700 tracking-wide mt-0.5">LAPORAN LABA RUGI</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Untuk Periode yang Berakhir pada 31 Desember 2026 (Dinyatakan dalam Rupiah)
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2 border border-emerald-200">
            <CheckCircle2 size={13} />
            <span>Berdasarkan Sheet &quot;Laporan Laba Rugi&quot; Lapak Elka 2026 (1).xlsx</span>
          </div>
        </div>

        {/* Financial Line Items */}
        <div className="space-y-6 text-xs text-slate-800">
          {/* 1. Pendapatan Penjualan */}
          <div>
            <div className="flex justify-between items-center py-2 bg-slate-50 px-3 rounded-lg font-bold text-slate-900 border-b border-slate-200">
              <span className="uppercase tracking-wider">1. PENDAPATAN OPERASIONAL</span>
              <span>Jumlah (Rp)</span>
            </div>

            <div className="divide-y divide-slate-100 px-3">
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Pendapatan Penjualan SIPLAH (Kode 4-1001)</span>
                <span className="font-mono tabular-nums">{formatRupiah(revSiplah)}</span>
              </div>
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Pendapatan Penjualan Non-SIPLAH / Reguler (Kode 4-1002)</span>
                <span className="font-mono tabular-nums">{formatRupiah(revNonSiplah)}</span>
              </div>
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Pendapatan Jasa Pengiriman & Ekspedisi (Kode 4-2001)</span>
                <span className="font-mono tabular-nums">{formatRupiah(otherIncome)}</span>
              </div>
              <div className="flex justify-between py-2.5 font-bold text-slate-900 bg-slate-50/50">
                <span>TOTAL PENDAPATAN USAHA</span>
                <span className="font-mono font-extrabold tabular-nums text-indigo-700">
                  {formatRupiah(totalPendapatanKotor)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Harga Pokok Penjualan (HPP) */}
          <div>
            <div className="flex justify-between items-center py-2 bg-slate-50 px-3 rounded-lg font-bold text-slate-900 border-b border-slate-200">
              <span className="uppercase tracking-wider">2. HARGA POKOK PENJUALAN (HPP)</span>
              <span>Jumlah (Rp)</span>
            </div>

            <div className="divide-y divide-slate-100 px-3">
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Beban Modal Beli Buku, Perangkat IT & Mebel Terjual (Kode 5-1001)</span>
                <span className="font-mono tabular-nums">({formatRupiah(hppBukuDanBarang)})</span>
              </div>
              <div className="flex justify-between py-2.5 font-bold text-slate-900 bg-slate-50/50">
                <span>TOTAL HARGA POKOK PENJUALAN</span>
                <span className="font-mono font-extrabold tabular-nums text-rose-600">
                  ({formatRupiah(hppBukuDanBarang)})
                </span>
              </div>
            </div>
          </div>

          {/* LABA KOTOR */}
          <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex justify-between items-center text-sm font-black text-indigo-950">
            <span>LABA KOTOR (GROSS PROFIT)</span>
            <span className="font-mono text-indigo-700 text-base">{formatRupiah(labaKotor)}</span>
          </div>

          {/* 3. Beban Operasional */}
          <div>
            <div className="flex justify-between items-center py-2 bg-slate-50 px-3 rounded-lg font-bold text-slate-900 border-b border-slate-200">
              <span className="uppercase tracking-wider">3. BEBAN OPERASIONAL & USAHA</span>
              <span>Jumlah (Rp)</span>
            </div>

            <div className="divide-y divide-slate-100 px-3">
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Beban Gaji & Upah Karyawan (Kode 6-1001)</span>
                <span className="font-mono tabular-nums">{formatRupiah(bebanGaji)}</span>
              </div>
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Beban Operasional Kantor, Listrik, Air & Internet (Kode 6-1002)</span>
                <span className="font-mono tabular-nums">{formatRupiah(bebanKantor)}</span>
              </div>
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Beban Ekspedisi, BBM & Logistik Sekolah (Kode 6-1003)</span>
                <span className="font-mono tabular-nums">{formatRupiah(bebanLogistik)}</span>
              </div>
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Beban Pemeliharaan & Servis Kendaraan Operasional (Kode 6-1004)</span>
                <span className="font-mono tabular-nums">{formatRupiah(bebanPemeliharaan)}</span>
              </div>
              <div className="flex justify-between py-2 text-slate-600">
                <span className="pl-4">Beban Penyusutan Aset Tetap & Peralatan (Kode 6-1005)</span>
                <span className="font-mono tabular-nums">{formatRupiah(bebanPenyusutan)}</span>
              </div>
              <div className="flex justify-between py-2.5 font-bold text-slate-900 bg-slate-50/50">
                <span>TOTAL BEBAN OPERASIONAL</span>
                <span className="font-mono font-extrabold tabular-nums text-rose-600">
                  ({formatRupiah(totalBebanOperasional)})
                </span>
              </div>
            </div>
          </div>

          {/* LABA BERSIH TAHUN BERJALAN */}
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg flex justify-between items-center text-base font-black">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-100 font-bold">HASIL AKHIR FINANSIAL</p>
              <p className="text-lg">LABA BERSIH USAHA (NET PROFIT)</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono tabular-nums">{formatRupiah(labaBersih)}</span>
              <p className="text-xs text-emerald-100 font-bold mt-0.5">
                Profit Margin: {formatPercent(netMargin)}
              </p>
            </div>
          </div>
        </div>

        {/* Formal Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center text-xs">
          <div>
            <p className="text-slate-400 font-medium">Disiapkan Oleh (Staff Akuntansi),</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-800 underline">Anisa Kusuma Wardani</p>
            <p className="text-[10px] text-slate-400">Staff Administrasi & Keuangan</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Disetujui & Disahkan Oleh,</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-800 underline">Bambang Sudibyo, S.E.</p>
            <p className="text-[10px] text-slate-400">Kepala Operasional Lapak Elka</p>
          </div>
        </div>
      </div>
    </div>
  );
};
