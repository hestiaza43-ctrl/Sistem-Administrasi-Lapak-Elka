import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { DpkDashboard } from './pages/DpkDashboard';
import { SalesPage } from './pages/SalesPage';
import { CashFlowPage } from './pages/CashFlowPage';
import { CoaPage } from './pages/CoaPage';
import { TrialBalancePage } from './pages/TrialBalancePage';
import { IncomeStatementPage } from './pages/IncomeStatementPage';
import { BalanceSheetPage } from './pages/BalanceSheetPage';
import { DebtReceivablePage } from './pages/DebtReceivablePage';
import { AssetsPage } from './pages/AssetsPage';
import { VerificationPage } from './pages/VerificationPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckCircle2, AlertCircle, Info, X, Menu } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, activeMenu, notification, clearNotification } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderActiveScreen = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'dashboard-staff':
        return <StaffDashboard />;
      case 'dashboard-dpk':
        return <DpkDashboard />;
      case 'sales-all':
        return <SalesPage initialFilter="all" />;
      case 'sales-siplah':
        return <SalesPage initialFilter="SIPLAH" />;
      case 'sales-non-siplah':
        return <SalesPage initialFilter="Non-SIPLAH" />;
      case 'staff-input-sales':
        return <SalesPage initialFilter="all" />;
      case 'dpk-sales-summary':
      case 'dpk-sales-performance':
        return <DpkDashboard />;
      case 'cash-in':
      case 'staff-input-cash-in':
        return <CashFlowPage defaultTab="Pemasukan" />;
      case 'cash-out':
      case 'staff-input-cash-out':
        return <CashFlowPage defaultTab="Pengeluaran" />;
      case 'cash-bank':
        return <CashFlowPage defaultTab="all" />;
      case 'coa':
        return <CoaPage />;
      case 'trial-balance':
        return <TrialBalancePage />;
      case 'income-statement':
        return <IncomeStatementPage />;
      case 'balance-sheet':
        return <BalanceSheetPage />;
      case 'debt-receivable':
        return <DebtReceivablePage />;
      case 'assets':
        return <AssetsPage />;
      case 'verification':
        return <VerificationPage />;
      case 'dpk-evaluation':
        return <EvaluationPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return currentUser.role === 'ADMIN' ? (
          <AdminDashboard />
        ) : currentUser.role === 'STAFF' ? (
          <StaffDashboard />
        ) : (
          <DpkDashboard />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FC]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-white h-full shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with mobile menu toggle */}
        <div className="relative">
          <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-xs text-slate-800">Lapak Elka 2026</span>
          </div>
          <Header />
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 duration-200 max-w-md">
          {notification.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
          {notification.type === 'error' && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Info size={18} className="text-sky-400 shrink-0" />}
          <p className="text-xs font-medium leading-relaxed">{notification.message}</p>
          <button
            onClick={clearNotification}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-auto"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
