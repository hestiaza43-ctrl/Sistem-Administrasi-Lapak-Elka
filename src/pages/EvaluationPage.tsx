import React, { useState } from 'react';
import { ClipboardCheck, Plus, CheckCircle2, AlertCircle, Printer, Download, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EvaluationModal } from '../components/modals/EvaluationModal';
import { formatDate } from '../utils/formatters';

export const EvaluationPage: React.FC = () => {
  const { evaluations, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canAdd = currentUser?.role === 'DPK' || currentUser?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Evaluasi Laporan Keuangan (Dewan Pengawas Keuangan)
          </h1>
          <p className="text-xs text-slate-400">
            Audit berkala kinerja penjualan, rasio keuangan, dan pengesahan resmi DPK Lapak Elka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Printer size={14} />
            <span>Cetak Berita Acara</span>
          </button>

          {canAdd && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-200"
            >
              <Plus size={15} />
              <span>Input Evaluasi DPK</span>
            </button>
          )}
        </div>
      </div>

      {/* Evaluations Feed */}
      <div className="space-y-4">
        {evaluations.map(ev => (
          <div
            key={ev.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Periode Laporan
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{ev.periode}</h3>
                <p className="text-xs text-slate-500">
                  Tanggal Sidang Evaluasi: {formatDate(ev.tanggalEvaluasi)} · Evaluator: {ev.namaEvaluator}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Skor Kepatuhan</span>
                  <div className="flex items-center gap-1 font-mono font-black text-emerald-700 text-sm">
                    <Star size={14} className="fill-emerald-500 text-emerald-500" />
                    <span>{ev.skorPenilaian} / 100</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    ev.status === 'Disetujui Tanpa Catatan'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {ev.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Ringkasan Analisis Finansial
                </span>
                <p className="text-slate-600 leading-relaxed">{ev.ringkasan}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                  Catatan Temuan / Pengawasan
                </span>
                <p className="text-slate-600 leading-relaxed">{ev.catatanKhusus}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs">
              <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">
                Rekomendasi Resmi Dewan Pengawas
              </span>
              <p className="text-emerald-950 font-medium mt-1 leading-relaxed">{ev.rekomendasi}</p>
            </div>
          </div>
        ))}
      </div>

      <EvaluationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
