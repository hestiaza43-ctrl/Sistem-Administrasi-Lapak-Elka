import React, { useState, useEffect } from 'react';
import { X, Calculator, AlertCircle, Check } from 'lucide-react';
import { SalesTransaction, SalesType, TransactionStatus, PaymentStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatPercent } from '../../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SalesTransaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { currentUser, addSales, updateSales, coa } = useApp();

  const isStaff = currentUser?.role === 'STAFF';

  // Form State
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [noInvoice, setNoInvoice] = useState<string>('');
  const [coaCode, setCoaCode] = useState<string>('4-1001');
  const [jenisPenjualan, setJenisPenjualan] = useState<SalesType>('SIPLAH');
  const [marketing, setMarketing] = useState<string>('Ahmad Fadhil');
  const [namaPembeli, setNamaPembeli] = useState<string>('');
  const [instansi, setInstansi] = useState<string>('');
  const [namaBarang, setNamaBarang] = useState<string>('');
  const [kategoriBarang, setKategoriBarang] = useState<SalesTransaction['kategoriBarang']>('Buku Pelajaran');
  const [quantity, setQuantity] = useState<number>(1);
  const [satuan, setSatuan] = useState<string>('Unit');
  const [hargaModalUnit, setHargaModalUnit] = useState<number>(0);
  const [hargaJualUnit, setHargaJualUnit] = useState<number>(0);
  const [ppnPercent, setPpnPercent] = useState<number>(11);
  const [status, setStatus] = useState<TransactionStatus>(isStaff ? 'Menunggu Verifikasi' : 'Disetujui');
  const [statusPembayaran, setStatusPembayaran] = useState<PaymentStatus>('Piutang');
  const [catatan, setCatatan] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal);
      setNoInvoice(initialData.noInvoice);
      setCoaCode(initialData.coaCode);
      setJenisPenjualan(initialData.jenisPenjualan);
      setMarketing(initialData.marketing);
      setNamaPembeli(initialData.namaPembeli);
      setInstansi(initialData.instansi);
      setNamaBarang(initialData.namaBarang);
      setKategoriBarang(initialData.kategoriBarang);
      setQuantity(initialData.quantity);
      setSatuan(initialData.satuan);
      setHargaModalUnit(initialData.hargaModalUnit);
      setHargaJualUnit(initialData.hargaJualUnit);
      setPpnPercent(initialData.ppnPercent);
      setStatus(initialData.status);
      setStatusPembayaran(initialData.statusPembayaran);
      setCatatan(initialData.catatan || '');
    } else {
      // Auto-generate invoice number based on type
      const randNum = Math.floor(100 + Math.random() * 900);
      const today = new Date().toISOString().split('T')[0];
      setTanggal(today);
      if (jenisPenjualan === 'SIPLAH') {
        setNoInvoice(`SIPLAH-2026-05-0${randNum}`);
        setCoaCode('4-1001');
      } else {
        setNoInvoice(`INV-ELKA-2026-05-0${randNum}`);
        setCoaCode('4-1002');
      }
      setNamaPembeli('');
      setInstansi('');
      setNamaBarang('');
      setQuantity(1);
      setHargaModalUnit(0);
      setHargaJualUnit(0);
      setStatus(isStaff ? 'Menunggu Verifikasi' : 'Disetujui');
      setStatusPembayaran('Piutang');
      setCatatan('');
    }
  }, [initialData, isOpen, jenisPenjualan, isStaff]);

  // Handle Jenis Change
  const handleJenisChange = (val: SalesType) => {
    setJenisPenjualan(val);
    const randNum = Math.floor(100 + Math.random() * 900);
    if (val === 'SIPLAH') {
      setNoInvoice(`SIPLAH-2026-05-0${randNum}`);
      setCoaCode('4-1001');
      if (kategoriBarang === 'Buku Pelajaran') setPpnPercent(0);
    } else {
      setNoInvoice(`INV-ELKA-2026-05-0${randNum}`);
      setCoaCode('4-1002');
    }
  };

  // Calculations
  const totalModal = quantity * (hargaModalUnit || 0);
  const subtotalJual = quantity * (hargaJualUnit || 0);
  const nilaiPpn = subtotalJual * (ppnPercent / 100);
  const totalPenjualan = subtotalJual + nilaiPpn;
  const labaKotor = totalPenjualan - totalModal;
  const profitMarginPercent = totalPenjualan > 0 ? (labaKotor / totalPenjualan) * 100 : 0;
  const sisaPiutang = statusPembayaran === 'Lunas' ? 0 : totalPenjualan;
  const jumlahDibayar = statusPembayaran === 'Lunas' ? totalPenjualan : 0;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaPembeli.trim() || !instansi.trim() || !namaBarang.trim()) {
      alert('Mohon lengkapi Nama Pembeli, Nama Sekolah/Instansi, dan Nama Barang!');
      return;
    }

    if (quantity <= 0 || hargaJualUnit <= 0) {
      alert('Quantity dan Harga Jual harus lebih dari 0!');
      return;
    }

    const payload = {
      tanggal,
      noInvoice,
      coaCode,
      jenisPenjualan,
      marketing,
      namaPembeli,
      instansi,
      namaBarang,
      kategoriBarang,
      quantity,
      satuan,
      hargaModalUnit,
      hargaJualUnit,
      ppnPercent,
      totalModal,
      totalPenjualan,
      labaKotor,
      profitMarginPercent,
      status,
      statusPembayaran,
      jumlahDibayar,
      sisaPiutang,
      catatan,
      createdBy: currentUser?.username || 'staff',
    };

    if (initialData) {
      updateSales(initialData.id, payload);
    } else {
      addSales(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {initialData ? 'Edit Data Transaksi Penjualan' : 'Input Transaksi Penjualan Baru'}
            </h3>
            <p className="text-xs text-slate-400">
              Sesuai format worksheet Excel Rincian Penjualan Lapak Elka 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto custom-scrollbar">
          {/* Row 1: Tanggal, Jenis, No Invoice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Penjualan</label>
              <select
                value={jenisPenjualan}
                onChange={e => handleJenisChange(e.target.value as SalesType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
              >
                <option value="SIPLAH">SIPLAH (Marketplace Kemdikbud)</option>
                <option value="Non-SIPLAH">Non-SIPLAH (Langsung / Regular)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Invoice</label>
              <input
                type="text"
                required
                value={noInvoice}
                onChange={e => setNoInvoice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: Akun COA & Marketing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kode Akun COA Pendapatan</label>
              <select
                value={coaCode}
                onChange={e => setCoaCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="4-1001">4-1001 - Pendapatan Penjualan SIPLAH</option>
                <option value="4-1002">4-1002 - Pendapatan Penjualan Non-SIPLAH</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Marketing Lapak</label>
              <select
                value={marketing}
                onChange={e => setMarketing(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Ahmad Fadhil">Ahmad Fadhil</option>
                <option value="Siti Rahma">Siti Rahma</option>
                <option value="Rizky Pratama">Rizky Pratama</option>
                <option value="Budi Santoso">Budi Santoso</option>
                <option value="Dewi Lestari">Dewi Lestari</option>
              </select>
            </div>
          </div>

          {/* Row 3: Sekolah / Yayasan & Nama Pembeli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Sekolah / Yayasan</label>
              <input
                type="text"
                required
                placeholder="Contoh: SMP Negeri 1 Surabaya / SD Muhammadiyah 4"
                value={instansi}
                onChange={e => setInstansi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pembeli / Kepala Sekolah / Bendahara</label>
              <input
                type="text"
                required
                placeholder="Contoh: Drs. H. Mulyadi, M.Pd"
                value={namaPembeli}
                onChange={e => setNamaPembeli(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 4: Nama Barang & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Barang atau Keterangan Paket</label>
              <input
                type="text"
                required
                placeholder="Contoh: Paket Buku Kurikulum Merdeka Fase D (Kelas 7)"
                value={namaBarang}
                onChange={e => setNamaBarang(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Barang</label>
              <select
                value={kategoriBarang}
                onChange={e => {
                  const val = e.target.value as SalesTransaction['kategoriBarang'];
                  setKategoriBarang(val);
                  // Standard tax rule: textbooks are 0% PPN
                  if (val === 'Buku Pelajaran') setPpnPercent(0);
                  else setPpnPercent(11);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Buku Pelajaran">Buku Pelajaran</option>
                <option value="Perangkat IT">Perangkat IT</option>
                <option value="Laboratorium">Laboratorium</option>
                <option value="Alat Peraga">Alat Peraga</option>
                <option value="ATK & Cetak">ATK & Cetak</option>
                <option value="Mebel & Perlengkapan">Mebel & Perlengkapan</option>
              </select>
            </div>
          </div>

          {/* Row 5: Qty, Satuan, Modal/Unit, Jual/Unit, PPN */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity (Qty)</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Satuan</label>
              <select
                value={satuan}
                onChange={e => setSatuan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Unit">Unit</option>
                <option value="Paket">Paket</option>
                <option value="Eks">Eks (Eksemplar)</option>
                <option value="Set">Set</option>
                <option value="Rim">Rim</option>
                <option value="Pcs">Pcs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Modal / Unit (Rp)</label>
              <input
                type="number"
                min="0"
                required
                value={hargaModalUnit}
                onChange={e => setHargaModalUnit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Jual / Unit (Rp)</label>
              <input
                type="number"
                min="0"
                required
                value={hargaJualUnit}
                onChange={e => setHargaJualUnit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">PPN (%)</label>
              <select
                value={ppnPercent}
                onChange={e => setPpnPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="0">0% (Bebas PPN / Buku)</option>
                <option value="11">11% (Standar PPN)</option>
              </select>
            </div>
          </div>

          {/* Calculation Summary Card */}
          <div className="p-4 bg-gradient-to-r from-indigo-50/70 via-sky-50/60 to-purple-50/50 rounded-2xl border border-indigo-100/80">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-900">
              <Calculator size={15} />
              <span>Kalkulasi Otomatis Keuangan</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-slate-500 text-[11px]">Total Modal (HPP)</p>
                <p className="font-bold text-slate-800 tabular-nums">{formatRupiah(totalModal)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Total Penjualan (+PPN)</p>
                <p className="font-bold text-indigo-700 tabular-nums">{formatRupiah(totalPenjualan)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Laba Kotor</p>
                <p className="font-bold text-emerald-600 tabular-nums">{formatRupiah(labaKotor)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Profit Margin</p>
                <p className="font-bold text-purple-700 tabular-nums">{formatPercent(profitMarginPercent)}</p>
              </div>
            </div>
          </div>

          {/* Row 6: Status Transaksi & Pembayaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status Verifikasi Transaksi</label>
              <select
                disabled={isStaff && !initialData}
                value={status}
                onChange={e => setStatus(e.target.value as TransactionStatus)}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold ${
                  isStaff && !initialData
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                    : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <option value="Draft">Draft (Belum Diajukan)</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi Admin</option>
                {!isStaff && <option value="Disetujui">Disetujui (Masuk Laporan Resmi)</option>}
                {!isStaff && <option value="Direvisi">Dikembalikan Untuk Revisi</option>}
              </select>
              {isStaff && (
                <p className="text-[10px] text-slate-400 mt-1">
                  *Staff menginput dengan status default &quot;Menunggu Verifikasi&quot; untuk divalidasi oleh Admin.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status Pembayaran</label>
              <select
                value={statusPembayaran}
                onChange={e => setStatusPembayaran(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Piutang">Piutang (Belum Dibayar)</option>
                <option value="Sebagian">Sebagian (DP Masuk)</option>
                <option value="Lunas">Lunas (Dana Masuk Kas/Bank)</option>
              </select>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan Transaksi / Keterangan Ekspedisi</label>
            <textarea
              rows={2}
              placeholder="Catatan nomor resi, pengantaran mobil elka, atau BAST fisik..."
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Submit Actions */}
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
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-md shadow-indigo-200 flex items-center gap-1.5 transition-all"
            >
              <Check size={14} />
              <span>{initialData ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
