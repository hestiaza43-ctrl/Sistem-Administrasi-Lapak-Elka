import React from 'react';
import { Users, Shield, UserCheck, FileSpreadsheet, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserManagementPage: React.FC = () => {
  const { users } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Manajemen Pengguna & Hak Akses</h1>
          <p className="text-xs text-slate-400">
            Daftar Akun Otoritas Sistem Multi-Role: Admin, Staff Penjualan, dan Dewan Pengawas Keuangan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {users.map(u => (
          <div
            key={u.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    u.role === 'ADMIN'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : u.role === 'STAFF'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  Role: {u.role}
                </span>

                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 size={13} />
                  <span>Aktif</span>
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-md shadow-indigo-100">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{u.name}</h3>
                  <p className="text-xs text-slate-400">{u.title}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Username:</span>
                  <span className="font-mono font-bold text-slate-800">{u.username}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Email Resmi:</span>
                  <span className="text-slate-700 truncate max-w-[170px]">{u.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hak Akses:</span>
              <p className="text-xs text-slate-600 mt-1">
                {u.role === 'ADMIN'
                  ? 'Akses penuh seluruh modul, verifikasi transaksi, manajemen pengguna & ekspor laporan.'
                  : u.role === 'STAFF'
                  ? 'Input transaksi penjualan SIPLAH/Non-SIPLAH, mutasi kas, dan revisi draft.'
                  : 'Monitoring seluruh laporan keuangan, neraca, evaluasi DPK, dan cetak PDF.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
