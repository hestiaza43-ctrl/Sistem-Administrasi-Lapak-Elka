import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  UserRole,
  SalesTransaction,
  CashFlowTransaction,
  COAAccount,
  AssetRecord,
  DewanLoan,
  ReportEvaluation,
  SystemStats
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COA,
  INITIAL_SALES,
  INITIAL_CASH_FLOW,
  INITIAL_ASSETS,
  INITIAL_DEWAN_LOANS,
  INITIAL_EVALUATIONS
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  login: (username: string, pass: string) => boolean;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  
  // Data
  sales: SalesTransaction[];
  cashFlow: CashFlowTransaction[];
  coa: COAAccount[];
  assets: AssetRecord[];
  dewanLoans: DewanLoan[];
  evaluations: ReportEvaluation[];
  stats: SystemStats;
  
  // Sales CRUD
  addSales: (data: Omit<SalesTransaction, 'id'>) => string;
  updateSales: (id: string, data: Partial<SalesTransaction>) => void;
  deleteSales: (id: string) => void;
  verifySales: (id: string, status: 'Disetujui' | 'Direvisi', notes?: string) => void;
  
  // CashFlow CRUD
  addCashFlow: (data: Omit<CashFlowTransaction, 'id'>) => string;
  updateCashFlow: (id: string, data: Partial<CashFlowTransaction>) => void;
  deleteCashFlow: (id: string) => void;
  
  // Evaluation (DPK)
  addEvaluation: (data: Omit<ReportEvaluation, 'id'>) => void;

  // Import / Export
  importSalesBatch: (newSales: Omit<SalesTransaction, 'id'>[]) => { count: number; duplicates: number };
  resetToDemoData: () => void;

  // Notifications / Feedback toast
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'elka_current_user',
  SALES: 'elka_sales_data',
  CASH_FLOW: 'elka_cash_flow_data',
  COA: 'elka_coa_data',
  ASSETS: 'elka_assets_data',
  DEWAN_LOANS: 'elka_dewan_loans',
  EVALUATIONS: 'elka_evaluations_data',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state (defaults to null for login page)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users] = useState<User[]>(INITIAL_USERS);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // App dataset states with localStorage fallback
  const [sales, setSales] = useState<SalesTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [cashFlow, setCashFlow] = useState<CashFlowTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASH_FLOW);
      return saved ? JSON.parse(saved) : INITIAL_CASH_FLOW;
    } catch {
      return INITIAL_CASH_FLOW;
    }
  });

  const [coa, setCoa] = useState<COAAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COA);
      return saved ? JSON.parse(saved) : INITIAL_COA;
    } catch {
      return INITIAL_COA;
    }
  });

  const [assets, setAssets] = useState<AssetRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      return saved ? JSON.parse(saved) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  const [dewanLoans, setDewanLoans] = useState<DewanLoan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEWAN_LOANS);
      return saved ? JSON.parse(saved) : INITIAL_DEWAN_LOANS;
    } catch {
      return INITIAL_DEWAN_LOANS;
    }
  });

  const [evaluations, setEvaluations] = useState<ReportEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(cashFlow));
  }, [cashFlow]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COA, JSON.stringify(coa));
  }, [coa]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEWAN_LOANS, JSON.stringify(dewanLoans));
  }, [dewanLoans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
  }, [evaluations]);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  // Authentication Handlers
  const login = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === 'admin' && (cleanPass === 'admin123' || cleanPass === 'admin')) {
      const u = INITIAL_USERS.find(x => x.role === 'ADMIN')!;
      setCurrentUser(u);
      setActiveMenu('dashboard');
      showNotification('success', `Selamat datang, ${u.name} (Admin Lapak Elka)`);
      return true;
    }
    if (cleanUser === 'staff' && (cleanPass === 'staff123' || cleanPass === 'staff')) {
      const u = INITIAL_USERS.find(x => x.role === 'STAFF')!;
      setCurrentUser(u);
      setActiveMenu('dashboard-staff');
      showNotification('success', `Selamat datang, ${u.name} (Staff Penjualan)`);
      return true;
    }
    if (cleanUser === 'dpk' && (cleanPass === 'dpk123' || cleanPass === 'dpk')) {
      const u = INITIAL_USERS.find(x => x.role === 'DPK')!;
      setCurrentUser(u);
      setActiveMenu('dashboard-dpk');
      showNotification('success', `Selamat datang, ${u.name} (Dewan Pengawas Keuangan)`);
      return true;
    }

    showNotification('error', 'Username atau password salah! Silakan coba demo login di bawah.');
    return false;
  };

  const loginAsDemo = (role: UserRole) => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      if (role === 'ADMIN') setActiveMenu('dashboard');
      if (role === 'STAFF') setActiveMenu('dashboard-staff');
      if (role === 'DPK') setActiveMenu('dashboard-dpk');
      showNotification('success', `Berhasil masuk sebagai ${user.name} (${role})`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveMenu('dashboard');
    showNotification('info', 'Anda telah keluar dari sistem.');
  };

  // Calculations for SystemStats
  const stats = useMemo<SystemStats>(() => {
    // Only approved sales count towards final income & gross profit
    const approvedSales = sales.filter(s => s.status === 'Disetujui');
    
    const totalPenjualan = approvedSales.reduce((acc, curr) => acc + curr.totalPenjualan, 0);
    const totalPenjualanSiplah = approvedSales
      .filter(s => s.jenisPenjualan === 'SIPLAH')
      .reduce((acc, curr) => acc + curr.totalPenjualan, 0);
    const totalPenjualanNonSiplah = approvedSales
      .filter(s => s.jenisPenjualan === 'Non-SIPLAH')
      .reduce((acc, curr) => acc + curr.totalPenjualan, 0);

    const totalModalHPP = approvedSales.reduce((acc, curr) => acc + curr.totalModal, 0);
    const totalLabaKotor = totalPenjualan - totalModalHPP;

    // Cashflow totals
    const approvedCashIn = cashFlow
      .filter(c => c.tipe === 'Pemasukan' && c.status === 'Disetujui')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    const approvedCashOut = cashFlow
      .filter(c => c.tipe === 'Pengeluaran' && c.status === 'Disetujui')
      .reduce((acc, curr) => acc + curr.jumlah, 0);

    // Operating expenses (excluding HPP / debt principal payments to avoid double counting)
    const operatingExpenses = cashFlow
      .filter(c => c.tipe === 'Pengeluaran' && c.status === 'Disetujui' && c.coaCode.startsWith('6-'))
      .reduce((acc, curr) => acc + curr.jumlah, 0);

    const otherIncomes = cashFlow
      .filter(c => c.tipe === 'Pemasukan' && c.status === 'Disetujui' && c.coaCode === '4-2001')
      .reduce((acc, curr) => acc + curr.jumlah, 0);

    const totalLabaBersih = totalLabaKotor + otherIncomes - operatingExpenses;
    const profitMarginPercent = totalPenjualan > 0 ? (totalLabaBersih / totalPenjualan) * 100 : 0;

    // Cash and Bank balances calculated accurately from initial + mutasi
    const initialKasKecil = coa.find(c => c.code === '1-1001')?.initialBalance || 12500000;
    const initialBankBRI = coa.find(c => c.code === '1-1002')?.initialBalance || 184500000;

    const mutasiKasKecilIn = cashFlow
      .filter(c => c.akunKasBank === 'Kas Kecil' && c.tipe === 'Pemasukan' && c.status === 'Disetujui')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    const mutasiKasKecilOut = cashFlow
      .filter(c => c.akunKasBank === 'Kas Kecil' && c.tipe === 'Pengeluaran' && c.status === 'Disetujui')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    const saldoKasKecil = initialKasKecil + mutasiKasKecilIn - mutasiKasKecilOut;

    const mutasiBankIn = cashFlow
      .filter(c => c.akunKasBank === 'Bank BRI' && c.tipe === 'Pemasukan' && c.status === 'Disetujui')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    const mutasiBankOut = cashFlow
      .filter(c => c.akunKasBank === 'Bank BRI' && c.tipe === 'Pengeluaran' && c.status === 'Disetujui')
      .reduce((acc, curr) => acc + curr.jumlah, 0);
    const saldoBankBRI = initialBankBRI + mutasiBankIn - mutasiBankOut;

    const totalKasDanBank = saldoKasKecil + saldoBankBRI;

    // Accounts receivable (Piutang)
    const totalPiutang = sales
      .filter(s => s.status === 'Disetujui')
      .reduce((acc, curr) => acc + (curr.sisaPiutang || 0), 0);

    // Accounts payable (Hutang)
    const vendorPayable = coa.find(c => c.code === '2-1001')?.initialBalance || 58000000;
    const totalHutangDewan = dewanLoans.reduce((acc, curr) => acc + (curr.sisaHutang || 0), 0);
    const totalHutang = vendorPayable + totalHutangDewan;

    const pendingVerificationCount = sales.filter(s => s.status === 'Menunggu Verifikasi').length +
      cashFlow.filter(c => c.status === 'Menunggu Verifikasi').length;

    return {
      totalPenjualan,
      totalPenjualanSiplah,
      totalPenjualanNonSiplah,
      totalModalHPP,
      totalLabaKotor,
      totalPemasukan: approvedCashIn,
      totalPengeluaran: approvedCashOut,
      totalLabaBersih,
      profitMarginPercent,
      saldoKasKecil,
      saldoBankBRI,
      totalKasDanBank,
      totalPiutang,
      totalHutang,
      totalHutangDewan,
      pendingVerificationCount,
      totalTransaksiPenjualan: approvedSales.length,
    };
  }, [sales, cashFlow, coa, dewanLoans]);

  // Sales CRUD Handlers
  const addSales = (data: Omit<SalesTransaction, 'id'>): string => {
    const newId = `SLS-2026-${String(sales.length + 1).padStart(3, '0')}`;
    const newRecord: SalesTransaction = {
      ...data,
      id: newId,
    };
    setSales(prev => [newRecord, ...prev]);
    showNotification('success', `Transaksi ${newRecord.noInvoice} berhasil disimpan.`);
    return newId;
  };

  const updateSales = (id: string, data: Partial<SalesTransaction>) => {
    setSales(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
    showNotification('success', 'Data penjualan berhasil diperbarui.');
  };

  const deleteSales = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
    showNotification('info', 'Data penjualan telah dihapus.');
  };

  const verifySales = (id: string, status: 'Disetujui' | 'Direvisi', notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSales(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status,
            catatanRevisi: status === 'Direvisi' ? notes : undefined,
            catatan: status === 'Disetujui' && notes ? notes : s.catatan,
            diverifikasiOleh: currentUser?.name || 'admin',
            tanggalVerifikasi: today,
          };
        }
        return s;
      })
    );
    showNotification(
      status === 'Disetujui' ? 'success' : 'info',
      `Transaksi ${status === 'Disetujui' ? 'berhasil disetujui' : 'telah dikembalikan untuk revisi staff'}.`
    );
  };

  // Cash Flow CRUD Handlers
  const addCashFlow = (data: Omit<CashFlowTransaction, 'id'>): string => {
    const newId = `CF-${Date.now()}`;
    const newRecord: CashFlowTransaction = {
      ...data,
      id: newId,
    };
    setCashFlow(prev => [newRecord, ...prev]);
    showNotification('success', `Data ${data.tipe.toLowerCase()} ${data.noBukti} berhasil dicatat.`);
    return newId;
  };

  const updateCashFlow = (id: string, data: Partial<CashFlowTransaction>) => {
    setCashFlow(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    showNotification('success', 'Data arus kas berhasil diperbarui.');
  };

  const deleteCashFlow = (id: string) => {
    setCashFlow(prev => prev.filter(c => c.id !== id));
    showNotification('info', 'Catatan arus kas telah dihapus.');
  };

  // DPK Evaluation
  const addEvaluation = (data: Omit<ReportEvaluation, 'id'>) => {
    const newId = `EVL-${Date.now()}`;
    const newRecord: ReportEvaluation = { ...data, id: newId };
    setEvaluations(prev => [newRecord, ...prev]);
    showNotification('success', 'Evaluasi laporan keuangan berhasil disimpan oleh DPK.');
  };

  // Import Batch Excel Simulation
  const importSalesBatch = (newItems: Omit<SalesTransaction, 'id'>[]): { count: number; duplicates: number } => {
    const existingInvoices = new Set(sales.map(s => s.noInvoice.trim().toLowerCase()));
    const toInsert: SalesTransaction[] = [];
    let duplicates = 0;

    newItems.forEach((item, index) => {
      const invClean = item.noInvoice.trim().toLowerCase();
      if (existingInvoices.has(invClean)) {
        duplicates++;
      } else {
        existingInvoices.add(invClean);
        toInsert.push({
          ...item,
          id: `IMP-${Date.now()}-${index}`,
        });
      }
    });

    if (toInsert.length > 0) {
      setSales(prev => [...toInsert, ...prev]);
      showNotification('success', `Berhasil mengimpor ${toInsert.length} data penjualan.`);
    } else {
      showNotification('info', 'Tidak ada data baru yang diimpor (semua invoice sudah terdaftar).');
    }

    return { count: toInsert.length, duplicates };
  };

  // Reset Data to Default Initial Demo
  const resetToDemoData = () => {
    setSales(INITIAL_SALES);
    setCashFlow(INITIAL_CASH_FLOW);
    setCoa(INITIAL_COA);
    setAssets(INITIAL_ASSETS);
    setDewanLoans(INITIAL_DEWAN_LOANS);
    setEvaluations(INITIAL_EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.CASH_FLOW);
    localStorage.removeItem(STORAGE_KEYS.COA);
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.DEWAN_LOANS);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    showNotification('info', 'Data sistem telah direset ke data acuan Excel Lapak Elka 2026.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        activeMenu,
        setActiveMenu,
        searchQuery,
        setSearchQuery,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        login,
        loginAsDemo,
        logout,
        sales,
        cashFlow,
        coa,
        assets,
        dewanLoans,
        evaluations,
        stats,
        addSales,
        updateSales,
        deleteSales,
        verifySales,
        addCashFlow,
        updateCashFlow,
        deleteCashFlow,
        addEvaluation,
        importSalesBatch,
        resetToDemoData,
        notification,
        showNotification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
