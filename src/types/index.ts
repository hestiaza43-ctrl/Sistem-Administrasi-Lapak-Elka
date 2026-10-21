export type UserRole = 'ADMIN' | 'STAFF' | 'DPK';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
  email: string;
}

export type SalesType = 'SIPLAH' | 'Non-SIPLAH';

export type TransactionStatus = 'Draft' | 'Menunggu Verifikasi' | 'Disetujui' | 'Direvisi';

export type PaymentStatus = 'Lunas' | 'Sebagian' | 'Piutang';

export interface SalesTransaction {
  id: string;
  tanggal: string; // YYYY-MM-DD
  noInvoice: string;
  coaCode: string;
  jenisPenjualan: SalesType;
  marketing: string;
  namaPembeli: string;
  instansi: string; // Nama Sekolah / Yayasan
  namaBarang: string;
  kategoriBarang: 'Buku Pelajaran' | 'Perangkat IT' | 'Laboratorium' | 'Alat Peraga' | 'ATK & Cetak' | 'Mebel & Perlengkapan';
  quantity: number;
  satuan: string;
  hargaModalUnit: number;
  hargaJualUnit: number;
  ppnPercent: number; // e.g., 0 or 11
  totalModal: number;
  totalPenjualan: number;
  labaKotor: number;
  profitMarginPercent: number;
  status: TransactionStatus;
  statusPembayaran: PaymentStatus;
  jumlahDibayar: number;
  sisaPiutang: number;
  jatuhTempo?: string;
  createdBy: string;
  catatan?: string;
  catatanRevisi?: string;
  diverifikasiOleh?: string;
  tanggalVerifikasi?: string;
}

export type CashAccountType = 'Kas Kecil' | 'Bank BRI';

export type CashFlowType = 'Pemasukan' | 'Pengeluaran';

export interface CashFlowTransaction {
  id: string;
  tanggal: string;
  noBukti: string;
  tipe: CashFlowType;
  akunKasBank: CashAccountType;
  coaCode: string;
  kategori: string;
  jumlah: number;
  keterangan: string;
  kontakTerkait?: string;
  status: TransactionStatus;
  createdBy: string;
}

export interface COAAccount {
  code: string;
  name: string;
  category: 'Aset Lancar' | 'Aset Tetap' | 'Kewajiban Lancar' | 'Kewajiban Jangka Panjang' | 'Ekuitas' | 'Pendapatan' | 'HPP' | 'Beban Operasional' | 'Pendapatan/Beban Lain';
  normalBalance: 'Debet' | 'Kredit';
  initialBalance: number;
  description?: string;
}

export interface AssetRecord {
  id: string;
  kodeAset: string;
  namaAset: string;
  kategori: 'Peralatan Lapak' | 'Kendaraan Operasional' | 'Inventaris Kantor';
  tanggalPerolehan: string;
  nilaiPerolehan: number;
  estimasiUmurBulan: number;
  akumulasiPenyusutan: number;
  nilaiBuku: number;
  kondisi: 'Baik' | 'Perlu Servis' | 'Rusak Ringan';
  lokasi: string;
  nopol?: string; // Khusus kendaraan
  penanggungJawab: string;
}

export interface DewanLoan {
  id: string;
  namaDewan: string;
  peruntukan: string;
  tanggalPinjaman: string;
  jumlahPinjaman: number;
  totalDicicil: number;
  sisaHutang: number;
  status: 'Aktif' | 'Lunas';
  jatuhTempo: string;
  catatan: string;
}

export interface ReportEvaluation {
  id: string;
  periode: string;
  tanggalEvaluasi: string;
  namaEvaluator: string; // Anggota DPK
  status: 'Disetujui Tanpa Catatan' | 'Disetujui Dengan Catatan' | 'Perlu Klarifikasi' | 'Menunggu Evaluasi';
  skorPenilaian: number; // 1-100
  ringkasan: string;
  catatanKhusus: string;
  rekomendasi: string;
}

export interface SystemStats {
  totalPenjualan: number;
  totalPenjualanSiplah: number;
  totalPenjualanNonSiplah: number;
  totalModalHPP: number;
  totalLabaKotor: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  totalLabaBersih: number;
  profitMarginPercent: number;
  saldoKasKecil: number;
  saldoBankBRI: number;
  totalKasDanBank: number;
  totalPiutang: number;
  totalHutang: number;
  totalHutangDewan: number;
  pendingVerificationCount: number;
  totalTransaksiPenjualan: number;
}
