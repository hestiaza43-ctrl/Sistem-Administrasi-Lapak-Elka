import React, { useState } from 'react';
import { Shield, UserCheck, FileSpreadsheet, Eye, EyeOff, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(username, password);
    if (!success) {
      setErrorMsg('Username atau password tidak sesuai. Silakan gunakan tombol demo di bawah.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] via-[#F8FAFC] to-[#EDE9FE] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative soft blurred background circles */}
      <div className="absolute top-12 left-12 w-72 h-72 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#38BDF8] text-white shadow-xl shadow-indigo-200 mb-3">
            <span className="font-extrabold text-2xl tracking-tight">LE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
            SISTEM INFORMASI LAPORAN PENJUALAN LAPAK ELKA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Sistem Pengelolaan Penjualan dan Laporan Keuangan Terintegrasi
          </p>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-800">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-400">Silakan masukkan username dan password Anda</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="admin / staff / dpk"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input with show/hide */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Demo Login Pengguna
              </span>
            </div>
          </div>

          {/* Demo Cards Section */}
          <div className="space-y-2.5">
            {/* Demo 1: ADMIN */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50/70 to-indigo-50/50 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-950">Demo 1 — ADMIN</p>
                  <p className="text-[11px] text-purple-700/80 font-mono">admin / admin123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => loginAsDemo('ADMIN')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
              >
                Login Admin
              </button>
            </div>

            {/* Demo 2: STAFF */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50/70 to-blue-50/50 border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-950">Demo 2 — STAFF</p>
                  <p className="text-[11px] text-sky-700/80 font-mono">staff / staff123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => loginAsDemo('STAFF')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
              >
                Login Staff
              </button>
            </div>

            {/* Demo 3: DPK */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileSpreadsheet size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Demo 3 — DPK</p>
                  <p className="text-[11px] text-emerald-700/80 font-mono">dpk / dpk123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => loginAsDemo('DPK')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
              >
                Login DPK
              </button>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
            *Akun tersebut hanya untuk demonstrasi prototipe, bukan kredensial produksi. Acuan data: Lapak Elka 2026 (1).xlsx
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status Deployment</span>
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Versi Publikasi v1.0.0 (Vercel Ready)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
