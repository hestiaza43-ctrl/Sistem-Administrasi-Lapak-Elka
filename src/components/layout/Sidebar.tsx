import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Building2,
  Store,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  ListTree,
  Scale,
  ReceiptText,
  FileSpreadsheet,
  Coins,
  Package,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Clock,
  UserCheck,
  LineChart,
  ShieldAlert,
  ClipboardCheck,
  User as UserIcon,
  HelpCircle,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentUser, activeMenu, setActiveMenu, logout, stats } = useApp();

  if (!currentUser) return null;

  const role = currentUser.role;

  const renderAdminMenu = (): MenuItem[] => [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales-all', label: 'Data Penjualan', icon: ShoppingCart },
    { id: 'sales-siplah', label: 'Penjualan SIPLAH', icon: Building2 },
    { id: 'sales-non-siplah', label: 'Penjualan Non-SIPLAH', icon: Store },
    { id: 'cash-in', label: 'Data Pemasukan', icon: ArrowDownCircle },
    { id: 'cash-out', label: 'Data Pengeluaran', icon: ArrowUpCircle },
    { id: 'cash-bank', label: 'Kas dan Bank', icon: Wallet },
    { id: 'coa', label: 'Chart of Accounts (COA)', icon: ListTree },
    { id: 'trial-balance', label: 'Trial Balance', icon: Scale },
    { id: 'income-statement', label: 'Laporan Laba Rugi', icon: ReceiptText },
    { id: 'balance-sheet', label: 'Neraca Keuangan', icon: FileSpreadsheet },
    { id: 'debt-receivable', label: 'Piutang & Hutang', icon: Coins },
    { id: 'assets', label: 'Data Aset & Kendaraan', icon: Package },
    { id: 'verification', label: 'Verifikasi Transaksi', icon: ClipboardCheck, badge: stats.pendingVerificationCount },
    { id: 'user-management', label: 'Manajemen Pengguna', icon: Users },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const renderStaffMenu = (): MenuItem[] => [
    { id: 'dashboard-staff', label: 'Dashboard Staff', icon: LayoutDashboard },
    { id: 'staff-input-sales', label: 'Input Penjualan', icon: PlusCircle },
    { id: 'sales-siplah', label: 'Penjualan SIPLAH', icon: Building2 },
    { id: 'sales-non-siplah', label: 'Penjualan Non-SIPLAH', icon: Store },
    { id: 'staff-input-cash-in', label: 'Input Pemasukan', icon: ArrowDownCircle },
    { id: 'staff-input-cash-out', label: 'Input Pengeluaran', icon: ArrowUpCircle },
    { id: 'sales-all', label: 'Riwayat Transaksi', icon: Clock },
    { id: 'verification', label: 'Status Verifikasi', icon: ClipboardCheck, badge: stats.pendingVerificationCount },
    { id: 'profile', label: 'Profil Saya', icon: UserIcon },
  ];

  const renderDpkMenu = (): MenuItem[] => [
    { id: 'dashboard-dpk', label: 'Dashboard DPK', icon: LayoutDashboard },
    { id: 'dpk-sales-summary', label: 'Ringkasan Penjualan', icon: ShoppingCart },
    { id: 'sales-all', label: 'Laporan Penjualan', icon: FileCheck2 },
    { id: 'income-statement', label: 'Laporan Laba Rugi', icon: ReceiptText },
    { id: 'balance-sheet', label: 'Neraca Keuangan', icon: FileSpreadsheet },
    { id: 'cash-bank', label: 'Laporan Kas dan Bank', icon: Wallet },
    { id: 'debt-receivable', label: 'Laporan Piutang & Hutang', icon: Coins },
    { id: 'dpk-sales-performance', label: 'Performa Penjualan', icon: LineChart },
    { id: 'dpk-evaluation', label: 'Evaluasi Laporan', icon: ClipboardCheck },
    { id: 'profile', label: 'Profil DPK', icon: UserIcon },
  ];

  const menuItems = role === 'ADMIN' ? renderAdminMenu() : role === 'STAFF' ? renderStaffMenu() : renderDpkMenu();

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200/80 flex flex-col h-screen shrink-0 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-200/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-indigo-100 font-bold text-lg">
          LE
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
            Lapak Elka
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-200">
              2026
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">Sistem Penjualan & Keuangan</p>
        </div>
      </div>

      {/* Role Pill Indicator */}
      <div className="px-4 pt-3 pb-1">
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border ${
          role === 'ADMIN'
            ? 'bg-purple-50 text-purple-700 border-purple-200'
            : role === 'STAFF'
            ? 'bg-sky-50 text-sky-700 border-sky-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>Akses: {role}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
            {role === 'ADMIN' ? 'Full' : role === 'STAFF' ? 'Input' : 'Audit'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Menu Navigasi
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[#6366F1]/10 to-[#818CF8]/10 text-[#4F46E5] font-semibold shadow-xs border border-indigo-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={17}
                  className={isActive ? 'text-[#6366F1]' : 'text-slate-400 group-hover:text-slate-600'}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="p-3 border-t border-slate-200/60 bg-white/70">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser.title}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
        >
          <LogOut size={14} />
          <span>Keluar (Logout)</span>
        </button>

        <div className="mt-2 text-[10px] text-center text-slate-400 font-mono">
          v1.0.0 · Publikasi Vercel
        </div>
      </div>
    </aside>
  );
};
