import React from 'react';
import { X, Printer, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { SalesTransaction } from '../../types';
import { formatRupiah, formatDate, formatPercent } from '../../utils/formatters';

interface DetailTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: SalesTransaction | null;
}

export const DetailTransactionModal: React.FC<DetailTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 print:m-0 print:border-none print:shadow-none">
        {/* Header - Hidden on print */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Detail & Nota Transaksi Penjualan</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer size={14} />
              <span>Cetak Nota</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 text-slate-800" id="printable-invoice">
          {/* Kop Surat Lapak Elka */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg">
                  LE
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">LAPAK ELKA</h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Penyedia Buku, Perangkat IT, Laboratorium & Kebutuhan Sekolah
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Jl. Elka Edukasi No. 26, Jawa Timur | Telp: (031) 8923-441 | Email: admin@lapakelka.co.id
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                INVOICE PENJUALAN
              </span>
              <p className="text-sm font-black font-mono text-slate-800 mt-2">{transaction.noInvoice}</p>
              <p className="text-xs text-slate-500">Tanggal: {formatDate(transaction.tanggal)}</p>
            </div>
          </div>

          {/* Customer & Transaction Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tujuan / Sekolah:</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{transaction.instansi}</p>
              <p className="text-slate-600 mt-0.5">U.p. {transaction.namaPembeli}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  Kanal: {transaction.jenisPenjualan}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">COA: {transaction.coaCode}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Marketing & Status:</p>
              <p className="font-semibold text-slate-800 mt-0.5">Marketing: {transaction.marketing}</p>
              <p className="text-slate-500">Dibuat Oleh: {transaction.createdBy}</p>
              <div className="mt-2 flex items-center justify-end gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  transaction.status === 'Disetujui'
                    ? 'bg-emerald-100 text-emerald-800'
                    : transaction.status === 'Menunggu Verifikasi'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {transaction.status}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  transaction.statusPembayaran === 'Lunas'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  Status: {transaction.statusPembayaran}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Deskripsi Barang / Paket</th>
                  <th className="p-3 text-center">Kategori</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Harga Jual / Unit</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">
                    {transaction.namaBarang}
                    {transaction.catatan && (
                      <p className="text-[11px] text-slate-400 font-normal mt-0.5">{transaction.catatan}</p>
                    )}
                  </td>
                  <td className="p-3 text-center text-slate-500">{transaction.kategoriBarang}</td>
                  <td className="p-3 text-center font-bold text-slate-700">
                    {transaction.quantity} {transaction.satuan}
                  </td>
                  <td className="p-3 text-right tabular-nums text-slate-700 font-mono">
                    {formatRupiah(transaction.hargaJualUnit)}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-800 tabular-nums font-mono">
                    {formatRupiah(transaction.quantity * transaction.hargaJualUnit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown (Internal Accounting Transparency) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Internal Cost Analysis */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Analisis Finansial Internal Lapak Elka
              </p>
              <div className="flex justify-between text-slate-600">
                <span>Harga Modal / Unit:</span>
                <span className="font-mono">{formatRupiah(transaction.hargaModalUnit)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Modal (HPP):</span>
                <span className="font-mono font-semibold text-slate-800">{formatRupiah(transaction.totalModal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1">
                <span>Laba Kotor Lapak:</span>
                <span className="font-mono">{formatRupiah(transaction.labaKotor)}</span>
              </div>
              <div className="flex justify-between text-indigo-700 font-bold">
                <span>Margin Keuntungan:</span>
                <span>{formatPercent(transaction.profitMarginPercent)}</span>
              </div>
            </div>

            {/* Total Payment Due */}
            <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Barang:</span>
                <span className="font-mono font-medium">{formatRupiah(transaction.quantity * transaction.hargaJualUnit)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>PPN ({transaction.ppnPercent}%):</span>
                <span className="font-mono font-medium">
                  {formatRupiah((transaction.quantity * transaction.hargaJualUnit * transaction.ppnPercent) / 100)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-indigo-200/80 pt-1.5">
                <span>Total Invoice:</span>
                <span className="font-mono text-indigo-700">{formatRupiah(transaction.totalPenjualan)}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-600 font-bold">
                <span>Sisa Piutang:</span>
                <span className="font-mono">{formatRupiah(transaction.sisaPiutang)}</span>
              </div>
            </div>
          </div>

          {/* Signatures for Academic & Real World Proof */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
            <div>
              <p className="text-slate-400">Penerima Barang / Sekolah,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-800 underline">{transaction.namaPembeli}</p>
              <p className="text-[10px] text-slate-400">{transaction.instansi}</p>
            </div>
            <div>
              <p className="text-slate-400">Marketing Lapak Elka,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-800 underline">{transaction.marketing}</p>
              <p className="text-[10px] text-slate-400">Divisi Pemasaran Edukasi</p>
            </div>
            <div>
              <p className="text-slate-400">Pimpinan & Verifikator,</p>
              <div className="h-14"></div>
              <p className="font-bold text-slate-800 underline">
                {transaction.diverifikasiOleh || 'Bambang Sudibyo, S.E.'}
              </p>
              <p className="text-[10px] text-slate-400">Kepala Operasional & Keuangan</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 print:hidden">
          <span>Sistem Informasi Laporan Penjualan Lapak Elka 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
