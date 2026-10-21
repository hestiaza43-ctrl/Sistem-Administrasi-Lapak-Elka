import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  UserCheck,
  Shield,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeMenu,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    stats,
    loginAsDemo,
    logout,
    resetToDemoData,
    setActiveMenu
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Title mapper
  const getPageTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return { title: 'Dashboard Utama Admin', sub: 'Monitoring Penjualan & Kesehatan Finansial Lapak Elka' };
      case 'dashboard-staff':
        return { title: 'Dashboard Staff Operasional', sub: 'Input Transaksi Penjualan, Mutasi & Status Verifikasi' };
      case 'dashboard-dpk':
        return { title: 'Dashboard Dewan Pengawas Keuangan (DPK)', sub: 'Pengawasan, Audit Finansial & Evaluasi Kinerja Lapak' };
      case 'sales-all':
        return { title: 'Rincian Data Penjualan', sub: 'Rekap Seluruh Transaksi SIPLAH & Non-SIPLAH Tahun 2026' };
      case 'sales-siplah':
        return { title: 'Penjualan Marketplace SIPLAH', sub: 'Khusus Pesanan Sekolah Melalui Sistem Pengadaan Kemdikbud' };
      case 'sales-non-siplah':
        return { title: 'Penjualan Non-SIPLAH', sub: 'Transaksi Langsung Sekolah Swasta, Yayasan, dan Umum' };
      case 'cash-in':
        return { title: 'Data Pemasukan Kas & Bank', sub: 'Buku Kas Masuk (BKM) & Pelunasan Piutang' };
      case 'cash-out':
        return { title: 'Data Pengeluaran Operasional & HPP', sub: 'Buku Kas Keluar (BKK) & Biaya Usaha' };
      case 'cash-bank':
        return { title: 'Rekap Saldo Kas dan Bank', sub: 'Kas Kecil Kantor & Rekening Giro Bank BRI' };
      case 'coa':
        return { title: 'Chart of Accounts (COA)', sub: 'Bagan Akun Standar Akuntansi Lapak Elka 2026' };
      case 'trial-balance':
        return { title: 'Neraca Saldo (Trial Balance)', sub: 'Keseimbangan Debet dan Kredit Akun Buku Besar' };
      case 'income-statement':
        return { title: 'Laporan Laba Rugi Komprehensif', sub: 'Pendapatan, Beban Pokok (HPP) & Laba Bersih' };
      case 'balance-sheet':
        return { title: 'Neraca Keuangan & Neraca Fix', sub: 'Posisi Aset, Liabilitas / Hutang, dan Ekuitas Modal' };
      case 'debt-receivable':
        return { title: 'Rekap Data Piutang & Hutang', sub: 'Piutang Sekolah, Hutang Vendor Suplai, & Hutang ke Dewan' };
      case 'assets':
        return { title: 'Data Aset & Kendaraan Lapak', sub: 'Inventaris Operasional, Armada Pengiriman & Depresiasi' };
      case 'verification':
        return { title: 'Pusat Verifikasi & Validasi Transaksi', sub: 'Persetujuan Data Draft Staff oleh Admin & Evaluasi' };
      case 'dpk-evaluation':
        return { title: 'Evaluasi & Catatan Dewan Pengawas', sub: 'Audit Triwulanan & Rekomendasi Resmi DPK' };
      case 'user-management':
        return { title: 'Manajemen Pengguna & Hak Akses', sub: 'Pengaturan Akun Admin, Staff, dan DPK' };
      case 'settings':
        return { title: 'Pengaturan Sistem & Profil Perusahaan', sub: 'Konfigurasi Identitas Lapak Elka, PPN & Data' };
      case 'staff-input-sales':
        return { title: 'Formulir Input Penjualan Baru', sub: 'Catat Invoice Penjualan SIPLAH / Non-SIPLAH Baru' };
      default:
        return { title: 'Sistem Informasi Lapak Elka', sub: 'Tahun Anggaran 2026' };
    }
  };

  const { title, sub } = getPageTitle();

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Page Title & Breadcrumb */}
      <div>
        <h2 className="text-base font-bold text-slate-800 leading-tight">{title}</h2>
        <p className="text-xs text-slate-400 font-medium">{sub}</p>
      </div>

      {/* Right Controls: Search, Filters, Notif, Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari invoice, sekolah, barang..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-56 lg:w-64 pl-9 pr-3 py-1.5 bg-[#F4F7FC] border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-xs text-slate-600">
          <Calendar size={13} className="text-slate-400" />
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Bulan 2026</option>
            <option value="01">Januari 2026</option>
            <option value="02">Februari 2026</option>
            <option value="03">Maret 2026</option>
            <option value="04">April 2026</option>
            <option value="05">Mei 2026</option>
            <option value="06">Juni 2026</option>
          </select>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
            title="Notifikasi"
          >
            <Bell size={18} />
            {stats.pendingVerificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifikasi Sistem</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                  {stats.pendingVerificationCount} Menunggu
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {stats.pendingVerificationCount > 0 ? (
                  <div
                    onClick={() => {
                      setActiveMenu('verification');
                      setShowNotifDropdown(false);
                    }}
                    className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 hover:bg-amber-100/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900">
                          {stats.pendingVerificationCount} Transaksi Perlu Verifikasi
                        </p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Ada transaksi draft yang menunggu persetujuan Admin untuk masuk laporan resmi.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-4">Semua data transaksi telah disahkan.</p>
                )}
                <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-500">
                  Data acuan: <strong>Lapak Elka 2026 (1).xlsx</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Demo Role Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-indigo-600 font-semibold">{currentUser.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              </div>

              <div className="p-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Ganti Role Cepat (Demo)
                </p>
                <button
                  onClick={() => {
                    loginAsDemo('ADMIN');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    currentUser.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield size={14} className="text-purple-600" />
                    Role Admin (Full Akses)
                  </span>
                  {currentUser.role === 'ADMIN' && <span className="text-[10px]">Aktif</span>}
                </button>

                <button
                  onClick={() => {
                    loginAsDemo('STAFF');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    currentUser.role === 'STAFF' ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck size={14} className="text-sky-600" />
                    Role Staff (Input Transaksi)
                  </span>
                  {currentUser.role === 'STAFF' && <span className="text-[10px]">Aktif</span>}
                </button>

                <button
                  onClick={() => {
                    loginAsDemo('DPK');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    currentUser.role === 'DPK' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    Role DPK (Evaluasi & Audit)
                  </span>
                  {currentUser.role === 'DPK' && <span className="text-[10px]">Aktif</span>}
                </button>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-1">
                <button
                  onClick={() => {
                    resetToDemoData();
                    setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <RefreshCw size={13} className="text-slate-400" />
                  Reset Data Acuan Excel 2026
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium"
                >
                  Keluar ke Halaman Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
