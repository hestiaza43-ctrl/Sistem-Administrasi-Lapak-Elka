import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CashFlowTransaction, CashAccountType, CashFlowType, TransactionStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

interface CashFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: CashFlowType;
  initialData?: CashFlowTransaction | null;
}

export const CashFlowModal: React.FC<CashFlowModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'Pemasukan',
  initialData,
}) => {
  const { currentUser, addCashFlow, updateCashFlow } = useApp();

  const isStaff = currentUser?.role === 'STAFF';

  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [noBukti, setNoBukti] = useState<string>('');
  const [tipe, setTipe] = useState<CashFlowType>(defaultType);
  const [akunKasBank, setAkunKasBank] = useState<CashAccountType>('Bank BRI');
  const [coaCode, setCoaCode] = useState<string>('');
  const [kategori, setKategori] = useState<string>('');
  const [jumlah, setJumlah] = useState<number>(0);
  const [keterangan, setKeterangan] = useState<string>('');
  const [kontakTerkait, setKontakTerkait] = useState<string>('');
  const [status, setStatus] = useState<TransactionStatus>(isStaff ? 'Menunggu Verifikasi' : 'Disetujui');

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal);
      setNoBukti(initialData.noBukti);
      setTipe(initialData.tipe);
      setAkunKasBank(initialData.akunKasBank);
      setCoaCode(initialData.coaCode);
      setKategori(initialData.kategori);
      setJumlah(initialData.jumlah);
      setKeterangan(initialData.keterangan);
      setKontakTerkait(initialData.kontakTerkait || '');
      setStatus(initialData.status);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const rand = Math.floor(100 + Math.random() * 900);
      setTanggal(today);
      setTipe(defaultType);
      if (defaultType === 'Pemasukan') {
        setNoBukti(`BKM-2026-05-${rand}`);
        setCoaCode('1-1002');
        setKategori('Pelunasan SIPLAH Kemdikbud');
      } else {
        setNoBukti(`BKK-2026-05-${rand}`);
        setCoaCode('6-1002');
        setKategori('Beban Operasional Kantor & Listrik');
      }
      setJumlah(0);
      setKeterangan('');
      setKontakTerkait('');
      setStatus(isStaff ? 'Menunggu Verifikasi' : 'Disetujui');
    }
  }, [initialData, isOpen, defaultType, isStaff]);

  const handleTipeChange = (newTipe: CashFlowType) => {
    setTipe(newTipe);
    const rand = Math.floor(100 + Math.random() * 900);
    if (newTipe === 'Pemasukan') {
      setNoBukti(`BKM-2026-05-${rand}`);
      setKategori('Pelunasan SIPLAH Kemdikbud');
      setCoaCode('1-1002');
    } else {
      setNoBukti(`BKK-2026-05-${rand}`);
      setKategori('Beban Operasional Kantor & Listrik');
      setCoaCode('6-1002');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (jumlah <= 0) {
      alert('Nominal transaksi harus lebih dari Rp 0!');
      return;
    }
    if (!keterangan.trim()) {
      alert('Mohon isi uraian keterangan transaksi!');
      return;
    }

    const payload = {
      tanggal,
      noBukti,
      tipe,
      akunKasBank,
      coaCode,
      kategori,
      jumlah,
      keterangan,
      kontakTerkait,
      status,
      createdBy: currentUser?.username || 'staff',
    };

    if (initialData) {
      updateCashFlow(initialData.id, payload);
    } else {
      addCashFlow(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {initialData ? `Edit ${tipe}` : `Input ${tipe} Baru`}
            </h3>
            <p className="text-xs text-slate-400">Pencatatan buku kas masuk (BKM) atau buku kas keluar (BKK)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {/* Tipe Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTipeChange('Pemasukan')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tipe === 'Pemasukan' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              + Kas Masuk (Pemasukan)
            </button>
            <button
              type="button"
              onClick={() => handleTipeChange('Pengeluaran')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tipe === 'Pengeluaran' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              - Kas Keluar (Pengeluaran)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Bukti</label>
              <input
                type="text"
                required
                value={noBukti}
                onChange={e => setNoBukti(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Akun Kas / Bank</label>
              <select
                value={akunKasBank}
                onChange={e => setAkunKasBank(e.target.value as CashAccountType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Bank BRI">Bank BRI (Rekening Giro Utama)</option>
                <option value="Kas Kecil">Kas Kecil (Tunai Kantor)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Transaksi</label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {tipe === 'Pemasukan' ? (
                  <>
                    <option value="Pelunasan SIPLAH Kemdikbud">Pelunasan SIPLAH Kemdikbud</option>
                    <option value="Pelunasan Penjualan Non-SIPLAH">Pelunasan Penjualan Non-SIPLAH</option>
                    <option value="Uang Muka / DP Penjualan Non-SIPLAH">Uang Muka / DP Penjualan</option>
                    <option value="Pelunasan Tunai">Pelunasan Tunai Kasir</option>
                    <option value="Pendapatan Jasa Pengiriman">Pendapatan Jasa & Ekspedisi</option>
                  </>
                ) : (
                  <>
                    <option value="Beban Gaji Karyawan">Beban Gaji Karyawan</option>
                    <option value="Beban Operasional Kantor & Listrik">Beban Operasional & Listrik</option>
                    <option value="Beban Ekspedisi & Logistik">Beban Ekspedisi & Logistik</option>
                    <option value="Beban Pemeliharaan Aset & Servis">Pemeliharaan & Servis Kendaraan</option>
                    <option value="Pembayaran Hutang Vendor">Pembayaran Hutang Vendor</option>
                    <option value="Cicilan Hutang ke Dewan Pengawas">Cicilan Hutang ke Dewan</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Nominal (Rp)</label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                required
                value={jumlah}
                onChange={e => setJumlah(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {formatRupiah(jumlah)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Uraian / Keterangan Transaksi</label>
            <textarea
              required
              rows={2}
              placeholder="Jelaskan rincian pembayaran atau penerimaan..."
              value={keterangan}
              onChange={e => setKeterangan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kontak / Sekolah / Penerima Terkait (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: PT Axioo International / SMP Negeri 1"
              value={kontakTerkait}
              onChange={e => setKontakTerkait(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                tipe === 'Pemasukan'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
              }`}
            >
              <Check size={14} />
              <span>Simpan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
