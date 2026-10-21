import React, { useState } from 'react';
import { X, CheckCircle, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportEvaluation } from '../../types';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addEvaluation } = useApp();

  const [periode, setPeriode] = useState<string>('Bulan Mei 2026');
  const [status, setStatus] = useState<ReportEvaluation['status']>('Disetujui Tanpa Catatan');
  const [skorPenilaian, setSkorPenilaian] = useState<number>(95);
  const [ringkasan, setRingkasan] = useState<string>('');
  const [catatanKhusus, setCatatanKhusus] = useState<string>('');
  const [rekomendasi, setRekomendasi] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ringkasan.trim() || !rekomendasi.trim()) {
      alert('Mohon isi ringkasan evaluasi dan rekomendasi dewan pengawas!');
      return;
    }

    addEvaluation({
      periode,
      tanggalEvaluasi: new Date().toISOString().split('T')[0],
      namaEvaluator: currentUser?.name || 'Drs. H. Mulyono Santoso, Ak. (Ketua DPK)',
      status,
      skorPenilaian,
      ringkasan,
      catatanKhusus: catatanKhusus || 'Tidak ada catatan anomali.',
      rekomendasi,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800">Form Evaluasi Laporan Keuangan (DPK)</h3>
            <p className="text-xs text-slate-400">Pemberian catatan resmi Dewan Pengawas Keuangan Lapak Elka</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Periode Evaluasi</label>
              <select
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Bulan Mei 2026">Bulan Mei 2026</option>
                <option value="Bulan Juni 2026">Bulan Juni 2026</option>
                <option value="Triwulan I (Jan-Mar 2026)">Triwulan I (Jan-Mar 2026)</option>
                <option value="Triwulan II (Apr-Jun 2026)">Triwulan II (Apr-Jun 2026)</option>
                <option value="Semester I 2026">Semester I 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status Pengesahan</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ReportEvaluation['status'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Disetujui Tanpa Catatan">Disetujui Tanpa Catatan</option>
                <option value="Disetujui Dengan Catatan">Disetujui Dengan Catatan</option>
                <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600">Skor Kepatuhan Finansial (1 - 100)</label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {skorPenilaian} / 100
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={skorPenilaian}
              onChange={e => setSkorPenilaian(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ringkasan Tinjauan</label>
            <textarea
              required
              rows={2}
              placeholder="Contoh: Seluruh arus kas, mutasi bank BRI, dan BAST fisik pengiriman buku telah sesuai..."
              value={ringkasan}
              onChange={e => setRingkasan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan Khusus / Temuan Audit (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Catatan piutang sekolah yang perlu percepatan penagihan..."
              value={catatanKhusus}
              onChange={e => setCatatanKhusus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Rekomendasi Tindak Lanjut</label>
            <textarea
              required
              rows={2}
              placeholder="Rekomendasi strategis pengadaan barang atau pelunasan pinjaman dewan..."
              value={rekomendasi}
              onChange={e => setRekomendasi(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle size={14} />
              <span>Sahkan Evaluasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
