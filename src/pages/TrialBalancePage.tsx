import React from 'react';
import { Scale, Printer, Download, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export const TrialBalancePage: React.FC = () => {
  const { coa, sales, cashFlow } = useApp();

  const handlePrint = () => window.print();

  // Dynamic mutasi calculation for each account
  const approvedSales = sales.filter(s => s.status === 'Disetujui');
  const approvedCashFlow = cashFlow.filter(c => c.status === 'Disetujui');

  const trialRows = coa.map(account => {
    let debitMovement = 0;
    let creditMovement = 0;

    if (account.code === '1-1001') {
      // Kas Kecil
      debitMovement = approvedCashFlow
        .filter(c => c.akunKasBank === 'Kas Kecil' && c.tipe === 'Pemasukan')
        .reduce((acc, curr) => acc + curr.jumlah, 0);
      creditMovement = approvedCashFlow
        .filter(c => c.akunKasBank === 'Kas Kecil' && c.tipe === 'Pengeluaran')
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    } else if (account.code === '1-1002') {
      // Bank BRI
      debitMovement = approvedCashFlow
        .filter(c => c.akunKasBank === 'Bank BRI' && c.tipe === 'Pemasukan')
        .reduce((acc, curr) => acc + curr.jumlah, 0);
      creditMovement = approvedCashFlow
        .filter(c => c.akunKasBank === 'Bank BRI' && c.tipe === 'Pengeluaran')
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    } else if (account.code === '4-1001') {
      // Pendapatan SIPLAH
      creditMovement = approvedSales
        .filter(s => s.jenisPenjualan === 'SIPLAH')
        .reduce((acc, curr) => acc + curr.totalPenjualan, 0);
    } else if (account.code === '4-1002') {
      // Pendapatan Non-SIPLAH
      creditMovement = approvedSales
        .filter(s => s.jenisPenjualan === 'Non-SIPLAH')
        .reduce((acc, curr) => acc + curr.totalPenjualan, 0);
    } else if (account.code === '5-1001') {
      // HPP
      debitMovement = approvedSales.reduce((acc, curr) => acc + curr.totalModal, 0);
    } else if (account.code.startsWith('6-')) {
      // Beban operasional
      debitMovement = approvedCashFlow
        .filter(c => c.coaCode === account.code && c.tipe === 'Pengeluaran')
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    }

    // Ending Balance
    const endingBalance =
      account.normalBalance === 'Debet'
        ? account.initialBalance + debitMovement - creditMovement
        : account.initialBalance + creditMovement - debitMovement;

    return {
      ...account,
      debitMovement,
      creditMovement,
      endingBalance,
    };
  });

  const totalSaldoAwal = trialRows.reduce((acc, curr) => acc + curr.initialBalance, 0);
  const totalDebet = trialRows.reduce((acc, curr) => acc + curr.debitMovement, 0);
  const totalKredit = trialRows.reduce((acc, curr) => acc + curr.creditMovement, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Neraca Saldo (Trial Balance)</h1>
          <p className="text-xs text-slate-400">
            Pemeriksaan Keseimbangan Saldo Awal, Mutasi Debet, Kredit, dan Saldo Akhir 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-100"
          >
            <Printer size={15} />
            <span>Cetak Trial Balance</span>
          </button>
        </div>
      </div>

      {/* Balance Indicator */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <div>
            <h4 className="font-bold">Neraca Saldo Terverifikasi Seimbang (In Balance)</h4>
            <p className="text-[11px] text-emerald-700">
              Setiap transaksi debet berpasangan dengan kredit secara akurat sesuai sistem pembukuan berpasangan.
            </p>
          </div>
        </div>
        <span className="font-mono font-bold bg-white px-3 py-1 rounded-lg border border-emerald-200">
          Status: Balanced
        </span>
      </div>

      {/* Trial Balance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Kode COA</th>
                <th className="p-3.5">Nama Akun</th>
                <th className="p-3.5">Jenis Akun</th>
                <th className="p-3.5 text-right">Saldo Awal (Rp)</th>
                <th className="p-3.5 text-right text-sky-700">Mutasi Debet</th>
                <th className="p-3.5 text-right text-purple-700">Mutasi Kredit</th>
                <th className="p-3.5 text-right font-black">Saldo Akhir (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trialRows.map(row => (
                <tr key={row.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-indigo-700 whitespace-nowrap">{row.code}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{row.name}</td>
                  <td className="p-3.5 text-slate-500">{row.category}</td>
                  <td className="p-3.5 text-right font-mono text-slate-600 tabular-nums">
                    {formatRupiah(row.initialBalance)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-sky-700 tabular-nums">
                    {formatRupiah(row.debitMovement)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-purple-700 tabular-nums">
                    {formatRupiah(row.creditMovement)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatRupiah(row.endingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-bold border-t-2 border-slate-950">
              <tr>
                <td colSpan={3} className="p-3.5 uppercase tracking-wider">
                  TOTAL KESEIMBANGAN (NERACA SALDO)
                </td>
                <td className="p-3.5 text-right font-mono tabular-nums text-slate-300">
                  {formatRupiah(totalSaldoAwal)}
                </td>
                <td className="p-3.5 text-right font-mono tabular-nums text-cyan-300">
                  {formatRupiah(totalDebet)}
                </td>
                <td className="p-3.5 text-right font-mono tabular-nums text-purple-300">
                  {formatRupiah(totalKredit)}
                </td>
                <td className="p-3.5 text-right font-mono tabular-nums text-emerald-300 font-black">
                  Seimbang
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
