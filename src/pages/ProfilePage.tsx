import React from 'react';
import { User, Mail, Shield, CheckCircle2, Building, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Profil Pengguna</h1>
        <p className="text-xs text-slate-400">Informasi Otoritas Akun Sistem Informasi Lapak Elka 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{currentUser.title}</p>
            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 mt-1 border border-indigo-200">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <User size={15} /> Username
            </span>
            <span className="font-mono font-bold text-slate-800">{currentUser.username}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <Mail size={15} /> Email Resmi
            </span>
            <span className="font-semibold text-slate-800">{currentUser.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <Building size={15} /> Unit Lembaga
            </span>
            <span className="font-semibold text-slate-800">Lapak Elka (Divisi Pengadaan Sekolah)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 text-slate-500">
              <Calendar size={15} /> Periode Akuntansi
            </span>
            <span className="font-bold text-emerald-600">Tahun Anggaran 2026 (Aktif)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
