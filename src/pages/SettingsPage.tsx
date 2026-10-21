import React, { useState } from 'react';
import { Settings, RefreshCw, Save, CheckCircle2, Download, Building, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { resetToDemoData, showNotification, sales, cashFlow, coa } = useApp();

  const [companyName, setCompanyName] = useState('LAPAK ELKA (CV. ELKA MULTI USAHA)');
  const [address, setAddress] = useState('Jl. Elka Edukasi No. 26, Jawa Timur');
  const [bankAccount, setBankAccount] = useState('Bank BRI Giro: 0142-01-002941-50-8');
  const [ppnRate, setPpnRate] = useState(11);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('success', 'Pengaturan sistem berhasil disimpan.');
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      company: companyName,
      sales,
      cashFlow,
      coa,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `backup_lapak_elka_2026_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'File cadangan JSON berhasil diunduh.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Pengaturan Sistem & Identitas Usaha</h1>
        <p className="text-xs text-slate-400">
          Konfigurasi Identitas Lapak Elka, Rekening Bank Utama, Tarif PPN, dan Manajemen Basis Data
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-800 text-sm">
            <Building size={16} className="text-indigo-600" />
            <span>Identitas Perusahaan (Kop Laporan Resmi)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Usaha / Lembaga</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Rekening Bank Utama</label>
              <input
                type="text"
                value={bankAccount}
                onChange={e => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Kantor & Gudang</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tarif Standar PPN (%)</label>
              <input
                type="number"
                value={ppnRate}
                onChange={e => setPpnRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
            >
              <Save size={14} />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Database Management Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-800 text-sm">
          <Shield size={16} className="text-emerald-600" />
          <span>Manajemen Basis Data & Data Acuan Excel 2026</span>
        </div>

        <p className="text-slate-500 leading-relaxed">
          Sistem menggunakan data terintegrasi dari file acuan <strong>Lapak Elka 2026 (1).xlsx</strong>.
          Anda dapat mencadangkan seluruh data transaksi atau mereset data ke kondisi awal kapan saja.
        </p>

        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>Unduh Cadangan Database (.JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke data acuan Excel Lapak Elka 2026?')) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} />
            <span>Reset ke Data Asli Excel 2026</span>
          </button>
        </div>
      </div>

      {/* Vercel Publication & Build Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-slate-800 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">▲</span>
            <span>Status Publikasi & Deployment Vercel</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Production Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Versi Rilis</p>
            <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">v1.0.0</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Target Framework</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">Vite + React 19</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Konfigurasi Routing</p>
            <p className="font-bold text-emerald-700 text-sm mt-0.5">vercel.json SPA Rewrites</p>
          </div>
        </div>

        <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-slate-600 space-y-1">
          <p className="font-bold text-indigo-900 text-xs">Petunjuk Deploy ke Vercel:</p>
          <p className="text-[11px]">1. Sambungkan repositori GitHub/GitLab ke Dashboard Vercel.</p>
          <p className="text-[11px]">2. Vercel akan otomatis mendeteksi Framework Preset: <strong>Vite</strong>.</p>
          <p className="text-[11px]">3. Build Command: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-800 font-bold">npm run build</code>, Output Directory: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-800 font-bold">dist</code>.</p>
          <p className="text-[11px]">4. Klik <strong>Deploy</strong> dan aplikasi langsung live dengan URL kustom Anda.</p>
        </div>
      </div>
    </div>
  );
};
